const {getConversationsWithMessages} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = async (context, payload) => {
  const {conversationId, relativeId} = payload.meta
  const user = context.current.user

  const conversation = await getConversationsWithMessages(user, {
    conversationId,
    relativeId
  })

  return context.socket.answer(conversation)
}

