const {generateAndSaveSessionId} = require('../services/common')
const {registerOrAuthUser} = require('../services/registration')
const {redirectIfSessionProvided} = require('../middleware/session')
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {wrapAsyncFunction} = require('../misc/utils')
const {urls} = require('../constants')
const {apiRouter} = require('../definitions')


apiRouter.post('/register',
  redirectIfSessionProvided(urls.index),
  usernameAndPassword.sendErrorIfNotProvidedOrNotValid,

  wrapAsyncFunction(async (request, response) => {
    const {username, password} = request.body

    const user = await registerOrAuthUser(username, password)

    const {sessionId, expirationDate} = await generateAndSaveSessionId(user)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)
  })
)
