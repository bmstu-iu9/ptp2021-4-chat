const {getConversationsWithLastMessage} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = async (context, payload) => {
  const user = context.current.user

  const conversations = await getConversationsWithLastMessage(user)

  context.socket.answer(conversations)
}