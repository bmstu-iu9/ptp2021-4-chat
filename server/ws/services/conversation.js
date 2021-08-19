const WSError = require('../../misc/WSError')
const {Session} = require('../../database/models/session')
const {Sequelize} = require('sequelize')
const {messagesCountPerRequest} = require('../../constants')
const {Op} = require('sequelize')
const {User} = require('../../database/models/user')
const {Content} = require('../../database/models/content')
const {Message} = require('../../database/models/message')
const {Conversation} = require('../../database/models/conversation')
const {ConversationParticipant} = require('../../database/models/conversation')


async function getConversationParticipants(conversationId) {
  const participants = await ConversationParticipant.findAll({
    where: {
      conversationId
    },
    attributes: [],
    include: {
      model: User,
      attributes: {
        exclude: ['createdAt']
      },
      include: {
        model: Session,
        attributes: {
          exclude: ['expirationDate', 'userId']
        }
      }
    }
  })

  return participants.map(participant => participant.user.toJSON())
}

async function checkUserHasAccessToConversation(user, conversationId) {
  return (await getConversation(user, conversationId)) !== null
}

async function getConversation(user, conversationId) {
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId
    },
    include: {
      model: ConversationParticipant,
      where: {
        userId: user.id
      }
    }
  })

  return conversation
}


async function getConversationWithLastMessage(user, conversationId) {
  const conversation = await getConversationsWithMessages(user, {conversationId})

  conversation.lastMessage = conversation.messages[0]
  conversation.lastMessage.self = conversation.lastMessage.user.id === user.id

  if (!conversation.lastMessage.self) {
    conversation.lastMessage.read = null
  }

  delete conversation.messages

  return conversation
}

async function getConversationsWithLastMessage(user) {
  const conversations = await getConversationsWithMessages(user)

  conversations.forEach(c => {
    c.lastMessage = c.messages[0]
    delete c.messages
  })

  return conversations
}

/**
 * Осуществляет поиск в базе данных всех диалогов и бесед, в которых состоит
 * пользователь, или (опционально) ищет конкретную беседу/диалог по его `conversationId`.
 * Возвращает объект(ы), в котором(-ых) содержится иформация о диалоге/беседе
 * и список последних N сообщений. Если указан параметр `relativeId`, то
 * в список сообщений войдут N сообщений, значение `relativeId` которых
 * меньше указанного (N сообщений отправленых раньше указанного).
 *
 * **Важно**: параметр `relativeId` оказывает воздействие только если указан
 * параметр `conversationId`
 * @param user {User} - модель пользователя
 * @param {Object} [meta] - Объект, в котором опционально можно указать
 * `conversationId` и `relativeId`. Если `conversationId` не указан,
 * то осуществяется поиск всех диалогов/бесед, в которых состоит пользователь
 * @returns {Object|Object[]}
 */
async function getConversationsWithMessages(user, meta) {
  const {
    whereOption,
    request
  } = parseMeta(meta)

  const entry = await request.method({
    attributes: {
      exclude: ['createdAt'],
      include: [
        [Sequelize.literal('CURRENT_TIMESTAMP'), 'generationTimestamp'],
        [Sequelize.cast(Sequelize.literal(
          `((SELECT COUNT(*) FROM "messages" WHERE "userId" != ${user.id} AND "conversationId" = "conversation"."id") -` +
          ` (SELECT COUNT(*) FROM "readMessages" WHERE "userId" = ${user.id} AND "messageId" IN` +
          ` (SELECT "id" FROM "messages" WHERE "userId" != ${user.id} AND "conversationId" = "conversation"."id")` +
          '))'
        ), 'integer'), 'unreadCount'],
        [Sequelize.literal(
          '(SELECT ARRAY(SELECT "username" FROM "users" WHERE "id" IN' +
          ' (SELECT "userId" FROM "conversationParticipants"' +
          ` WHERE "conversationId" = "conversation"."id" AND "userId" != ${user.id})))`
        ),
          'participants'
        ]
      ]
    },
    where: whereOption.conversation,
    include: [{
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId: user.id
      }
    }, {
      model: Message,
      subQuery: true,
      where: whereOption.message,
      include: [{
        model: User,
        attributes: {
          exclude: ['id', 'createdAt']
        }
      }, {
        model: Content,
        attributes: {
          exclude: ['id']
        }
      }],
      attributes: {
        exclude: ['id', 'contentId', 'userId', 'conversationId', 'deleted', 'deletedAt', 'editedAt'],
        include: [
          [Sequelize.literal('CURRENT_TIMESTAMP'), 'generationTimestamp'],
          [Sequelize.literal(`("userId"=${user.id})`), 'self'],
          [Sequelize.literal(
            `(SELECT CASE WHEN COUNT(*) > 0 THEN true END FROM "readMessages"` +
            ` WHERE "messageId" = "message"."id")`
          ), 'read']
        ]
      },
      order: [['relativeId', 'DESC']],
      limit: messagesCountPerRequest
    }]
  })

  if (!entry) {
    throw new WSError(`Conversation с указанным id не найден)`)
  }

  if (request.isFindOne) {
    const {messages, ...conversation} = entry.toJSON()
    return {conversation, messages}
  }

  return entry.map(e => {
    const {messages, ...conversation} = e.toJSON()
    return {conversation, messages}
  })
}

function parseMeta(meta) {
  const {conversationId, relativeId} = meta || {}

  const whereOption = {conversation: {}, message: {}}
  const request = {}

  request.method = Conversation.findAll.bind(Conversation)
  request.isFindOne = false

  if (Number.isInteger(conversationId)) {
    whereOption.conversation.id = conversationId

    request.method = Conversation.findOne.bind(Conversation)
    request.isFindOne = true

    if (Number.isInteger(relativeId)) {
      whereOption.message.relativeId = {[Op.lt]: relativeId}
    }
  }

  return {
    whereOption,
    request
  }
}


module.exports = {
  getConversationsWithLastMessage,
  getConversationsWithMessages,
  getConversationWithLastMessage,
  getConversation,
  checkUserHasAccessToConversation,
  getConversationParticipants
}