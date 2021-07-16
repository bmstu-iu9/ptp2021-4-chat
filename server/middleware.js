const {passwordMinLength} = require("./constants");


function validateUsernameAndPasswordMiddleware(request, response, next) {
  const {username, password} = request.body

  if (!validateUsernameAndPassword(username, password)) {
    return response.status(400)
    .send('Некорректно заданы параметры username или password')
  }
  next()
}

function validateUsernameAndPassword(login, password) {
  if (!login || !password) {
    return false
  }

  if (typeof login !== 'string' || typeof password !== 'string') {
    return false
  }

  return password.length >= passwordMinLength
}


module.exports = {
  validateUsernameAndPasswordMiddleware
}
