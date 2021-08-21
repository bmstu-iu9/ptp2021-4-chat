
class WSClient {
  #socket
  #pendingRequests

  constructor(url) {
    this.#socket = new WebSocket(url)
    this.#pendingRequests = {}
  }
}