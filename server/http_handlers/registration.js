const {app} = require('../definitions')
const {
  validateLoginAndPassword,
  tryRegisterUser,
  generateAndSaveSessionId
} = require('../services/registration')


app.post('/register', (request, response) => {
  const {username, password} = request.body

  if (!validateLoginAndPassword(username, password)) {
    return response.status(400)
      .send('Некорректно заданы username или password')
  }

  tryRegisterUser(username, password)
    .then(user => {
      if (!user) {
        return response.status(409)
          .send('Пользователь с заданным username уже существует')
      }

      generateAndSaveSessionId(user).then(sessionId => {
        response.cookie('sessionId', sessionId).send()
      })
    })
})