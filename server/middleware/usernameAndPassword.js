const {passwordMinLength} = require('../constants')
const {errors} = require('../../common/common')
const {createError} = require('../misc/utils')


function sendErrorIfNotProvidedOrNotValid(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password) || password.length < passwordMinLength) {
    const error = createError(...Object.values(errors.incorrectBody))
    return response.status(error.code)
    .send(error.message)
  }

  next()
}

function sendErrorIfNotProvided(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password)) {
    const error = createError(...Object.values(errors.incorrectBody))
    return response.status(error.code)
    .send(error.message)
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
