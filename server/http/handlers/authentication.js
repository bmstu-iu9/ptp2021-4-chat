const {generateAndSaveSessionId} = require('../services/common')
const {authenticateUser} = require('../services/authentication')
const {redirectIfSessionProvided} = require('../middleware/session')
const {validateBody} = require('../middleware/body')
const {wrapAsyncFunction} = require('../../misc/utils')
const {urls} = require('../../constants')
const {apiRouter} = require('../../definitions')


apiRouter.post('/auth',
  redirectIfSessionProvided(urls.index),
  validateBody({username: 'string', password: 'string'}),

  wrapAsyncFunction(async (request, response) => {
    const {username, password, remember} = request.body

    const user = await authenticateUser(username, password)

    const {sessionId, expirationDate} = await generateAndSaveSessionId(user, remember)

    response.cookie('sessionId', sessionId, {
      expires: expirationDate
    }).redirect(urls.index)

  })
)
