const {wssClientsContexts} = require('../../definitions')
const {WSError} = require('../../misc/wsErrors')
const {wss, wssClients} = require('../../definitions')


wss.onConnection(context => {
  const {current, socket} = context
  const redirectUrl = context.redirectUrl
  const sessionId = current.session.sessionId

  if (redirectUrl) {
    throw new WSError(4000, {redirectUrl})
  }

  if (sessionId in wssClients) {
    wssClients[sessionId].modifiedClose(1007, {message: 'Было открыто новое соединение'})
  }

  wssClients[sessionId] = socket
  wssClientsContexts[sessionId] = context
})
