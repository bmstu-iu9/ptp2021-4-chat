const WSError = require('../../../misc/WSError')
const processObjectAccordingConfig = require('../../../misc/objectProcessor')
const {Session} = require('../../../database/models/session')
const {User} = require('../../../database/models/user')
const {Op} = require('sequelize')
const {Conversation} = require('../../../database/models/conversation')
const {DiscussionMeta} = require('../../../database/models/discussion')
const {Sequelize} = require('sequelize')
const {ConversationParticipant} = require('../../../database/models/conversation')


function getIncludesForConversation(user) {
  return [
    [Sequelize.literal('CURRENT_TIMESTAMP'), 'generatedAt'],
    [Sequelize.cast(Sequelize.literal(
      `(
         (SELECT COUNT(*) FROM "messages" WHERE "userId" != ${user.id} AND "conversationId" = "conversation"."id") 
           - 
         (SELECT COUNT(*) FROM "readMessages" WHERE "userId" = ${user.id} AND "messageId" IN 
           (SELECT "id" FROM "messages" WHERE "userId" != ${user.id} AND "conversationId" = "conversation"."id")
         )
       )`
    ), 'integer'), 'unreadCount'],
    [Sequelize.literal(
      `(SELECT json_agg(row) FROM 
         (SELECT "id", "username" FROM "users" WHERE "id" IN 
           (SELECT "userId" FROM "conversationParticipants" WHERE "conversationId" = "conversation"."id" AND "userId" != ${user.id})
         ) as "row"
       )`
    ),
      'participants'
    ]
  ]
}

async function fetchConversation(conversationId, user) {
  const conversation = await Conversation.findOne({
    attributes: {
      include: getIncludesForConversation(user)
    },
    where: {
      id: conversationId
    },
    include: [{
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId: user.id
      }
    }, DiscussionMeta]
  })

  return conversation ? conversation.toJSON() : null
}

async function fetchAllConversations(user) {
  return (await Conversation.findAll({
    attributes: {
      include: getIncludesForConversation(user)
    },
    include: [{
      model: ConversationParticipant,
      attributes: [],
      where: {
        userId: user.id
      }
    }, DiscussionMeta]
  })).map(conversation => conversation.toJSON())
}

async function getConversation(conversationId, user, config = null) {
  const conversation = await fetchConversation(conversationId, user)

  if (conversation && config) {
    processObjectAccordingConfig(conversation, config)
  }

  return conversation
}

async function getAllConversations(user, config = null) {
  const conversations = await fetchAllConversations(user)

  if (config) {
    conversations.forEach(conversation => processObjectAccordingConfig(conversation, config))
  }

  return conversations
}

async function checkUserHasAccessToConversation(conversationId, user) {
  const conversation = await fetchConversation(conversationId, user)
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
      required: true,
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


module.exports = {
  getConversation,
  getAllConversations,
  checkUserHasAccessToConversation,
  getConversationParticipantsSessionsIds,
  getIncludesForConversation
}