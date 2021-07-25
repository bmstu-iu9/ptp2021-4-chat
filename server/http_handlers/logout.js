const {deleteSession} = require("../services/logout");
const {urls} = require("../constants");
const {apiRouter} = require('../definitions')
const {redirectIfSessionNotProvided} = require('../middleware/session')


apiRouter.get('/logout',
  redirectIfSessionNotProvided(urls.authenticationAndRegister),
  (request, response) => {
    const sessionId = request.cookies.sessionId

    deleteSession(sessionId).then(() => {
      response.cookie('sessionId', '')
        .redirect(urls.authenticationAndRegister)
    })
  })
