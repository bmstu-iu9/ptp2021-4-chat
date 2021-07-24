const {generateAndSaveSessionId} = require('../services/common')
const {tryRegisterUser} = require('../services/registration')
const {redirectIfSessionProvided} = require('../middleware/session')
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {urls} = require('../constants')
const {apiRouter} = require('../definitions')


apiRouter.post('/register', [
    redirectIfSessionProvided(urls.index),
    usernameAndPassword.sendErrorIfNotProvidedOrNotValid
  ],
  (request, response) => {
    const {username, password} = request.body

    tryRegisterUser(username, password).then(user => {
      if (!user) {
        return response.status(409)
        .send('Пользователь с заданным username уже существует')
      }

      generateAndSaveSessionId(user).then(({sessionId, expirationDate}) => {
        response.cookie('sessionId', sessionId, {
          expires: expirationDate
        }).redirect('/')
      })
    })
  })
