const {getUnreadCount} = require('../../../services/messages')
const {getMessagesFromConversation} = require('../../../services/messages')
const {getConversation} = require('../../../services/conversation')
const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = wrapAsyncFunction(async (context, payload) => {
  const conversationId = payload.meta.conversationId
  const relativeId = payload.meta.relativeId
  const user = context.user

  const conversation = await getConversation(conversationId, user)

  const messages = await getMessagesFromConversation(conversationId, user, relativeId)
  const unreadCount = await getUnreadCount(messages.list)

  const answer = {
    conversation: {
      ...conversation,
      unreadCount,
    },
    messages
  }

  context.socket.answer(answer)
})

