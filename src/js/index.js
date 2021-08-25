import {
  exampleConversationNotification,
  exampleMessageNotification
} from './modules/notificationExamples.js'
import {PageManager} from './modules/pageManager.js'
import WSClient from './modules/WSClient.js'


window.convNotif = exampleConversationNotification
window.msgNotif = exampleMessageNotification

const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')


/* Очистка всех сообщений и полей в открытом диалоге */
function clearOpenedDialog() {
  messageInputField.value = ''
  messagesContainer.innerHTML = ''
}

/* Показать окно с текущим диалогом */
function showOpenedDialog() {
  openedDialogWindow.classList.toggle('hidden-window', false)
}

/* Спрятать окно с текущим диалогом */
function closeOpenedDialog() {
  openedDialogWindow.classList.toggle('hidden-window', true)
}

/* Добавление диалога в список всех диалогов с помощью кнопки */
function addConversation() {
  const inputField = document.getElementById('search-user-input')
  let username = inputField.value
  if (username === '') {
    return
  }
  const newConversation = createConversationElement(username, '', false)
  dialogsContainer.appendChild(newConversation)
  inputField.value = ''
  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Добавление сообщения в диалог */
function addMessage() {
  let message = messageInputField.value
  let fromUser = 'Я'
  if (message === '') {
    return
  }
  const newMessage = createMessageElement(fromUser, message)
  messagesContainer.appendChild(newMessage)
  messageInputField.value = ''
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
}

/* Переключение менюшки на мобилах */
function toggleMenu() {
  dialogsWindow.classList.toggle('dialogs-window-mobile-closed')
  dialogsWindow.classList.toggle('dialogs-window-mobile-opened')
}

/* Обработчик нажатия на диалог */
function conversationOnclickHandler(clickedElement) {
  clearOpenedDialog()
  showOpenedDialog()
  pageManager.openConversation(clickedElement.getAttribute('data-conversation-id'))
}

/* отправка сообщения на ws с проверкой */

/* Основные объекты! */
const pageManager = new PageManager()
const wsClient = new WSClient('ws://localhost:80')
wsClient.makeAPIRequest('getUser', {}).then(
  data => pageManager.setUserInfo(data.username, data.id)
)

pageManager.setConversationOnclickHandler(conversationOnclickHandler)
pageManager.addConversation(exampleConversationNotification[0])
pageManager.addConversation(exampleConversationNotification[1])
window.sidePanel = pageManager
window.ws = wsClient

/* Привязка */
document.getElementById('send-button').onclick = addMessage
document.getElementById('input-message-text-area').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addMessage()
  }
})

document.getElementById('btn-find').onclick = addConversation
document.getElementById('search-user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    addConversation()
  }
})

/* Закрытие текущего диалога нажатием на esc */
document.body.addEventListener('keyup', function(e) {
  if (e.key === 'Escape') {
    clearOpenedDialog()
    closeOpenedDialog()
    pageManager.unsetConversationActive()
  }
})

document.getElementById('btn-menu-trigger').onclick = toggleMenu