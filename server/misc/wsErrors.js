class WSError extends Error {
  constructor(code, payload) {
    super(`${code}: ${JSON.stringify(payload)}`)

    this.code = code
    this.payload = payload

    Object.freeze(this)
  }
}

class WSErrorWithRedirect extends WSError {
  constructor(redirectUrl) {
    super(4000, {redirectUrl})
  }
}

class WSRequestError extends WSError {
  constructor(message) {
    super(1007, {message})
  }
}


module.exports = {
  WSError,
  WSErrorWithRedirect,
  WSRequestError
}
