const {wssClients} = require('../../definitions')
const {wss} = require('../../definitions')


wss.onClose((context) => {
  delete wssClients[context.current.session.sessionId]
})