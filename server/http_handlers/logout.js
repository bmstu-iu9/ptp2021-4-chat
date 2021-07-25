const {wrapAsyncHandler} = require('../misc/utls')
const {deleteSession} = require("../services/logout")
const {urls} = require("../constants")
const {apiRouter} = require('../definitions')
const {redirectIfSessionNotProvided} = require('../middleware/session')


apiRouter.get('/logout',
  redirectIfSessionNotProvided(urls.authenticationAndRegistration),

  wrapAsyncHandler(async (request, response) => {
    const sessionId = request.cookies.sessionId

    await deleteSession(sessionId)

    response.cookie('sessionId', '').redirect(urls.authenticationAndRegistration)
  })
)
