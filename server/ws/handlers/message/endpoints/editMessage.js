const {getConversation} = require('../../../services/conversation')
const {sendDataToClients} = require('../../../../misc/utils')
const {getConversationParticipants} = require('../../../services/conversation')
const {editMessage} = require('../../../services/messages')
const {checkUserHasAccessToConversation} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = async (context, payload) => {
  const user = context.current.user
  const {conversationId, relativeId, content} = payload.meta

  await checkUserHasAccessToConversation(user, conversationId)

  const message = await editMessage(conversationId, relativeId, content)

  const sessions = (await getConversationParticipants(conversationId))
  .flatMap(participant => participant.sessions)
  .map(session => session.sessionId)

  const clients = context.clients.filter(client =>
      sessions.includes(client.session.sessionId)
  )

  const conversation = await getConversation(user, conversationId)

  await sendDataToClients(clients, {
    notificationType: 'newMessageState',
    conversation,
    messageState: {
      relativeId: message.relativeId,
      edited: true,
      content,
      generationTimestamp: new Date().toISOString()
    }
  })
}