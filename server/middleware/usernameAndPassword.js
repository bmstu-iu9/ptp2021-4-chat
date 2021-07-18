const {passwordMinLength} = require("../constants");


// TODO: избавиться от повторяющегося кода
function validate(request, response, next) {
  const {username, password} = request.body

  if (!check(username, password) || password.length < passwordMinLength) {
    return response.status(400)
    .send('Некорректно заданы параметры username или password')
  }

  next()
}

function checkProvided(request, response, next) {
  const {username, password} = request.body

  if (!check(username, password)) {
    return response.status(400)
    .send('Некорректно заданы параметры username или password')
  }

  next()
}

function check(login, password) {
  if (!login || !password) {
    return false
  }

  if (typeof login !== 'string' || typeof password !== 'string') {
    return false
  }

  return true
}


module.exports = {
  validate,
  checkProvided
}
