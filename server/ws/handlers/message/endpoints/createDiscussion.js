const WSError = require('../../../../misc/WSError')
const {fullConversationConfig} = require('../../../services/conversations/configs')
const {getConversation} = require('../../../services/conversations')
const {getConversationClients} = require('../../../services/common')
const {emit} = require('../../../services/common')
const {saveDiscussionMeta} = require('../../../services/conversations')
const {saveConversation} = require('../../../services/conversations')
const {checkUsersExist} = require('../../../services/users')


module.exports = async (context, payload) => {
  const {user, session} = context.current
  const {name, userIds} = payload.meta

  if (userIds.length < 1) {
    throw new WSError('Массив id должен содержать хотя бы один элемент')
  }

  if (!await checkUsersExist(userIds)) {
    throw new WSError('Пользователей с такими id не существует')
  }

  const conversationId = await saveConversation('discussion', userIds)
  await saveDiscussionMeta(conversationId, name)

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