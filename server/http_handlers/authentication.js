const {generateAndSaveSessionId} = require("../services/common");
const {tryAuthenticateUser} = require("../services/authentication");
const usernameAndPassword = require("../middleware/usernameAndPassword");
const {app} = require('../definitions')


app.post('/api/auth',
  usernameAndPassword.checkProvided,
  (request, response) => {
  const {username, password} = request.body

  tryAuthenticateUser(username, password)
    .then(user => {
      if (!user) {
        return response.status(401)
          .send('Пользователь с заданным username и password не найден')
      }

      generateAndSaveSessionId(user).then(sessionId => {
        response.cookie('sessionId', sessionId).send()
      })
    })
})
