const {WSRequestError} = require('../../../misc/wsErrors')
const {endpoints, validateSchema} = require('./endpoints')
const {wss} = require('../../../definitions')


wss.onMessage(async (context, localContext, data) => {
  const payload = data.payload

  if (!validateSchema(payload)) {
    throw new WSRequestError('Некорректная схема запроса')
  }

  const endpoint = endpoints[payload.request]

  await endpoint(context, localContext, payload)
})