const bcrypt = require('bcrypt')
const {createError} = require('../misc/utls')
const {User, Password} = require('../models/user')


/**
 * Проверяет наличие пользователя в базе данных и в случае его отсутсвия
 * добавляет пользователя в неё
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User} - Модель пользователя из базы данных
 */
async function registerUser(username, password) {
  const foundUser = await User.findOne({
    where: {username}
  })

  if (foundUser) {
    throw createError(409, 'Пользователь с заданным username уже существует')
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
  registerUser
}
