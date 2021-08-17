const WSError = require("../../misc/WSError")
const {isDev} = require('../../config')
const {logger} = require("../../definitions")
const {wss} = require("../../definitions");


wss.onError((context, error, next) => {
    const socket = context.socket

    if (error instanceof WSError && socket.readyState === socket.OPEN) {
        if (isDev) {
            console.log('Ошибка запроса', error.stack)
        }

        socket.close(1007, error.message)
        return
    }

    next()
})

wss.onError((context, error) => {
    const socket = context.socket

    if (socket.readyState === socket.OPEN) {
        socket.close(1011)
    }

    logger.error(error.stack)
})