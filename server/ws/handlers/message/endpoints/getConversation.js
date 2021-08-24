const {fullMessageConfig} = require('../../../services/messages/configs')
const {getMessages} = require('../../../services/messages')
const {fullConversationConfig} = require('../../../services/conversations/configs')
const {getConversation} = require('../../../services/conversations')


module.exports = async (context, payload) => {
  const {user} = context.current
  const {conversationId, relativeId} = payload.meta

  const conversation = await getConversation(conversationId, user, fullConversationConfig)
  const messages = await getMessages(conversationId, user, fullMessageConfig, relativeId)

  context.socket.answer({conversation, messages})
}

