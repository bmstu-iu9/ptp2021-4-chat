const {createError} = require('../misc/utils')
const {
  errors,
  validateUsername,
  validatePassword
} = require('../../common/common')



function sendErrorIfNotProvidedOrNotValid(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password)
    || !validateUsername(username)
    || !validatePassword(password)) {
    throw createError(...Object.values(errors.incorrectBody))
  }

  next()
}

function sendErrorIfNotProvided(request, response, next) {
  const {username, password} = request.body

  if (!checkProvided(username, password)) {
    throw createError(...Object.values(errors.incorrectBody))
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
