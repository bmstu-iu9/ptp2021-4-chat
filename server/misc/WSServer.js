const ws = require('ws')
const WSError = require('./WSError')
const {isDev} = require('../config')


function defaultErrorHandler(context, error) {
  console.log(error)
}


class WSServer {
  constructor(httpServer) {
    this.wss = new ws.Server({
      server: httpServer,
      verifyClient: this.verifyClient.bind(this)
    })

    this.handlers = {
      preConnection: [],
      connection: [],
      message: [],
      close: [],
      error: [defaultErrorHandler]
    }

    this.initWebSocketServer()
  }

  async verifyClient(info, done) {
    const request = info.req
    const context = {request}

    await this.runPreConnectionHandlers(context, (_, error) => {
      if (isDev) {
        console.log('Ошибка при попытке подключения к WS-серверу', error.stack)
      }

      if (error instanceof WSError) {
        done(false, 400)
      } else {
        done(false, 500)
      }
    })

    request.context = context
    done(true)
  }

  onPreConnection(handler) {
    this.handlers.preConnection.push(handler)
  }

  onConnection(handler) {
    if (handler.constructor.name === 'AsyncFunction') {
      throw new Error('Обработчики события connection не могут быть асинхронными')
    }

    this.handlers.connection.push(handler)
  }

  onMessage(handler) {
    this.handlers.message.push(handler)
  }

  onClose(handler) {
    this.handlers.close.push(handler)
  }

  onError(handler) {
    const length = this.handlers.error.length
    this.handlers.error.splice(length - 1, 0, handler)
  }

  async runPreConnectionHandlers(context, errorCallback) {
    const next = this.generateNextFunction(
      'preConnection',
      errorCallback,
      context
    )

    await next()
  }

  runConnectionHandlers(context, data) {
    const next = this.generateNextFunction(
      'connection',
      this.runErrorHandlers.bind(this),
      context, data
    )

    next()
  }

  async runMessageHandlers(context, data) {
    const next = this.generateNextFunction(
      'message',
      this.runErrorHandlers.bind(this),
      context, data
    )

    await next()
  }

  async runCloseHandlers(context, code, reason) {
    const next = this.generateNextFunction(
      'close',
      this.runErrorHandlers.bind(this),
      context, code, reason
    )

    await next()
  }

  async runErrorHandlers(context, error) {
    const next = this.generateNextFunction(
      'error',
      defaultErrorHandler,
      context, error
    )

    await next()
  }

  generateNextFunction(handlerType, errorCallBack, context, ...args) {
    let index = 0
    const handlers = this.handlers[handlerType]

    return async function next(error) {
      if (error) {
        await errorCallBack(context, error)
        return
      }

      if (index >= handlers.length) {
        return
      }

      const handler = handlers[index++]

      try {
        await handler(context, ...args, next)
      } catch (error) {
        await errorCallBack(context, error)
      }
    }
  }

  initWebSocketServer() {
    this.wss.on('connection', (socket, request) => {
      const context = request.context
      delete request.context

      context.socket = socket

      this.runConnectionHandlers(context)

      socket.on('message', async (buffer, isBinary) => {
        await this.runMessageHandlers(context, {payload: buffer, isBinary})
      })

      socket.on('close', async (code, reason) => {
        await this.runCloseHandlers(context, code, reason)
      })

      socket.on('error', async error => {
        await this.runErrorHandlers(context, error)
      })
    })
  }
}


module.exports = WSServer