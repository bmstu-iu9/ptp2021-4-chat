function randomInteger(min, max) {
  const random = min + Math.random() * (max + 1 - min)
  return Math.floor(random)
}

function generateID() {
  return randomInteger(1, 2 ** 64)
}


export default class WSClient {
  #socket
  #pendingRequests
  #messageHandler
  #closeHandler
  #errorHandler
  url

  constructor(url) {
    this.url = url
    this.#pendingRequests = {}
  }

  #generateUniqueID() {
    let id
    do {
      id = generateID()
    } while (id in this.#pendingRequests)

    return id
  }

  connect() {
    this.#socket = new WebSocket(this.url)

    this.#socket.onmessage = (event) => {
      this.#handleMessage(event)
    }

    this.#socket.onclose = (event) => {
      if (this.#closeHandler) {
        this.#closeHandler(event.code, event.reason)
      }
    }

    let resolved = false
    return new Promise((resolve, reject) => {
      this.#socket.onopen = () => {
        resolve()
        resolved = true
      }

      this.#socket.onerror = () => {
        if (!resolved) {
          reject()
          return
        }

        this.#handleError()

        if (this.#errorHandler) {
          this.#errorHandler()
        }
      }
    })
  }

  #handleError() {
    this.#pendingRequests = {}
  }

  #handleMessage(event) {
    let message
    try {
      message = JSON.parse(event.data)
    } catch {
      throw new Error('Сервер ответил не в JSON формате')
    }

    const id = message.$id
    const payload = message.payload

    if (!Number.isInteger(id) && this.#messageHandler) {
      return this.#messageHandler(message)
    }

    if (!payload) {
      throw new Error('JSON, который вернул сервер, имеет неправильный формат')
    }
    if (!(id in this.#pendingRequests)) {
      throw new Error('Сервер вернул сообщение с несуществующим id')
    }

    // Обработка event
    if (payload.error) {
      this.#pendingRequests[id].reject(payload.error)
    } else {
      this.#pendingRequests[id].resolve(payload)
    }
    delete this.#pendingRequests[id]
  }

  send(data) {
    if (this.#socket.readyState !== 1) {
      return new Promise.reject({
        code: this.#socket.readyState,
        message: 'Статус соединения с сервером не позволяет отправлять сообщения'
      })
    }

    const id = this.#generateUniqueID()
    const promise = new Promise((resolve, reject) => {
      this.#pendingRequests[id] = {resolve, reject}
    })

    const message = {
      $id: id,
      payload: data
    }
    this.#socket.send(JSON.stringify(message))

    return promise
  }

  setOnMessageHandler(handler) {
    this.#messageHandler = handler
  }

  setOnCloseHandler(handler) {
    this.#closeHandler = handler
  }

  setOnErrorHandler(handler) {
    this.#errorHandler = handler
  }
}