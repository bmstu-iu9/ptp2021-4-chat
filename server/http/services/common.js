const crypto = require('crypto')
const bcrypt = require('bcrypt')
const {User, Password} = require('../../database/models/user')
const {Session} = require('../../database/models/session')
const {sessionLifetime} = require('../../constants')


/**
 * Гененрирует session id и сохраняет его в базу данных, привязывая
 * к указанному пользователю
 * @param {User} user - Модель пользователя из базы данных
 * @param {boolean} remember - Пользовательский флаг для запоминания
 * @returns {{string, Date}} - Id сессии и дата истечения ее срока жизни
 */
async function generateAndSaveSessionId(user, remember) {
  const sessionId = crypto.randomBytes(16).toString('base64')
  let expirationDate = new Date(Date.now() + sessionLifetime)
  if (remember === false){expirationDate = null}

  await Session.create({
    sessionId,
    expirationDate,
    userId: user.id
  })
  if(remember === false){expirationDate = 0}
  return {sessionId, expirationDate}
}

/**
 * Проверяет наличие куки с сессей, проверят наличие id сессии в базе данных
 * и проверяет, не истекла ли сессия.
 * Если истекла - обновляет её дату истечения. Если при этом передан
 * объект response из express, то клиенту также обновляется куки с сессией
 * @param request - объект запроса со свойством cookies
 * @param [response] - объект ответа express
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

  if (session.expirationDate && session.expirationDate.getSeconds() <= Date.now()) {
    // Обновление сессии в случае, если она истекла
    const newExpirationDate = new Date(Date.now() + sessionLifetime)
    await session.update({newExpirationDate})

    if (response) {
      response.cookie('sessionId', sessionId, {expires: newExpirationDate})
    }
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
