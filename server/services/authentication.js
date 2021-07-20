const bcrypt = require("bcrypt");
const {UserPassword} = require("../models/user");
const {User} = require("../models/user");


/**
 * Ищет пользователя с заданным username и password в базе данных
 * @param {string} username - Логин пользователя
 * @param {string} password - Пароль пользователя
 * @returns {User, null} - Модель пользователя из базы данных или null если
 *                   пользователь не найден либо пароли не совпадают
 */
async function tryAuthenticateUser(username, password) {
  const user = await User.findOne({
    where: {username}
  })

  if (!user) {
    return null
  }

  const userPassword = await UserPassword.findOne({
    where: {
      userId: user.id
    }
  })

  const result = await bcrypt.compare(password, userPassword.password)

  return result ? user : null
}

module.exports = {
  tryAuthenticateUser
}
