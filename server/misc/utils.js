const HTTPError = require('./HTTPError')
const {getConversationParticipants} = require('../ws/services/conversation')
const {
  errors,
  validateUsername,
  validatePassword
} = require('../../common/common')


/**
 * Оборачивает хендлер в функцию, которая верным образом обрабатывает
 * исключение в случае его возникновения
 */
function wrapAsyncFunction(asyncFunction) {
  return async (...args) => {
    const next = args[args.length - 1]
    return await asyncFunction(...args).catch(next)
  }
}

/**
 * Проверяет username и password при помощи общих функций валидации
 * и в случае их некорректности выбрасывает исключение (только для express)
 * @param username - имя пользователя
 * @param password - пароль
 */
function validateUsernameAndPassword(username, password) {
  if (typeof username !== 'string'
    || typeof password !== 'string'
    || !validateUsername(username)
    || !validatePassword(password)
  ) {
    throw new HTTPError(errors.incorrectBody)
  }
}


async function sendDataToClients(clients, data) {
  clients.forEach(client => {
    client.socket.send(JSON.stringify(data))
  })
}


module.exports = {
  wrapAsyncFunction,
  validateUsernameAndPassword,
  sendDataToClients
}