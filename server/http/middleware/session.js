const {wrapAsyncFunction} = require('../../misc/utils')
const {checkSession} = require('../services/common')


function redirectIfSessionProvided(to, from) {
  if (from) {
    from = Array.isArray(from) ? from : [from]
  }

  return wrapAsyncFunction(async (request, response, next) => {
    if (from && !from.includes(request.path)) {
      return next()
    }

    const result = await checkSession(request, response)

    if (result) {
      return response.redirect(to)
    }

    next()
  })
}

function redirectIfSessionNotProvided(to, from) {
  if (from) {
    from = Array.isArray(from) ? from : [from]
  }

  return wrapAsyncFunction(async (request, response, next) => {
    if (from && !from.includes(request.path)) {
      return next()
    }

    const result = await checkSession(request, response)

    if (!result) {
      return response.redirect(to)
    }

    next()
  })
}


module.exports = {
  redirectIfSessionProvided,
  redirectIfSessionNotProvided
}
