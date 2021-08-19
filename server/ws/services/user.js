const {User} = require("../../database/models/user");
const {Session} = require("../../database/models/session");


async function getUser(sessionId) {
    const session = await Session.findOne({
        where: {
            sessionId
        }
    })

    const user = await User.findOne({
        where: {
            id : session.userId
        }
    })

    return {
        user,
        session
    }
}


module.exports = {
    getUser
}
