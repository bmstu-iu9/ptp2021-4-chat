import {PageManager} from './modules/pageManager.js'
import WSClient from './modules/WSClient.js'


const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')
const searchUserField = document.getElementById('search-user-input')

/* Переключение менюшки на мобилах */
function toggleMenu() {
  dialogsWindow.classList.toggle('dialogs-window-mobile-closed')
  dialogsWindow.classList.toggle('dialogs-window-mobile-opened')
}

document.getElementById('btn-menu-trigger').onclick = toggleMenu


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

document.getElementById('btn-find').onclick = searchUser
document.getElementById('search-user-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    searchUser()
  }
})


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

document.getElementById('send-button').onclick = sendMessage
document.getElementById('input-message-text-area').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
})


/* Обработчик нажатия на диалог */
function conversationOnclickHandler(clickedElement) {
  clearOpenedDialog()
  showOpenedDialog()
  let result = pageManager.openConversation(clickedElement.getAttribute('data-conversation-id'))
  if (result.needLoad) {
    const conversationId = pageManager.openedConversation.conversationId
    wsClient.makeAPIRequest('getConversation', {conversationId}).then(
      data => pageManager.addOldMessages(data)
    ).then(() => result = pageManager.openConversation(clickedElement.getAttribute('data-conversation-id')))
  }
}


/* Основные объекты! */
const pageManager = new PageManager()
pageManager.setConversationOnclickHandler(conversationOnclickHandler)

const wsClient = new WSClient('ws://localhost:80')

wsClient.connect().then(() => {
  wsClient.setOnMessageHandler(pageManager.runHandlers.bind(pageManager))
})

wsClient.makeAPIRequest('getUser', {}).then(
  data => pageManager.setUserInfo(data.username, data.id)
)

wsClient.makeAPIRequest('getAllConversations', {}).then(
  data => {
    data.forEach(conversationUpdate => pageManager.addConversation(conversationUpdate))
  }
)

/* Закрытие текущего диалога нажатием на esc */
document.body.addEventListener('keyup', function(e) {
  if (e.key === 'Escape') {
    clearOpenedDialog()
    closeOpenedDialog()
    pageManager.unsetConversationActive()
  }
})

/* Загрузка сообщений при прокрутке вверх */
messagesContainer.addEventListener('scroll', function() {
  if (messagesContainer.scrollTop === 0 &&
      pageManager.openedConversation &&
      pageManager.openedConversation.lastShownMessageId !== 1) {

    let result = pageManager.renderOldMessages()

    if (result.needLoad) {
      const conversationId = pageManager.openedConversation.conversationId

      wsClient.makeAPIRequest('getConversation', {
        conversationId,
        relativeId: result.lastId
      }).then(
        data => pageManager.addOldMessages(data)
      ).then(() => result = pageManager.renderOldMessages())
    }
  }
})