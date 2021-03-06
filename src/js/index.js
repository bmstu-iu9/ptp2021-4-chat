import {PageManager} from './modules/PageManager.js'
import WSClient from './modules/WSClient.js'


/* Основные объекты! */
const sidePanel = document.querySelector('.side-panel')
const conversationWindow = document.querySelector('.conversation-window__wrapper')
const messagesContainer = document.querySelector('.conversation-window__list')
const messageInputField = document.querySelector('.conversation-window__input__text-area')
const searchUserField = document.querySelector('.search-window__search-form__controls__input')
const searchUserButton = document.querySelector('.search-window__search-form__controls__find-button')
const pageManager = new PageManager()
const updater = pageManager.getUpdater()
const conversationManager = pageManager.getConversationManager()
const wsClient = new WSClient('ws://localhost:80')

pageManager.setSidePanelOnClickHandler(loadAndRenderConversationWindow)

wsClient.setOnMessageHandler(update => {
  if (update.notificationType === 'newConversation') {
    updater.applyConversationUpdate(update)
    pageManager.renderSidePanel()
  }

  if (update.notificationType === 'newMessage') {
    const conversation = updater.applyConversationUpdate(update)
    updater.applyNewMessageUpdate(update)

    pageManager.renderSidePanel()
    if (conversationManager.isActive(conversation.id)) {
      if (isScrolledToTheBottom()) {
        pageManager.rerenderConversation()
        scrollConversationWindowToTheBottom()
      } else {
        pageManager.rerenderConversation()
      }

      readMessages(conversation.id)
    }
  }

  if (update.notificationType === 'newMessageState') {
    const conversation = updater.applyConversationUpdate(update)
    updater.applyNewMessageStateUpdate(update)

    pageManager.renderSidePanel()
    if (conversationManager.isActive(conversation.id)) {
      pageManager.rerenderConversation()
    }
  }
})

wsClient.connect().then(() => {
  console.log('Подключен')
})

wsClient.makeAPIRequest('getUser', {}).then(user => {
  pageManager.setCurrentUser(user)
})

wsClient.makeAPIRequest('getAllConversations', {}).then(updates => {
  updates.forEach(update => {
    updater.applyConversationUpdate(update)
    updater.applyLastMessageUpdate(update)
  })

  pageManager.renderSidePanel()
})

wsClient.setOnCloseHandler((code, message) => {
  if (code === 1006) {
    return
  }

  const payload = JSON.parse(message)

  if (code === 4000) {
    const url = payload.redirectUrl
    location.replace(url)
  }

  if (code === 1007) {
    console.error('Запрос к серверу содержал ошибку(-и): ' + payload.message)
  }
})

document.querySelector('.conversation-window__header__mobile-menu-button').onclick = toggleMobileSidePanel
document.querySelector('.conversation-window__input__send-button').onclick = sendMessage
searchUserButton.onclick = searchUser

document.querySelector('.header-column-desktop__logout-button').onclick = () => {
  fetch('/api/logout', {method: 'GET'}).then(response => {
    if (response.redirected) {
      location.replace(response.url)
    }
  })
}

document.querySelector('.search-window__search-form__controls__input').onkeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    searchUser()
  }
}

document.querySelector('.conversation-window__input__text-area').onkeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
}

/* Закрытие текущего диалога нажатием на esc */
document.body.onkeyup = (event) => {
  if (event.key === 'Escape') {
    hideConversationWindow()

    conversationManager.unsetActive()
    pageManager.renderSidePanel()
  }
}


/* Загрузка сообщений при прокрутке вверх */
messagesContainer.onscroll = () => {
  const conversationId = conversationManager.getActiveId()
  if (isReadOnScrollRequired()) {
    readMessages(conversationId)
  }

  if (conversationManager.isPreloaderInViewport()) {
    const relativeId = conversationManager.getEarliestMessageId()
    loadAndRenderConversation(conversationId, relativeId)
    .then(() => scrollConversationWindowToTheMessage(relativeId))
  }
}

function readMessages(conversationId) {
  const relativeIds = conversationManager.getMessagesIdsToMarkAsRead(
    getMessagesIdsInViewport()
  )

  relativeIds.forEach(relativeId =>
    wsClient.makeAPIRequest('readMessage', {conversationId, relativeId})
    .then(update => {
      updater.applyConversationUpdate(update)
      updater.applyNewMessageStateUpdate(update)

      if (conversationManager.isActive(conversationId)) {
        pageManager.rerenderConversation()
      }

      pageManager.renderSidePanel()
    })
  )
}

function isScrolledToTheBottom() {
  return Math.ceil(messagesContainer.offsetHeight + messagesContainer.scrollTop) >= messagesContainer.scrollHeight
}

/* Переключение меню на мобилах */
function toggleMobileSidePanel() {
  sidePanel.classList.toggle('side-panel-mobile_opened')
  if (sidePanel.classList.contains('side-panel-mobile_opened')) {
    hideConversationWindow()
  }
}

function isReadOnScrollRequired() {
  return !conversationWindow.classList.contains('hidden-window')
}

