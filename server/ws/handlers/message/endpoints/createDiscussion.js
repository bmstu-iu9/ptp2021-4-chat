const {WSRequestError} = require('../../../../misc/wsErrors')
const {fullConversationConfig} = require('../../../services/conversations/configs')
const {getConversation} = require('../../../services/conversations')
const {getConversationClients} = require('../../../services/common')
const {emit} = require('../../../services/common')
const {saveDiscussionMeta} = require('../../../services/conversations')
const {saveConversation} = require('../../../services/conversations')
const {checkUsersExist} = require('../../../services/users')


module.exports = async (context, localContext, payload) => {
  const {user, session} = context.current
  const {name, userIds} = payload.meta

  if (userIds.includes(user.id)) {
    throw new WSRequestError('Массив НЕ должен содержать id текущего пользователя')
  }

  if (userIds.length < 1) {
    throw new WSRequestError('Массив id должен содержать хотя бы один элемент')
  }

  if (!await checkUsersExist(userIds)) {
    throw new WSRequestError('Пользователей с такими id не существует')
  }

  const conversationId = await saveConversation('discussion', [user.id, ...userIds])
  await saveDiscussionMeta(conversationId, name)

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