const processObjectAccordingConfig = require('../../misc/objectProcessor')
const {DiscussionMeta} = require('../../database/models/discussion')
const {Content} = require('../../database/models/content')
const {User} = require('../../database/models/user')
const {Message} = require('../../database/models/message')
const {ConversationParticipant} = require('../../database/models/conversation')
const {Conversation} = require('../../database/models/conversation')
const {fullMessageConfig} = require('./messages/configs')
const {fullConversationConfig} = require('./conversations/configs')
const {wssClients} = require('../../definitions')
const {
  getMessage,
  getIncludesForMessage
} = require('./messages')
const {
  mapArrayToObject,
  intersectObjectKeys
} = require('../../misc/utils')
const {
  getConversationParticipantsSessionsIds,
  getIncludesForConversation,
  getConversation
} = require('./conversations')


async function getConversationClients(conversationId, currentSessionId) {
  const ids = await getConversationParticipantsSessionsIds(conversationId, currentSessionId)
  return {
    other: mapArrayToObject(
      intersectObjectKeys(wssClients, ids).filter(sessionId => sessionId !== currentSessionId),
      sessionId => {
        return {socket: wssClients[sessionId], user: ids[sessionId]}
      }
    ),
    current: {
      socket: wssClients[currentSessionId],
      user: ids[currentSessionId]
    }
  }
}

async function notifyClients(type, clients, buildPayload) {
  await Promise.all(Object.values(clients).map(async ({user, socket}) => {
    const payload = await buildPayload(user)

    socket.send(JSON.stringify({
      notificationType: type,
      ...payload
    }))
  }))
}

async function fetchAllConversationsWithLastMessage(user) {
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
    }, {
      model: Message,
      where: {
        deleted: false
      },
      include: [User, Content],
      attributes: {
        include: getIncludesForMessage(user)
      },
      order: [['relativeId', 'DESC']],
      limit: 1
    }, DiscussionMeta]
  })).map(conversation => conversation.toJSON())
}

async function getAllConversationsWithLastMessage(user) {
  const conversations = await fetchAllConversationsWithLastMessage(user)

  const result = []

  conversations.forEach(fetchedConversation => {
    const {messages, ...conversation} = fetchedConversation

    processObjectAccordingConfig(conversation, fullConversationConfig)
    let lastMessage = null
    if (messages.length !== 0) {
      lastMessage = messages[0]
      processObjectAccordingConfig(lastMessage, fullMessageConfig)
    }

    result.push({conversation, lastMessage})
  })

  return result
}

async function emit(type, functions) {
  const clients = await functions.getClients()
  await notifyClients(type, clients.other, async user => {
    return await functions.getPayloadToOther(user)
  })

  const payload = await functions.getPayloadToCurrent()

  clients.current.socket.answer(payload)
}


module.exports = {
  getConversationClients,
  notifyClients,
  getAllConversationsWithLastMessage,
  emit
}