const {Session} = require("../models/session");


async function deleteSession(sessionId) {
  const session = await Session.findOne({
    where: {sessionId}
  })

  if (!session) {
    return
  }

  await session.destroy()
}


module.exports = {
  deleteSession
}