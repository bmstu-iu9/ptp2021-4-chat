const {getConversationsWithLastMessage} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = wrapAsyncFunction(async (context, payload) => {
  const user = context.user

  const conversations = await getConversationsWithLastMessage(user)

  context.socket.answer(conversations)
})