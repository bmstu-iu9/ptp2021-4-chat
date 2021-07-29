const {generateAndSaveSessionId} = require('../services/common')
const {authenticateUser} = require('../services/authentication')
const {redirectIfSessionProvided} = require('../middleware/session')
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {wrapAsyncFunction} = require('../misc/utils')
const {urls} = require('../constants')
const {apiRouter} = require('../definitions')


apiRouter.post('/auth',
  redirectIfSessionProvided(urls.index),
  usernameAndPassword.sendErrorIfNotProvided,

  wrapAsyncFunction(async (request, response) => {
    const {username, password} = request.body

    const user = await authenticateUser(username, password)

    const {sessionId, expirationDate} = await generateAndSaveSessionId(user)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)

  })
)
