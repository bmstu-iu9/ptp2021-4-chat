const crypto = require('crypto')
const {Session} = require("../models/session");
const {sessionLifetime} = require("../constants");
const {passwordMinLength} = require('../config')


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

  // Поиск сессии в базе данных. Если не найдена - создаем новую,
  // если найдена - обновляем
  const session = await Session.findOne({
    where: {
      userId: user.id
    }
  })

  if (!session) { // Создаем новую
    await Session.create({
      sessionId,
      expirationDate,
      userId: user.id
    })
  } else { // Обновляем
    await session.update({sessionId, expirationDate})
  }

  return sessionId
}


module.exports = {
  generateAndSaveSessionId
}
