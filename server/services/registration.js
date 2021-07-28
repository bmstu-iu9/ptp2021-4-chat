const bcrypt = require('bcrypt')
const {createError} = require('../misc/utils')
const {User, Password} = require('../models/user')
const {checkUserCredentials} = require('./common')
const {errors} = require('../../common/common')

/**
 * Проверяет наличие пользователя в базе данных и в случае его отсутсвия
 * добавляет пользователя в неё
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User} - Модель пользователя из базы данных
 */
async function registerOrAuthUser(username, password) {
  const foundUser = await User.findOne({
    where: {
      username: username.toLowerCase()
    }
  })

  if (foundUser) {
    const result = await checkUserCredentials(foundUser, password)

    if (!result) {
      throw errors.usernameAlreadyRegistered
    }

    return foundUser
  }


  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)

  return await User.create({
    username,
    password: {password: hashed}
  }, {
    include: Password
  })
}


module.exports = {
  registerOrAuthUser
}
