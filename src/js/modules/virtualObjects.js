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
  conversationId

  constructor(conversationUpdate) {
    super(conversationUpdate)

    this.conversationId = this.getData().id
    if (this.getData().type === 'dialog') {
      this.name = this.getData().participants[0].username
    } else {
      this.name = this.getData().name
    }

    this.messages = {
      list: {},
      toBeUpdated: {}
    }
  }

  getLastLoadedMessageId() {
    const ids = Object.keys(this.messages.list)
    return parseInt(ids[0])
  }

  getLastMessageId() {
    const ids = Object.keys(this.messages.list)
    return parseInt(ids[ids.length - 1])
  }

  addMessage(messageUpdate, isNew=true) {
    const id = messageUpdate.relativeId
    this.messages.list[id] = new VirtualMessage(messageUpdate)

    if (isNew) {
      this.messages.toBeUpdated[id] = this.messages.list[id]
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

  getLastMessage() {
    return this.messages.list[this.getLastMessageId()]
  }

  getLastMessages(N){
    return this.getMessagesFromId(N, this.getLastMessageId())
  }

  getMessagesFromId(N, fromRelativeId){
    const lastMessages = {}
    let id

    for (id = fromRelativeId; (id in this.messages.list) && (id>fromRelativeId - N) && (id>=0); id--) {
      lastMessages[id] = this.messages.list[id]
    }

    let allMessagesLoaded = false
    if (id === -1 || id === fromRelativeId - N){
      allMessagesLoaded = true
    }

    return {
      messages: lastMessages,
      allLoaded: allMessagesLoaded,
      lastId: id
    }
  }

  getConversationInfo(){
    return {
      name: this.name,
      conversationId: this.conversationId
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
