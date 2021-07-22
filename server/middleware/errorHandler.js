const {logger} = require('../definitions')


module.exports = function (error, request, response, next) {
  logger.error(error.stack)

  if (response.headersSent) {
    return next(error)
  }

  response.status(500).send()
}
