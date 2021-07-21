const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {passwordMinLength, sessionLifetime} = require('../constants')
const {User, Password} = require('../models/user')
const {Session} = require('../models/session')


/**
 * Проверяет наличие пользователя в базе данных и в случае его отсутсвия
 * добавляет пользователя в неё
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User, null} - Модель пользователя из базы данных или null если
 *                   пользователь уже существует
 */
async function tryRegisterUser(username, password) {
  const user = await User.findOne({
    where: {username}
  })

  if (user) {
    return null
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt)

  const registeredUser = await User.create({username})
  await Password.create({
    password: hashedPassword,
    userId: registeredUser.id
  })

  return registeredUser
}


module.exports = {
  tryRegisterUser
}
