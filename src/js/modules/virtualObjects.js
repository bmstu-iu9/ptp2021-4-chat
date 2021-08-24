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
    if (update.generatedAt > this.#data.generatedAt) {
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
  lastMessage
  lastMessageId

  constructor(conversationUpdate) {
    super(conversationUpdate.conversation)

    if (conversationUpdate.lastMessage) {
      this.lastMessage = new VirtualMessage(conversationUpdate.lastMessage)
      this.lastMessageId = conversationUpdate.lastMessage.relativeId
    }
    this.messages = {
      list: {},
      toBeUpdated: {}
    }
  }

  addMessage(messageUpdate) {
    const id = messageUpdate.relativeId
    let message = new VirtualMessage(messageUpdate)

    this.messages.toBeUpdated[id] = this.messages.list[id] = message

    if (id >= this.lastMessageId) {
      this.lastMessageId = id
      this.lastMessage = message
    }
  }

  updateMessage(messageStateUpdate) {
    const id = messageStateUpdate.relativeId

    if (id in this.messages.list) {
      this.#updateMessageState(this.messages.list[id], messageStateUpdate)
    }
  }

  getUpdatedMessages() {
    for (const message of Object.values(this.messages.toBeUpdated)) {
      if (message.getState().deleted) {
        delete this.messages.list[message.relativeId]
      }
    }

    const copy = Object.assign({}, this.messages.toBeUpdated)
    this.messages.toBeUpdated = {}

    return copy
  }

  getMessagesList() {
    return Object.assign({}, this.messages.list)
  }

  #updateMessageState(message, messageStateUpdate) {
    message.update(messageStateUpdate)

    this.messages.toBeUpdated[messageStateUpdate.relativeId] = message
  }


  getLastNMessages(N){
    return this.messages.list.slice(this.lastMessageId - N)
  }
}

export class ConversationsList {
  activeConversation
  conversations

  constructor() {
    this.conversations = {}
    this.activeConversation = null
  }

  create(conversationUpdate) {
    return this.conversations[conversationUpdate.id] = new VirtualConversation(conversationUpdate)
  }

  get(id) {
    return this.conversations[id]
  }

  setActive(conversation) {
    this.activeConversation = conversation
  }

  getActive() {
    return this.activeConversation
  }

  getAll() {
    return Object.assign({}, this.conversations)
  }
}
