/* Классы для хранения сообщений и диалогов */


class Updatable {
  #data

  constructor(update) {
    if (!update.generatedAt) {
      throw new Error('В объекте update обязательно должно присутствовать свойство generatedAt')
    }

    this.#data = {}
    this.#applyUpdate(update)
  }

  update(update) {
    if (new Date(update.generatedAt).getTime() > new Date(this.#data.generatedAt).getTime()) {
      this.#applyUpdate(update)
    }
  }

  getData() {
    return Object.assign({}, this.#data)
  }

  #applyUpdate(update) {
    for (const property of Object.keys(update)) {
      if (update.hasOwnProperty(property)) {
        this.#data[property] = update[property]
      }
    }
  }
}


class VirtualMessage extends Updatable {
  constructor(messageUpdate) {
    super(messageUpdate)
  }
}


class VirtualConversation extends Updatable {
  messages
  name
  id
  allMessagesLoaded
  earliestNotSelfMessage

  constructor(conversationUpdate) {
    super(conversationUpdate)

    const state = this.getData()

    this.id = state.id
    this.name = state.type === 'dialog' ? state.participants[0].username : state.name

    this.messages = {
      list: {},
      toBeUpdated: {},
      new: {}
    }
    this.allMessagesLoaded = false
  }

  setAllMessagesLoaded(loaded) {
    this.allMessagesLoaded = loaded
  }

  isAllMessagesLoaded() {
    return this.allMessagesLoaded
  }

  getLastMessageId() {
    const ids = Object.keys(this.messages.list)
    return parseInt(ids[ids.length - 1])
  }

  addMessage(messageUpdate) {
    const id = messageUpdate.relativeId

    const message = this.messages.list[id] = this.messages.toBeUpdated[id] = new VirtualMessage(messageUpdate)

    if (!messageUpdate.self) {
      if (!this.earliestNotSelfMessage || messageUpdate.relativeId < this.earliestNotSelfMessage.getData().relativeId) {
        this.earliestNotSelfMessage = message
      }
    }
  }

  getEarliestNotSelfMessage() {
    return this.earliestNotSelfMessage
  }

  updateMessage(messageStateUpdate) {
    const id = messageStateUpdate.relativeId

    const message = this.messages.list[id]
    if (message) {
      message.update(messageStateUpdate)
      this.messages.toBeUpdated[messageStateUpdate.relativeId] = message
    }
  }

  getMessages() {
    return Object.assign({}, this.messages.list)
  }

  getEarliestMessage() {
    const ids = Object.keys(this.messages.list)

    if (ids.length === 0) {
      return null
    }

    return this.messages.list[ids[0]]
  }

  getLastMessage() {
    const ids = Object.keys(this.messages.list)

    if (ids.length === 0) {
      return null
    }

    return this.messages.list[ids[ids.length - 1]]
  }
}


export class ConversationsList {
  activeConversation
  conversations

  constructor() {
    this.conversations = {}
    this.sortedConversations = []
    this.activeConversation = null
  }

  create(conversationUpdate) {
    return this.conversations[conversationUpdate.id] = new VirtualConversation(conversationUpdate)
  }

  includesConversationById(id) {
    return id in this.conversations
  }

  get(id) {
    return this.conversations[id]
  }

  setActive(conversationId) {
    this.activeConversation = this.get(conversationId)
  }

  unsetActive() {
    this.activeConversation = null
  }

  getActive() {
    return this.activeConversation
  }

  getAll() {
    return Object.assign({}, this.conversations)
  }

  getAllSorted() {
    return Object.values(this.conversations).sort((a, b) => {
      const createdAtA = a.getLastMessage().getData().createdAt
      const createdAtB = b.getLastMessage().getData().createdAt
      const timestampA = new Date(createdAtA).getTime()
      const timestampB = new Date(createdAtB).getTime()

      return timestampA - timestampB
    })
  }
}
