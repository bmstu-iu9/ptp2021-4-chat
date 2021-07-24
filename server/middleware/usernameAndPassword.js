const {passwordMinLength} = require('../constants')


function sendErrorIfNotProvidedOrNotValid(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password) || password.length < passwordMinLength) {
    return response.status(400)
    .send('Некорректно заданы параметры username или password')
  }

  next()
}

function sendErrorIfNotProvided(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password)) {
    return response.status(400)
    .send('Некорректно заданы параметры username или password')
  }

  next()
}

function checkProvided(login, password) {
  if (!login || !password) {
    return false
  }
  return !(typeof login !== 'string' || typeof password !== 'string')
}

module.exports = {
  sendErrorIfNotProvidedOrNotValid,
  sendErrorIfNotProvided
}
