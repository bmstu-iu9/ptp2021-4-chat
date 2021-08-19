
const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')

/* Пример уведомления нового сообщения */
const exampleMessageNotification = {
  notificationType: "newMessage",
  conversation: {
    id: 0,
    type: "dialog",
    username: "Igor Pavlov",
    unreadCount: 0,
    generationTimestamp: 100,
  },
  message: {
    relativeId: 0,
    self: false,
    read: true,
    author: {
      username: "Igor Pavlov"
    },
    creationTimestamp: 120,
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generationTimestamp: 122
  }
}

/* Пример ответа сервера на getAllConversations */

const exampleConversationNotification = [{
  conversation: {
    id: 0,
    type: "dialog",
    username: "Igor Pavlov",
    unreadCount: 0,
    generationTimestamp: 100,
  },
  lastMessage: {
    relativeId: 0,
    self: false,
    read: true,
    author: {
      username: "Igor Pavlov"
    },
    creationTimestamp: 120,
    edited: false,
    content: {
      type: "text",
      value: "Привет!",
      files: null,
    },
    generationTimestamp: 122
  }
}]

/* Классы для хранения сообщений и диалогов */
class Updatable {
  #data

  constructor(update) {
    if (!update.generationTimestamp) {
      throw new Error('В объекте update обязательно должно присутствовать свойство generationTimestamp')
    }

    this.#data = {}
    this.#applyUpdate(update)
  }

  update(update) {
    if (update.generationTimestamp > this.#data.generationTimestamp) {
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
    const copy = Object.assign({}, this.messages.list)
    return copy
  }

  #updateMessageState(message, messageStateUpdate) {
    message.update(messageStateUpdate)

    this.messages.toBeUpdated[messageStateUpdate.relativeId] = message
  }
}

class ConversationsList {
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

/* Вспомогательные функции */
function createElementWithClass(elementName, className) {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  return newElem
}

function createTextElement(elementName, className, innerText='') {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  newElem.innerText = innerText
  return newElem
}

function createCustomElement(elementName, className, id=NaN, innerText='') {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  if (id) {
    newElem.setAttribute("id", id)
  }
  newElem.innerText = innerText
  return newElem
}

/* Очистка всех сообщений и полей в открытом диалоге */
function clearOpenedDialog() {
  messageInputField.value = ""
  messagesContainer.innerHTML = ""
}

/* Показать окно с текущим диалогом */
function showOpenedDialog() {
  openedDialogWindow.classList.toggle("hidden-window", false)
}

/* Спрятать окно с текущим диалогом */
function closeOpenedDialog() {
  openedDialogWindow.classList.toggle("hidden-window", true)
}

/* Создание элемента диалога */
function createConversationElement(username, lastMessage, selfMark) {
  const conversationLastMessage = createElementWithClass("p",
    "conversation-last-message")
  if (selfMark) {
    const conversationLastMessageSelf = createTextElement("span",
      "conversation-last-message-self", 'Я:')
    conversationLastMessage.append(conversationLastMessageSelf)
  }
  conversationLastMessage.append(lastMessage)
  const conversationUsername = createTextElement("p",
    "conversation-username", username)
  const newConversation = createElementWithClass("div",
    "conversation")
  newConversation.append(conversationUsername, conversationLastMessage)

  newConversation.onclick = showOpenedDialog

  return newConversation
}

/* Рендеринг нового диалога по объекту уведомления */
function renderConversation(conversation) {
  const username = conversation.conversation.username
  const lastMessage = conversation.lastMessage.content.value
  const fromSelf = conversation.lastMessage.self
  const newConversation = createConversationElement(username, lastMessage, fromSelf)
  dialogsContainer.appendChild(newConversation)

  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Добавление диалога в список всех диалогов с помощью кнопки */
function addConversation() {
  const inputField = document.getElementById('search-user-input')
  let username = inputField.value
  if (username === "") {
    return
  }
  const newConversation = createConversationElement(username, "", false)
  dialogsContainer.appendChild(newConversation)
  inputField.value = ""
  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Рендеринг нового сообщения по объекту уведомления */
function renderMessage(message) {

}

/* Создание объекта сообщения */
function createMessageElement(fromUser, messageText) {
  const messageAuthorElem = createElementWithClass('p',
    'message-author')
  messageAuthorElem.innerText = fromUser
  const messageTextElem = createElementWithClass('p',
    'message-text')
  messageTextElem.innerText = messageText
  const newMessage = createElementWithClass('div',
    'message-container')
  newMessage.append(messageAuthorElem, messageTextElem)
  return newMessage
}

/* Добавление сообщения в диалог */
function addMessage() {
  let message = messageInputField.value
  let fromUser = "Я"
  if (message === "") {
    return
  }
  const newMessage = createMessageElement(fromUser, message)
  messagesContainer.appendChild(newMessage)
  messageInputField.value = ""
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
}

/* Переключение менюшки на мобилах */
function toggleMenu() {
  dialogsWindow.classList.toggle("dialogs-window-mobile-closed")
  dialogsWindow.classList.toggle("dialogs-window-mobile-opened")
}


/* Привязка */
document.getElementById('send-button').onclick = addMessage
document.getElementById('input-message-text-area').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addMessage();
  }
});

document.getElementById('btn-find').onclick = addConversation
document.getElementById('search-user-input').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addConversation();
  }
});

/* Закрытие текущего диалога нажатием на esc */
document.body.addEventListener('keyup', function(e) {
  if (e.key === "Escape") {
    clearOpenedDialog()
    closeOpenedDialog()
  }
});

document.getElementById('btn-menu-trigger').onclick = toggleMenu

document.querySelectorAll('.conversation').forEach(
  elem => elem.onclick = showOpenedDialog
)