/* Показать окно с текущим диалогом */
function showConversationWindow() {
  conversationWindow.classList.remove('hidden-window')
}

/* Спрятать окно с текущим диалогом */
function hideConversationWindow() {
  messagesContainer.innerHTML = ''
  messageInputField.value = ''
  conversationWindow.classList.add('hidden-window')
}

/* Поиск пользователя и добавление его в диалоги! */
function searchUser() {
  let username = searchUserField.value

  searchUserField.value = ''
  if (username === '') {
    return
  }

  if (username === pageManager.getCurrentUser().username) {
    Swal.fire({
      icon: 'success',
      text: 'Вы нашли самого себя'
    })
    return
  }

  if (!validateUsername(username)) {
    Swal.fire({
      icon: 'error',
      text: 'Вы указали некорректное имя пользователя'
    })
    return
  }

  wsClient.makeAPIRequest('searchUser', {username})
  .then(userUpdate => {
    const user = userUpdate.user
    if (user) {
      Swal.fire({
        icon: 'success',
        text: `Пользователь «${username}» найден`,
        showCancelButton: true,
        confirmButtonText: 'Написать',
        cancelButtonText: `Закрыть`
      }).then((result) => {
        if (result.isConfirmed) {
          createDialog(userUpdate)
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Пользователь не найден'
      })
    }
  })

  scrollConversationWindowToTheBottom()
}

function createDialog(userUpdate) {
  wsClient.makeAPIRequest('createDialog', {userId: userUpdate.user.id})
  .then(update => {
    updater.applyConversationUpdate(update)
    loadAndRenderConversationWindow(update.conversation.id)
  })
}

/* Отправка сообщений */
function sendMessage() {
  let message = messageInputField.value
  if (message === '') {
    return
  }

  const conversationId = conversationManager.getActiveId()

  wsClient.makeAPIRequest('createMessage', {
    conversationId,
    contentType: 'text',
    value: message
  }).then(update => {
    updater.applyNewMessageUpdate(update)
    pageManager.renderSidePanel()
    pageManager.rerenderConversation()

    scrollConversationWindowToTheBottom()
  })

  messageInputField.value = ''

}

function getMessagesIdsInViewport() {
  const relativeIds = []
  conversationManager.getRenderedMessages().forEach(message => {
    if (isElementInViewport(message, messagesContainer)) {
      relativeIds.push(parseInt(message.dataset.messageId))
    }
  })

  return relativeIds
}

function scrollConversationWindowToTheBottom() {
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
}

function scrollConversationWindowToTheMessage(relativeId) {
  const targetMessage = messagesContainer.querySelector(
    `[data-message-id="${relativeId}"]`
  )

  messagesContainer.scrollTo(0, targetMessage.offsetTop)
}

function loadAndRenderConversationWindow(conversationId) {
  toggleMobileSidePanel()
  hideConversationWindow()
  conversationManager.setActive(conversationId)

  pageManager.renderSidePanel()
  pageManager.renderConversation()

  if (!conversationManager.isNeedLoad() && !conversationManager.isPreloaderInViewport()) {
    const relativeId = conversationManager.getEarliestUnreadNotSelfMessageId()
    if (relativeId) {
      scrollConversationWindowToTheMessage(relativeId)
    } else {
      scrollConversationWindowToTheBottom()
    }

    readMessages(conversationId)
    showConversationWindow()
    return
  }

  function recursive(relativeId) {
    return new Promise(resolve => {
      loadAndRenderConversation(conversationId, relativeId).then(() => {
        scrollConversationWindowToTheBottom()
        if (conversationManager.isPreloaderInViewport()) {
          recursive(conversationManager.getEarliestMessageId()).then(resolve)
        } else {
          resolve()
        }
      })
    })
  }

  recursive().then(() => {
    const relativeId = conversationManager.getEarliestUnreadNotSelfMessageId()

    if (relativeId) {
      scrollConversationWindowToTheMessage(relativeId)
    } else {
      scrollConversationWindowToTheBottom()
    }

    readMessages(conversationId)
    showConversationWindow()
  })
}

function loadAndRenderConversation(conversationId, relativeId) {
  return new Promise(resolve => {
    wsClient.makeAPIRequest('getConversation', {conversationId, relativeId})
    .then(update => {
      updater.applyConversationUpdate(update)
      updater.applyMessagesUpdate(update)
      pageManager.renderConversation()

      if (conversationManager.isNeedLoad()) {
        const relativeId = conversationManager.getEarliestMessageId()
        loadAndRenderConversation(conversationId, relativeId).then(resolve)
      } else {
        resolve()
      }
    })
  })
}


function isElementInViewport(element, viewportElement) {
  const elementRect = element.getBoundingClientRect()
  const viewportElementRect = viewportElement.getBoundingClientRect()

  return (
    elementRect.top >= viewportElementRect.top
    && elementRect.left >= viewportElementRect.left
    && elementRect.bottom <= viewportElementRect.bottom
    && elementRect.right <= viewportElementRect.right
  )
}