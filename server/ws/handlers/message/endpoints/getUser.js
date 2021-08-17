const {User} = require("../../../../database/models/user");
const {Session} = require("../../../../database/models/session");
const {wss} = require('../../../../definitions')


module.exports = async (context, payload) => {
    const user = context.user

    const userObject = user.toJSON()
    delete userObject.createdAt

    context.socket.answer(userObject)
}