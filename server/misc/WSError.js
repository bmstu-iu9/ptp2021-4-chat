class WSError extends Error {
    constructor(message) {
        super(message)

        Object.freeze(this)
    }
}


module.exports = WSError
