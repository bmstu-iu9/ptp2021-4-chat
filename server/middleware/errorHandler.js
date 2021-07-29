const {logger} = require('../definitions')


function handleUnexpectedError(error, request, response, next) {
  logger.error(error.stack)

  if (response.headersSent) {
    return next(error)
  }

  response.status(500).send()
}

function handleErrorWithCode(error, request, response, next) {
  if (!error.code || response.headersSent) {
    return next(error)
  }

  response.status(error.code).send(error.message || '')
}


module.exports = {
  errorHandlersPipeline: [
    handleErrorWithCode,
    handleUnexpectedError
  ]
}
