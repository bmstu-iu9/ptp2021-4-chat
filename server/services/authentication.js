const bcrypt = require('bcrypt')
const {createError} = require('../misc/utls')
const {User, Password} = require('../models/user')


/**
 * Ищет пользователя с заданным username и password в базе данных
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User, null} - Модель пользователя из базы данных или null если
 *                   пользователь не найден либо пароли не совпадают
 */
async function authenticateUser(username, password) {
  const foundUser = await User.findOne({
    where: {
      username: username.toLowerCase()
    }
  })

  if (!foundUser) {
    throw createError(401, 'Пользователь с заданным username и password не найден')
  }

  const foundPassword = await Password.findOne({
    where: {userId: foundUser.id}
  })

  const result = await bcrypt.compare(password, foundPassword.password)

  return result ? foundUser : null
}


module.exports = {
  authenticateUser
}
