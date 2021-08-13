const HTTPError = require('../../misc/HTTPError')
const {User} = require('../../models/user')
const {checkUserCredentials} = require('./common')
const {errors} = require('../../../common/common')


/**
 * Ищет пользователя с заданным username и password в базе данных
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User} - Модель пользователя из базы данных
 */
async function authenticateUser(username, password) {
  const foundUser = await User.findOne({
    where: {
      username: username.toLowerCase()
    }
  })

  if (!foundUser) {
    throw new HTTPError(errors.usernameNotRegistered)
  }

  const result = await checkUserCredentials(foundUser, password)

  if (!result) {
    throw new HTTPError(errors.incorrectPassword)
  }

  return foundUser
}


module.exports = {
  authenticateUser
}
