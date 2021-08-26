const {WSError} = require('../../misc/wsErrors')
const {isDev} = require('../../config')
const {logger} = require('../../definitions')
const {wss} = require('../../definitions')


wss.onError((context, error, next) => {
  const socket = context.socket

  if (error instanceof WSError && socket.readyState === socket.OPEN) {
    if (isDev) {
      console.log('Ошибка запроса', error.stack)
    }

    socket.modifiedClose(error.code, error.payload)
    return
  }

  next()
})

wss.onError((context, error) => {
  const socket = context.socket

  if (socket.readyState === socket.OPEN) {
    socket.modifiedClose(1011, {message: 'Неизвестная ошибка'})
  }

  logger.error(error.stack)
})