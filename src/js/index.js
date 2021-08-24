
import {exampleConversationNotification, exampleMessageNotification} from './modules/notificationExamples.js'
import ConversationsList from './modules/virtualObjects.js'

window.convNotif = exampleConversationNotification
window.msgNotif = exampleMessageNotification

const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')

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
function createConversationElement(username, id, lastMessage, self) {
  let conversationLastMessage
  if (lastMessage) {
    conversationLastMessage = createElementWithClass("p",
      "conversation-last-message")
    if (self) {
      const conversationLastMessageSelf = createTextElement("span",
        "conversation-last-message-self", 'Я:')
      conversationLastMessage.append(conversationLastMessageSelf)
    }
    conversationLastMessage.append(lastMessage)
  }
  const conversationUsername = createTextElement("p",
    "conversation-username", username)
  const newConversation = createElementWithClass("div",
    "conversation")
  newConversation.setAttribute("data-conversation-id", id)
  newConversation.appendChild(conversationUsername)
  if (lastMessage) {
    newConversation.appendChild(conversationLastMessage)
  }

  newConversation.onclick = showOpenedDialog

  return newConversation
}

/* Рендеринг нового диалога по объекту уведомления */
function renderConversation(conversation, addToBegin) {
  const username = conversation.conversation.username
  const id = conversation.conversation.id
  const lastMessage = conversation.lastMessage.content.value
  const self = conversation.lastMessage.self
  const newConversation = createConversationElement(username, id, lastMessage, self)
  if (addToBegin && dialogsContainer.hasChildNodes()) {
    dialogsContainer.insertBefore(newConversation, dialogsContainer.firstChild)
  }
  else {
    dialogsContainer.appendChild(newConversation)
  }

  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Смена диалогов местами */
function moveConversationToBegin(conversationId) {
  const conversationElement = document.querySelector(`[data-conversation-id=${conversationId}]`)
  if (conversationElement && dialogsContainer.hasChildNodes()) {
    dialogsContainer.insertBefore(conversationElement, dialogsContainer.firstChild)
    conversationElement.remove()
  }
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

/* Создание объекта сообщения */
function createMessageElement(fromUser, messageText) {
  const messageAuthorElem = createTextElement('p',
    'message-author', fromUser)
  const messageTextElem = createTextElement('p',
    'message-text', messageText)
  const newMessage = createElementWithClass('div',
    'message-container')
  newMessage.append(messageAuthorElem, messageTextElem)
  return newMessage
}

/* Рендеринг нового сообщения по объекту уведомления */
function renderMessage(message) {
  let fromUser = message.user.username
  const newMessage = createMessageElement(fromUser, message.content.value)
  messagesContainer.appendChild(newMessage)
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
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