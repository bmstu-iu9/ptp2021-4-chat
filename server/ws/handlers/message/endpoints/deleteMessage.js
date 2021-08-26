const {WSRequestError} = require('../../../../misc/wsErrors')
const {getDeletedMessage} = require('../../../services/messages')
const {getConversationClients} = require('../../../services/common')
const {getConversation} = require('../../../services/conversations')
const {emit} = require('../../../services/common')
const {deletedMessageStateConfig} = require('../../../services/messages/configs')
const {onlyIdConversationConfig} = require('../../../services/conversations/configs')
const {
  deleteMessage,
  checkUserHasAccessToMessage
} = require('../../../services/messages')
const {checkUserHasAccessToConversation} = require('../../../services/conversations')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const {conversationId, relativeId} = payload.meta


  await checkUserHasAccessToConversation(conversationId, user)
  const message = await checkUserHasAccessToMessage(conversationId, relativeId, user)

  if (message.deleted) {
    throw new WSRequestError('Сообщения с указанным id не существует')
  }

  await deleteMessage(conversationId, relativeId)

  await emit('newMessageState', {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getDeletedMessage(conversationId, relativeId, user, deletedMessageStateConfig)
      }
    },
    getPayloadToCurrent: async () => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getDeletedMessage(conversationId, relativeId, user, deletedMessageStateConfig)
      }
    }
  })
}