const {generateAndSaveSessionId} = require("../services/common");
const {tryAuthenticateUser} = require("../services/authentication");
const {validateUsernameAndPasswordMiddleware} = require("../middleware");
const {app} = require('../definitions')


app.post('/api/auth', validateUsernameAndPasswordMiddleware, (request, response) => {
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
