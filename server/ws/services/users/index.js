const processObjectAccordingConfig = require('../../../misc/objectProcessor')
const {justUserConfig} = require('./configs')
const {Op} = require('sequelize')
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

async function fetchUserByUsername(username) {
  const user = await User.findOne({
    where: {username: username.toLowerCase()}
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

async function checkUsersExist(userIds) {
  const count = await User.count({
    where: {
      id: {
        [Op.in]: userIds
      }
    }
  })

  return count === userIds.length
}

async function getUserByUsername(username) {
  const user = await fetchUserByUsername(username)

  if (user) {
    processObjectAccordingConfig(user, justUserConfig)
  }

  return user
}


module.exports = {
  getUser,
  checkUsersExist,
  getUserByUsername
}
