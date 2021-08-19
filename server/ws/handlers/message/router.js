const WSError = require("../../../misc/WSError");
const {endpoints, validateSchema} = require('./endpoints')
const {wrapAsyncFunction} = require('../../../misc/utils')
const {wss} = require('../../../definitions')


wss.onMessage(wrapAsyncFunction(async (context, data) => {
  const payload = data.payload

  if (!validateSchema(payload)) {
    throw new WSError('Некорректная схема запроса')
  }

  const endpoint = endpoints[payload.request]

  await endpoint(context, payload)
}))