const {generateAndSaveSessionId} = require('../services/common')
const {authenticateUser} = require('../services/authentication')
const {redirectIfSessionProvided} = require('../middleware/session')
const usernameAndPassword = require('../middleware/usernameAndPassword')
const {wrapAsyncHandler} = require('../misc/utls')
const {urls} = require('../constants')
const {apiRouter} = require('../definitions')


apiRouter.post('/auth',
  redirectIfSessionProvided(urls.index),
  usernameAndPassword.sendErrorIfNotProvided,

  wrapAsyncHandler(async (request, response) => {
    const {username, password} = request.body

    const user = await authenticateUser(username, password)

    const {sessionId, expirationDate} = await generateAndSaveSessionId(user)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)

  })
)
