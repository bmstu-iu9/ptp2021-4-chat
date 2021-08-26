const {WSRequestError} = require('../../../../misc/wsErrors')
const {getMessage} = require('../../../services/messages')
const {getConversation} = require('../../../services/conversations')
const {getConversationClients} = require('../../../services/common')
const {emit} = require('../../../services/common')
const {checkUserHasAccessToConversation} = require('../../../services/conversations')
const {saveMessage} = require('../../../services/messages')
const {
  onlyIdConversationConfig,
  newMessageConversationConfig
} = require('../../../services/conversations/configs')
const {
  newMessageConfig,
  createMessageConfig
} = require('../../../services/messages/configs')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const {conversationId, contentType, value, files} = payload.meta

  if (contentType === 'text' && value === '') {
    throw new WSRequestError('Сообщение не может быть пустым')
  }

  await checkUserHasAccessToConversation(conversationId, user)

  const relativeId = await saveMessage(conversationId, contentType, value, files, user)

  await emit('newMessage', {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {
        conversation: await getConversation(conversationId, user, newMessageConversationConfig),
        message: await getMessage(conversationId, relativeId, user, newMessageConfig)
      }
    },
    getPayloadToCurrent: async () => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        message: await getMessage(conversationId, relativeId, user, createMessageConfig)
      }
    }
  })
}