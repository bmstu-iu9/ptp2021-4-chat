class WSError extends Error {
  constructor(code, payload) {
    super(`${code}: ${JSON.stringify(payload)}`)

    this.code = code
    this.payload = payload

    Object.freeze(this)
  }
}


class WSRequestError extends WSError {
  constructor(message) {
    super(1007, {message})
  }
}


module.exports = {
  WSError,
  WSRequestError
}
