const {WSRequestError} = require('../../../../misc/wsErrors')
const {checkUsersExist} = require('../../../services/users')
const {saveConversation} = require('../../../services/conversations')
const {emit} = require('../../../services/common')
const {getConversationClients} = require('../../../services/common')
const {getConversation} = require('../../../services/conversations')
const {getDialog} = require('../../../services/conversations')
const {fullConversationConfig} = require('../../../services/conversations/configs')


module.exports = async (context, localContext, payload) => {
  const {user, session} = context.current
  const userId = payload.meta.userId

  if (!await checkUsersExist([userId])) {
    throw new WSRequestError('Пользователя с таким id не существует')
  }

  if (user.id === userId) {
    throw new WSRequestError('Нельзя создать диалог с самим собой')
  }

  const dialog = await getDialog(user.id, userId)

  if (dialog) {
    localContext.answer({conversation: dialog})
    return
  }
  const conversationId = await saveConversation('dialog', [userId, user.id])

  await emit('newConversation', localContext.answer, {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {conversation: await getConversation(conversationId, user, fullConversationConfig)}
    },
    getPayloadToCurrent: async () => {
      return {conversation: await getConversation(conversationId, user, fullConversationConfig)}
    }
  })
}