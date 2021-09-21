const {getAllConversationsWithLastMessage} = require('../../../services/common')


module.exports = async (context, localContext) => {
  const {user} = context.current

  const conversations = await getAllConversationsWithLastMessage(user)

  localContext.answer(conversations)
}