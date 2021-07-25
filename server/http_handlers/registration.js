const {generateAndSaveSessionId} = require('../services/common')
const {registerUser} = require('../services/registration')
const {redirectIfSessionProvided} = require('../middleware/session')
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {wrapAsyncHandler} = require('../misc/utls')
const {urls} = require('../constants')
const {apiRouter} = require('../definitions')


apiRouter.post('/register',
  redirectIfSessionProvided(urls.index),
  usernameAndPassword.sendErrorIfNotProvidedOrNotValid,

  wrapAsyncHandler(async (request, response) => {
    const {username, password} = request.body

    const user = await registerUser(username, password)

    const {sessionId, expirationDate} = generateAndSaveSessionId(user)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)
  })
)
