import {PageManager} from './modules/PageManager.js'
import WSClient from './modules/WSClient.js'


/* Основные объекты! */
const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')
const searchUserField = document.getElementById('search-user-input')
const pageManager = new PageManager()
const wsClient = new WSClient('ws://localhost:80')
const closeButton = document.querySelector('.btn-close')
const notificationWindow = document.querySelector('.notification-window')


pageManager.setConversationOnclickHandler(conversationOnclickHandler)

wsClient.setOnMessageHandler(pageManager.runHandlers.bind(pageManager))

wsClient.connect().then(() => {
  console.log('Подключен')
})

wsClient.makeAPIRequest('getUser', {}).then(user => {
  pageManager.setUserInfo(user.username, user.id)
})

wsClient.makeAPIRequest('getAllConversations', {}).then(data => {
  data.forEach(update => pageManager.addConversation(update))
})

document.getElementById('btn-menu-trigger').onclick = toggleMenu
document.getElementById('btn-find').onclick = searchUser
document.getElementById('send-button').onclick = sendMessage

closeButton.onclick = function() {
  notificationWindow.classList.add('notification-window_hidden')
}

document.getElementById('search-user-input').onkeydown = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    searchUser()
  }
}

document.getElementById('input-message-text-area').onkeydown = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
}

/* Закрытие текущего диалога нажатием на esc */
document.body.onkeyup = function(event) {
  if (event.key === 'Escape') {
    clearOpenedDialog()
    closeOpenedDialog()
    pageManager.unsetConversationActive()
  }
}

/* Отображение сообщения об ошибке */
function showNotificationWindow() {
  const notificationWindow = document.querySelector('.notification-window')
  notificationWindow.classList.remove('notification-window_hidden')
}

/* Загрузка сообщений при прокрутке вверх */
messagesContainer.onscroll = function() {
  if (!(messagesContainer.scrollTop === 0
    || pageManager.openedConversation
    || pageManager.openedConversation.lastShownMessageId !== 1)) {
    return
  }

  const result = pageManager.renderOldMessages()

  if (result.needLoad) {
    const conversationId = pageManager.openedConversation.conversationId

    wsClient.makeAPIRequest('getConversation', {
      conversationId,
      relativeId: result.lastId
    }).then(data => {
      pageManager.addOldMessages(data)
      pageManager.renderOldMessages()
    })
  }
}


/* Переключение меню на мобилах */
function toggleMenu() {
  dialogsWindow.classList.toggle('dialogs-window-mobile-closed')
  dialogsWindow.classList.toggle('dialogs-window-mobile-opened')
}

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

/* Поиск пользователя и добавление его в диалоги! */
function searchUser() {
  let username = searchUserField.value
  if (username === '') {
    return
  }

  wsClient.makeAPIRequest('searchUser', {username}).then(
    userInfo => {
      if (userInfo.user) {
        wsClient.makeAPIRequest('createDialog', {userId: userInfo.user.id}).then(
          data => {
            pageManager.addConversation(data)
          }
        )
      } else {
        // Здесь будет вызов окна!
        console.log('Такого пользователя не существует!')
      }
    }
  )

  searchUserField.value = ''
  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Отправка сообщений */
function sendMessage() {
  let message = messageInputField.value
  if (message === '') {
    return
  }

  wsClient.makeAPIRequest("createMessage", {
    conversationId: pageManager.openedConversation.conversationId,
    contentType: 'text',
    value: message
  }).then(messageUpdate => pageManager.createMessage(messageUpdate))

  messageInputField.value = ''
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
}

/* Обработчик нажатия на диалог */
function conversationOnclickHandler(conversationWindow) {
  clearOpenedDialog()
  showOpenedDialog()
  const result = pageManager.openConversation(
    conversationWindow.getAttribute('data-conversation-id')
  )

  if (result.needLoad) {
    const conversationId = pageManager.openedConversation.conversationId

    wsClient.makeAPIRequest('getConversation', {conversationId})
    .then(data => {
      pageManager.addOldMessages(data)
      pageManager.openConversation(
        conversationWindow.getAttribute('data-conversation-id')
      )
    })
  }
}