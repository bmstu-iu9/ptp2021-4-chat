const {generateAndSaveSessionId} = require('../services/common')
const {tryAuthenticateUser} = require('../services/authentication')
const {redirectIfSessionProvided} = require('../middleware/session');
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {urls} = require('../constants');
const {apiRouter} = require('../definitions')


apiRouter.post('/auth', [
    redirectIfSessionProvided(urls.index),
    usernameAndPassword.sendErrorIfNotProvided
  ],
  (request, response) => {
    const {username, password} = request.body
    tryAuthenticateUser(username, password).then(user => {
      if (!user) {
        return response.status(401)
        .send('Пользователь с заданным username и password не найден')
      }
      generateAndSaveSessionId(user).then(({sessionId, expirationDate}) => {
        response.cookie('sessionId', sessionId, {
          expires: expirationDate
        }).redirect('/')
      })
    })
  })
