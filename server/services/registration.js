const bcrypt = require('bcrypt')
const {User, Password} = require('../models/user')


/**
 * Проверяет наличие пользователя в базе данных и в случае его отсутсвия
 * добавляет пользователя в неё
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User, null} - Модель пользователя из базы данных или null если
 *                   пользователь уже существует
 */
async function tryRegisterUser(username, password) {
  const foundUser = await User.findOne({
    where: {username}
  })

  if (foundUser) {
    return null
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
  tryRegisterUser
}
