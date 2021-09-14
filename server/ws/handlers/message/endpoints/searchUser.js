const {getUserByUsername} = require('../../../services/users')


module.exports = async (context, localContext, payload) => {
  const {username} = payload.meta

  const user = await getUserByUsername(username)

  localContext.answer({user})
}