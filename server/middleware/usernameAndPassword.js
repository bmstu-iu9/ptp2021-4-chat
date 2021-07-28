const {passwordMinLength} = require('../constants')
const {errors} = require('../../common/common')


function sendErrorIfNotProvidedOrNotValid(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password) || password.length < passwordMinLength) {
    return response.status(errors.incorrectBody.code)
    .send(errors.incorrectBody.message)
  }

  next()
}

function sendErrorIfNotProvided(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password)) {
    return response.status(errors.incorrectBody.code)
    .send(errors.incorrectBody.message)
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
