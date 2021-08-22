
function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function generateID() {
  return randomInteger(1, 2**64)
}

class WSClient {
  #socket
  #pendingRequests

  constructor(url) {
    this.#socket = new WebSocket(url)
    this.#pendingRequests = {}

    const responseHandler = this.#handleResponse
    this.#socket.onmessage = function(event) {
      responseHandler(event)
    }
    this.#socket.onclose = function(event) {
      // обработка разрыва соединения
    }
  }

  #generateUniqueID() {
    let id
    do {
      id = generateID()
    } while (!(id in this.#pendingRequests))
    return id
  }

  #handleResponse(event) {
    let message
    try {
      message = JSON.parse(event.data)
    } catch {
      throw new Error("Сервер ответил не в JSON формате")
    }
    const id = message.id
    const data = message.data
    if (!(id && data)) {
      throw new Error("JSON, который вернул сервер, имеет неправильный формат.")
    }
    if (!(id in this.#pendingRequests)) {
      return
    }
    //Обработка event
    if (data.error) {
      this.#pendingRequests[id].reject(new Error(JSON.stringify(data.error)))
    } else {
      this.#pendingRequests[id].resolve(data)
    }
    delete this.#pendingRequests[id]
  }

  send(data) {
    const id = this.#generateUniqueID()
    let requestToAdd = this.#pendingRequests[id] = {}
    const promise = new Promise(function(resolve, reject) {
      requestToAdd[id].resolve = resolve
      requestToAdd[id].reject = reject
    })
    const message = {
      "$id": id,
      "payload": data
    }
    this.#socket.send(JSON.stringify(message))
    return promise
  }

  setOnMessageHandler(handler) {
    const responseHandler = this.#handleResponse
    this.#socket.onmessage = function(event) {
      responseHandler(event)
      handler(event)
    }
  }
}