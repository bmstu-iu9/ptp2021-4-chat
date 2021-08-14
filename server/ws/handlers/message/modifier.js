const {wss} = require('../../../definitions')


wss.onMessage((context, data, next) => {
  if (data.isBinary) {
    throw new Error('Бинарные данные должны быть закодированны в base64')
  }

  let parsed
  try {
    parsed = JSON.parse(data.payload)
  } catch {
    throw new Error('Сообщение должно быть в формате JSON')
  }

  const id = parsed.$id
  if (!id) {
    throw new Error('Сообщение должно содержать свойство $id')
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
      throw new Error('Объект data должен быть сериализуем в JSON формат')
    }

    socket.send(payload, options, callback)
  }
}