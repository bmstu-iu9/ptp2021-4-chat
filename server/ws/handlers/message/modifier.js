const {WSRequestError} = require('../../../misc/wsErrors')
const {wss} = require('../../../definitions')


wss.onMessage((context, data, next) => {
  if (data.isBinary) {
    throw new WSRequestError('Бинарные данные должны быть закодированы в base64')
  }

  let parsed
  try {
    parsed = JSON.parse(data.payload)
  } catch {
    throw new WSRequestError('Сообщение должно быть в формате JSON')
  }

  const id = parsed.$id

  if (!Number.isInteger(id)) {
    throw new WSRequestError('Сообщение должно содержать свойство $id')
  }

  addMethod(context.socket, id)
  data.payload = parsed.payload
  next()
})

function addMethod(socket, id) {
  socket.answer = (data, options, callback) => {
    let payload
    try {
      payload = JSON.stringify({$id: id, payload: data})
    } catch {
      throw new WSRequestError('Объект data должен быть сериализуем в JSON формат')
    }

    socket.send(payload, options, callback)
  }
}