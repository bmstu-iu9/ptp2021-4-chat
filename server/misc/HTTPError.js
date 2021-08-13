class HTTPError extends Error {
  constructor(error) {
    super(error.message);
    this.code = error.code

    Object.freeze(this)
  }
}


module.exports = HTTPError
