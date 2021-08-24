const {wss, wssClients} = require('../../definitions')


wss.onConnection(context => {
  const {current, socket} = context
  wssClients[current.session.sessionId] = socket
})