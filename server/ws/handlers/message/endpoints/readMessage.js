const {WSRequestError} = require('../../../../misc/wsErrors')
const {getConversation} = require('../../../services/conversations')
const {getConversationClients} = require('../../../services/common')
const {emit} = require('../../../services/common')
const {checkMessageReadByUser} = require('../../../services/messages')
const {readMessageStateConfig} = require('../../../services/messages/configs')
const {onlyIdConversationConfig} = require('../../../services/conversations/configs')
const {getMessage, readMessage} = require('../../../services/messages')
const {checkUserHasAccessToConversation} = require('../../../services/conversations')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const {conversationId, relativeId} = payload.meta


  await checkUserHasAccessToConversation(conversationId, user)
  const message = await getMessage(conversationId, relativeId, user)

  if (!message) {
    throw new WSRequestError('Сообщения с указанным id не существует')
  }

  if (message.user.id === user.id) {
    throw new WSRequestError('Нельзя прочитать собственное сообщение')
  }

  if (await checkMessageReadByUser(message, user)) {
    throw new WSRequestError('Сообщение уже было прочитано')
  }

  await readMessage(conversationId, relativeId, user)

  await emit('newMessageState', {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getMessage(conversationId, relativeId, user, readMessageStateConfig)
      }
    },
    getPayloadToCurrent: async () => {
      return {
        conversation: await getConversation(conversationId, user, onlyIdConversationConfig),
        messageState: await getMessage(conversationId, relativeId, user, readMessageStateConfig)
      }
    }
  })
}