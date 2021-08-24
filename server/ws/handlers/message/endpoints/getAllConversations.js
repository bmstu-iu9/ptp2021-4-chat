const {getAllConversationsWithLastMessage} = require('../../../services/common')


module.exports = async context => {
  const {user} = context.current

  const conversations = await getAllConversationsWithLastMessage(user)

  context.socket.answer(conversations)
}