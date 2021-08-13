const HTTPError = require('../../misc/HTTPError')
const {errors} = require('../../../common/common')


function validateBody(options) {
  return (request, response, next) => {
    for (const property in options) {
      const value = request.body[property]
      if (value === undefined || typeof value !== options[property]) {
        throw new HTTPError(errors.incorrectBody)
      }
    }

    next()
  }
}


module.exports = {
  validateBody
}
