const bcrypt = require('bcrypt')
const {User, Password} = require('../models/user')


/**
 * Ищет пользователя с заданным username и password в базе данных
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User, null} - Модель пользователя из базы данных или null если
 *                   пользователь не найден либо пароли не совпадают
 */
async function tryAuthenticateUser(username, password) {
  const foundUser = await User.findOne({
    where: {username}
  })

  if (!foundUser) {
    return null
  }

  const foundPassword = await Password.findOne({
    where: {userId: foundUser.id}
  })

  const result = await bcrypt.compare(password, foundPassword.password)

  return result ? foundUser : null
}

module.exports = {
  tryAuthenticateUser
}
