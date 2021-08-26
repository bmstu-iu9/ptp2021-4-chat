const {WSRequestError} = require('../../../../misc/wsErrors')
const {getMessage} = require('../../../services/messages')
const {getConversation} = require('../../../services/conversations')
const {getConversationClients} = require('../../../services/common')
const {emit} = require('../../../services/common')
const {editedMessageStateConfig} = require('../../../services/messages/configs')
const {onlyIdConversationConfig} = require('../../../services/conversations/configs')
const {
  editMessage,
  checkUserHasAccessToMessage
} = require('../../../services/messages')
const {checkUserHasAccessToConversation} = require('../../../services/conversations')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const {conversationId, relativeId, value} = payload.meta

  if (value === '') {
    throw new WSRequestError('Сообщение не может быть пустым')
  }

  await checkUserHasAccessToConversation(conversationId, user)
  const message = await checkUserHasAccessToMessage(conversationId, relativeId, user)

  if (message.content.type !== 'text') {
    throw new WSRequestError('Сообщение не может быть отредактировано')
  }

  await editMessage(conversationId, relativeId, value)

  await emit('newMessageState', {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getMessage(conversationId, relativeId, user, editedMessageStateConfig)
      }
    },
    getPayloadToCurrent: async () => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getMessage(conversationId, relativeId, user, editedMessageStateConfig)
      }
    }
  })
}