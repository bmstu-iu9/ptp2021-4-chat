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
  allMessagesLoaded
  earliestNotSelfMessage
  notSelfUnreadMessages

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
    this.notSelfUnreadMessages = {}
  }

  setAllMessagesLoaded() {
    this.allMessagesLoaded = true
  }

  isAllMessagesLoaded() {
    return this.allMessagesLoaded
  }

  getLastMessageId() {
    const ids = Object.keys(this.messages.list)
    return parseInt(ids[ids.length - 1])
  }

  getEarliestNotSelfMessage() {
    return this.earliestNotSelfMessage
  }

  getEarliestNotSelfUnreadMessage() {
    const ids = Object.keys(this.notSelfUnreadMessages)

    if (ids.length === 0) {
      return null
    }

    return this.notSelfUnreadMessages[ids[0]]
  }

  addMessage(messageUpdate) {
    const id = messageUpdate.relativeId

    const message = this.messages.list[id] = this.messages.toBeUpdated[id] = new VirtualMessage(messageUpdate)

    if (!messageUpdate.self) {
      if (!this.earliestNotSelfMessage
        || messageUpdate.relativeId < this.earliestNotSelfMessage.getData().relativeId) {
        this.earliestNotSelfMessage = message
      }
      if (!messageUpdate.read) {
        this.notSelfUnreadMessages[id] = message
      }
    }
  }

  updateMessage(messageStateUpdate) {
    const id = messageStateUpdate.relativeId
    const message = this.messages.list[id]

    if (!message) {
      return
    }

    message.update(messageStateUpdate)
    this.messages.toBeUpdated[id] = message

    if (messageStateUpdate.deleted) {
      delete this.messages.list[id]
    }

    if (messageStateUpdate.read) {
      delete this.notSelfUnreadMessages[id]
    }

  }

  getAllMessages() {
    return Object.assign({}, this.messages.list)
  }

  getEarliestMessage() {
    const ids = Object.keys(this.messages.list)

    if (ids.length === 0) {
      return null
    }

    return this.messages.list[ids[0]]
  }

  getLatestMessage() {
    const ids = Object.keys(this.messages.list)

    if (ids.length === 0) {
      return null
    }

    return this.messages.list[ids[ids.length - 1]]
  }

  getUpdatedMessages() {
    const updated = Object.assign({}, this.messages.toBeUpdated)
    this.clearUpdatedCacheMessagesCache()
    return updated
  }

  clearUpdatedCacheMessagesCache() {
    this.messages.toBeUpdated = {}
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

  getAllSorted() {
    return Object.values(this.conversations)
    .sort((a, b) => {
      const lastMessageA = a.getLatestMessage()
      const lastMessageB = b.getLatestMessage()

      let timestampA, timestampB

      // если в каком-то из диалогов/бесед нет сообщений, то сортируем
      // на основании даты его создания

      if (!lastMessageA) {
        timestampA = a.getData().createdAt
      } else {
        const createdAtA = lastMessageA.getData().createdAt
        timestampA = new Date(createdAtA).getTime()
      }

      if (!lastMessageB) {
        timestampB = b.getData().createdAt
      } else {
        const createdAtB = lastMessageB.getData().createdAt
        timestampB = new Date(createdAtB).getTime()
      }

      return timestampB - timestampA
    })
  }
}
