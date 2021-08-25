const WSError = require('../../../misc/WSError')
const processObjectAccordingConfig = require('../../../misc/objectProcessor')
const {fullConversationConfig} = require('./configs')
const {Session} = require('../../../database/models/session')
const {User} = require('../../../database/models/user')
const {Op} = require('sequelize')
const {Conversation} = require('../../../database/models/conversation')
const {DiscussionMeta} = require('../../../database/models/discussion')
const {Sequelize} = require('sequelize')
const {ConversationParticipant} = require('../../../database/models/conversation')


function getIncludesForConversation(userId) {
  return [
    [Sequelize.literal('CURRENT_TIMESTAMP'), 'generatedAt'],
    [Sequelize.cast(Sequelize.literal(
      `(
         (SELECT COUNT(*) FROM "messages" WHERE "userId" != ${userId} AND "conversationId" = "conversation"."id") 
           - 
         (SELECT COUNT(*) FROM "readMessages" WHERE "userId" = ${userId} AND "messageId" IN 
           (SELECT "id" FROM "messages" WHERE "userId" != ${userId} AND "conversationId" = "conversation"."id")
         )
       )`
    ), 'integer'), 'unreadCount'],
    [Sequelize.literal(
      `(SELECT json_agg(row) FROM 
         (SELECT "id", "username" FROM "users" WHERE "id" IN 
           (SELECT "userId" FROM "conversationParticipants" WHERE "conversationId" = "conversation"."id" AND "userId" != ${userId})
         ) as "row"
       )`
    ),
      'participants'
    ]
  ]
}

async function fetchConversation(conversationId, userId) {
  const conversation = await Conversation.findOne({
    attributes: {
      include: getIncludesForConversation(userId)
    },
    where: {
      id: conversationId
    },
    include: [{
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId
      }
    }, DiscussionMeta]
  })

  return conversation ? conversation.toJSON() : null
}

async function fetchAllConversations(userId) {
  return (await Conversation.findAll({
    attributes: {
      include: getIncludesForConversation(userId)
    },
    include: [{
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId
      }
    }, DiscussionMeta]
  })).map(conversation => conversation.toJSON())
}

async function getConversation(conversationId, user, config = null) {
  const conversation = await fetchConversation(conversationId, user.id)

  if (conversation && config) {
    processObjectAccordingConfig(conversation, config)
  }

  return conversation
}

async function getAllConversations(user, config = null) {
  const conversations = await fetchAllConversations(user.id)

  if (config) {
    conversations.forEach(conversation => processObjectAccordingConfig(conversation, config))
  }

  return conversations
}

async function checkUserHasAccessToConversation(conversationId, user) {
  const conversation = await fetchConversation(conversationId, user.id)
  if (!conversation) {
    throw new WSError('Conversation с таким id не существует')
  }

  return conversation
}

async function fetchConversationParticipants(conversationId) {
  return (await ConversationParticipant.findAll({
    where: {
      conversationId
    },
    attributes: [],
    include: {
      model: User,
      include: [Session]
    }
  }))
  .map(participant => participant.user.toJSON())
}

async function getConversationParticipantsSessionsIds(conversationId) {
  const participants = await fetchConversationParticipants(conversationId)

  const sessions = {}
  participants.forEach(participant => {
    const {sessions: userSessions, ...user} = participant

    userSessions.forEach(({sessionId}) => {
      sessions[sessionId] = user
    })
  })

  return sessions
}

async function getDialog(currentUserId, participantUserId) {
  const dialog = await fetchUsersDialog(currentUserId, participantUserId)

  if (dialog) {
    processObjectAccordingConfig(dialog, fullConversationConfig)
  }

  return dialog
}

async function fetchUsersDialog(currentUserId, participantId) {
  const userDialogs1 = (await fetchAllConversations(currentUserId))
  .filter(conversation => conversation.type === 'dialog')

  const dialog = await ConversationParticipant.findOne({
    where: {
      userId: participantId
    },
    attributes: [],
    include: {
      model: Conversation,
      attributes: {
        include: getIncludesForConversation(currentUserId)
      },
      required: true,
      include: DiscussionMeta,
      where: {
        type: 'dialog',
        id: {
          [Op.in]: userDialogs1.map(dialog => dialog.id)
        }
      }
    }
  })

  return dialog ? dialog.conversation.toJSON() : null
}

async function saveConversation(type, userIds) {
  const createdConversation = await Conversation.create({type})
  const conversationId = createdConversation.id

  await ConversationParticipant.bulkCreate(
    userIds.map(userId => {
      return {userId, conversationId}
    })
  )

  return conversationId
}

async function saveDiscussionMeta(conversationId, name) {
  await DiscussionMeta.create({name, conversationId})
}


module.exports = {
  getConversation,
  getAllConversations,
  checkUserHasAccessToConversation,
  getConversationParticipantsSessionsIds,
  getIncludesForConversation,
  getDialog,
  saveConversation,
  saveDiscussionMeta
}