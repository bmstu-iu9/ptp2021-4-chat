const {wss, wssClients} = require('../../definitions')


wss.onConnection(context => {
  const {current, socket} = context

  const sessionId = current.session.sessionId

  if (sessionId in wssClients) {
    wssClients[sessionId].close(1007, 'Было открыто новое соединение')
  }

  wssClients[sessionId] = socket
})