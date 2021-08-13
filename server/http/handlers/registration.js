const {generateAndSaveSessionId} = require('../services/common')
const {registerOrAuthUser} = require('../services/registration')
const {redirectIfSessionProvided} = require('../middleware/session')
const {validateUsernameAndPassword} = require('../../misc/utils')
const {validateBody} = require('../middleware/body')
const {wrapAsyncFunction} = require('../../misc/utils')
const {urls} = require('../../constants')
const {apiRouter} = require('../../definitions')


apiRouter.post('/register',
  redirectIfSessionProvided(urls.index),
  validateBody({username: 'string', password: 'string'}),

  wrapAsyncFunction(async (request, response) => {
    const {username, password} = request.body
    validateUsernameAndPassword(username, password)

    const user = await registerOrAuthUser(username, password)

    const {sessionId, expirationDate} = await generateAndSaveSessionId(user)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)
  })
)
