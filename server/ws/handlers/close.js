const {wssClientsContexts} = require('../../definitions')
const {deleteSession} = require('../../http/services/logout')
const {wssClients} = require('../../definitions')
const {wss} = require('../../definitions')


wss.onClose(async context => {
  if (context.socket.isClosedByServer()) {
    return
  }

  const session = context.current.session
  const sessionId = session.sessionId

  if (!session.expirationDate) {
    await deleteSession(sessionId)
  }

  delete wssClients[sessionId]
  delete wssClientsContexts[sessionId]
})