const WSError = require('../../../../misc/WSError')
const {checkUsersExist} = require('../../../services/users')
const {saveConversation} = require('../../../services/conversations')
const {getMessage} = require('../../../services/messages')
const {emit} = require('../../../services/common')
const {notifyClients} = require('../../../services/common')
const {getConversationClients} = require('../../../services/common')
const {getConversation} = require('../../../services/conversations')
const {getDialog} = require('../../../services/conversations')
const {Op} = require('sequelize')
const {Conversation} = require('../../../../database/models/conversation')
const {ConversationParticipant} = require('../../../../database/models/conversation')
const {fullConversationConfig} = require('../../../services/conversations/configs')
const {getAllConversations} = require('../../../services/conversations')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const userId = payload.meta.userId

  if (!await checkUsersExist([userId])) {
    throw new WSError('Пользователя с таким id не существует')
  }

  const dialog = await getDialog(user.id, userId)

  if (user.id === userId) {
    throw new WSError('Нельзя создать диалог с самим собой')
  }

  if (dialog) {
    context.socket.answer({conversation: dialog})
    return
  }
  const conversationId = await saveConversation('dialog', [userId, user.id])

  await emit('newConversation', {
    getClients: async () => await getConversationClients(conversationId, session.sessionId),
    getPayloadToOther: async (user) => {
      return {conversation: await getConversation(conversationId, user, fullConversationConfig)}
    },
    getPayloadToCurrent: async () => {
      return {conversation: await getConversation(conversationId, user, fullConversationConfig)}
    }
  })
}