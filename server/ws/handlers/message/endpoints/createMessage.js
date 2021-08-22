const WSError = require('../../../../misc/WSError')
const {sendDataToClients} = require('../../../../misc/utils')
const {checkUserHasAccessToConversation} = require('../../../services/conversation')
const {saveMessage} = require('../../../services/messages')
const {getConversationWithLastMessage} = require('../../../services/conversation')


module.exports = async (context, payload) => {
  const user = context.current.user
  const {conversationId, contentType, content, files} = payload.meta

  await checkUserHasAccessToConversation(user, conversationId)

  await saveMessage(user, conversationId, contentType, content, files)

  const conversation = await getConversationWithLastMessage(user, conversationId)

  await sendDataToClients(context.clients, {
    ...conversation,
    notificationType: 'newMessage'
  })
}