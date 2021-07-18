const usernameAndPassword = require("../middleware/usernameAndPassword");
const {app} = require('../definitions')
const {tryRegisterUser} = require('../services/registration')
const {generateAndSaveSessionId} = require('../services/common')


app.post('/api/register',
  usernameAndPassword.validate,
  (request, response) => {
  const {username, password} = request.body

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
