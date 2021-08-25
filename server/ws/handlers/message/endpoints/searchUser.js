const {getUserByUsername} = require('../../../services/users')


module.exports = async (context, payload) => {
  const {username} = payload.meta

  const user = await getUserByUsername(username)

  context.socket.answer({user})
}