const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {User, Password} = require('../../database/models/user')
const {Session} = require('../../database/models/session')
const {sessionLifetime} = require('../../constants')


/**
 * Гененрирует session id и сохраняет его в базу данных, привязывая
 * к указанному пользователю
 * @param {User} user - Модель пользователя из базы данных
 * @returns {{string, Date}} - Id сессии и дата истечения ее срока жизни
 */
async function generateAndSaveSessionId(user) {
  const sessionId = crypto.randomBytes(16).toString('base64')
  const expirationDate = new Date(Date.now() + sessionLifetime)

  await Session.create({
    sessionId,
    expirationDate,
    userId: user.id
  })

  return {sessionId, expirationDate}
}

/**
 * Проверяет наличие куки с сессей, проверят наличие id сессии в базе данных
 * и проверяет, не истекла ли сессия.
 * Если истекла - обновляет её дату истечения
 * @param request - объект запроса express
 * @param response - объект ответа express
 * @returns {Promise<boolean>} - true если сессия валидна, false в противном
 * случае
 */
async function checkSession(request, response) {
  const sessionId = request.cookies.sessionId
  if (!sessionId) {
    return false
  }

  const session = await Session.findOne({
    where: {sessionId}
  })

  if (!session) {
    return false
  }

  if (session.expirationDate.getSeconds() <= Date.now()) {
    // Обновление сессии в случае, если она истекла
    const newExpirationDate = new Date(Date.now() + sessionLifetime)
    await session.update({newExpirationDate})
    response.cookie('sessionId', sessionId, {expires: newExpirationDate})
  }

  return true
}

async function checkUserCredentials(user, password) {
  if (!user) {
    return false
  }

  const foundPassword = await Password.findOne({
    where: {
      userId: user.id
    }
  })

  return await bcrypt.compare(password, foundPassword.password)
}


module.exports = {
  checkSession,
  generateAndSaveSessionId,
  checkUserCredentials
}
