function defaultErrorHandler(context, error) {
  console.log(error)
}


class WSServer {
  constructor(wss) {
    this.wss = wss
    this.handlers = {
      connection: [],
      message: [],
      close: [],
      error: [defaultErrorHandler]
    }

    this.initWebSocketServer()
  }

  onConnection(handler) {
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

  runConnectionHandlers(context) {
    const next = this.generateNextFunction(
      'connection',
      this.runErrorHandlers.bind(this),
      context
    )

    next()
  }

  runMessageHandlers(context, data) {
    const next = this.generateNextFunction(
      'message',
      this.runErrorHandlers.bind(this),
      context, data
    )

    next()
  }

  runCloseHandlers(context, code, reason) {
    const next = this.generateNextFunction(
      'close',
      this.runErrorHandlers.bind(this),
      context, code, reason
    )

    next()
  }

  runErrorHandlers(context, error) {
    const next = this.generateNextFunction(
      'error',
      defaultErrorHandler,
      context, error
    )

    next()
  }

  generateNextFunction(handlerType, errorCallBack, context, ...args) {
    let index = 0
    const handlers = this.handlers[handlerType]

    return function next(error) {
      if (error) {
        errorCallBack(context, error)
        return
      }

      if (index >= handlers.length) {
        return
      }

      const handler = handlers[index++]

      try {
        handler(context, ...args, next)
      } catch (error) {
        errorCallBack(context, error)
      }
    }
  }

  initWebSocketServer() {
    this.wss.on('connection', (socket, request) => {
      const context = {socket, request}
      this.runConnectionHandlers(context)

      socket.on('message', (buffer, isBinary) => {
        this.runMessageHandlers(context, {payload: buffer, isBinary})
      })

      socket.on('close', (code, reason) => {
        this.runCloseHandlers(context, code, reason)
      })

      socket.on('error', error => {
        this.runErrorHandlers(context, error)
      })
    })
  }
}


module.exports = {
  WSServer
}