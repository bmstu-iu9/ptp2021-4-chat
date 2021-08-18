const {getConversationsWithMessages} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = wrapAsyncFunction(async (context, payload) => {
  const conversationId = payload.meta.conversationId
  const relativeId = payload.meta.relativeId
  const user = context.user

  const conversation = await getConversationsWithMessages(user, {
    conversationId,
    relativeId
  })

  return context.socket.answer(conversation)
})

