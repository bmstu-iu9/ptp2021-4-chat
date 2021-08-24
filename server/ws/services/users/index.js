const processObjectAccordingConfig = require('../../../misc/objectProcessor')
const {singleSessionUserConfig} = require('./configs')
const {User} = require("../../../database/models/user")
const {Session} = require("../../../database/models/session")


async function fetchUser(sessionId) {
  const user = await User.findOne({
    include: [{
      model: Session,
      where: {
        sessionId
      }
    }]
  })

  return user ? user.toJSON() : null
}

async function getUser(sessionId) {
  const user = await fetchUser(sessionId)

  if (user) {
    processObjectAccordingConfig(user, singleSessionUserConfig)
  }

  return user
}


module.exports = {
  getUser
}
