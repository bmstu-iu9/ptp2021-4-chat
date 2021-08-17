const WSError = require("../../../misc/WSError");
const {wss} = require('../../../definitions')


wss.onMessage((context, data, next) => {
  if (data.isBinary) {
    throw new WSError('Бинарные данные должны быть закодированны в base64')
  }

  let parsed
  try {
    parsed = JSON.parse(data.payload)
  } catch {
    throw new WSError('Сообщение должно быть в формате JSON')
  }

  const id = parsed.$id
  if (!Number.isInteger(id)) {
    throw new WSError('Сообщение должно содержать свойство $id')
  }

  addMethod(context.socket, id)
  data.payload = parsed.payload
  next()
})

function addMethod(socket, id) {
  if (socket.answer) {
    return
  }
  socket.answer = (data, options, callback) => {
    let payload
    try {
      payload = JSON.stringify({$id: id, payload: data})
    } catch {
      throw new WSError('Объект data должен быть сериализуем в JSON формат')
    }

    socket.send(payload, options, callback)
  }
}