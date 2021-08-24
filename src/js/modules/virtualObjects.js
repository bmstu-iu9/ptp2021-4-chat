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
  username
  userId

  constructor(conversationUpdate) {
    super(conversationUpdate.conversation)

    this.lastMessageId = -1
    this.username = conversationUpdate.conversation.participants[0].username
    this.userId = conversationUpdate.conversation.participants[0].id
    this.messages = {
      list: {},
      toBeUpdated: {}
    }

    if (conversationUpdate.lastMessage) {
      this.addMessage(conversationUpdate.lastMessage, false)
    }
    if (conversationUpdate.messages) {
      for (const message of conversationUpdate.messages) {
        this.addMessage(message, false)
      }
    }
  }

  addMessage(messageUpdate, isNew=true) {
    const id = messageUpdate.relativeId
    let message = new VirtualMessage(messageUpdate)

    this.messages.list[id] = message
    if (isNew) {
      this.messages.toBeUpdated[id] = this.messages.list[id]
    }

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

  getLastMessages(N){
    return this.getMessagesFromId(N, this.lastMessageId)
  }

  getMessagesFromId(N, fromRelativeId){
    const lastMessages = {}
    let id

    for (id = fromRelativeId; (id in this.messages.list) && (id>fromRelativeId - N) && (id>=0); id--) {
      lastMessages[id] = this.messages.list[id]
    }

    let allMessagesLoaded = false
    if (id === -1 || id === this.lastMessageId - N + 1){
      allMessagesLoaded = true
    }

    return {
      messages: lastMessages,
      allLoaded: allMessagesLoaded,
      lastId: id
    }
  }

  getUserInfo(){
    return {
      username: this.username,
      userId: this.userId
    }
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
    return this.conversations[conversationUpdate.conversation.id] = new VirtualConversation(conversationUpdate)
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
