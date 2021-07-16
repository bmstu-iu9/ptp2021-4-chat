const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {passwordMinLength, sessionLifetime} = require('../constants')
const {User, UserPassword} = require('../models/user')
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
  await UserPassword.create({
    password: hashedPassword,
    userId: registeredUser.id
  })

  return registeredUser
}

/**
 * Гененрирует session id и сохраняет его в базу данных, привязывая
 * к указанному пользователю
 * @param {User} user - Модель пользователя из базы данных
 * @returns {string} - Id сессии
 */
async function generateAndSaveSessionId(user) {
  const sessionId = crypto.randomBytes(16).toString('base64');
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + sessionLifetime)

  await Session.create({
    sessionId,
    expirationDate: expirationDate,
    userId: user.id
  })

  return sessionId
}

function validateLoginAndPassword(login, password) {
  if (!login || !password) {
    return false
  }

  if (typeof login !== 'string' || typeof password !== 'string') {
    return false
  }

  if (password.length < passwordMinLength) {
    return false
  }

  return true
}


module.exports = {
  tryRegisterUser,
  validateLoginAndPassword,
  generateAndSaveSessionId
}