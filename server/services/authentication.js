const bcrypt = require('bcrypt')
const {createError} = require('../misc/utls')
const {User, Password} = require('../models/user')
const {checkUserCredentials} = require('./common')

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
    throw createError(401, 'Пользователь с заданным username и password не найден')
  }

  const result = await checkUserCredentials(foundUser, password)

  if (!result) {
    throw createError(401, 'Пользователь с заданным username и password не найден')
  }

  return foundUser
}


module.exports = {
  authenticateUser
}
