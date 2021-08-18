const {wrapAsyncFunction} = require('../../../../misc/utils')


module.exports = wrapAsyncFunction(async (context, payload) => {
    const user = context.user

    const userObject = user.toJSON()
    delete userObject.createdAt

    context.socket.answer(userObject)
})