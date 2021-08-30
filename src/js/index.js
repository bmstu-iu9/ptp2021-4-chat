import {PageManager} from './modules/PageManager.js'
import WSClient from './modules/WSClient.js'
import FoundUserModalRenderer
  from './modules/renderers/FoundUserModalRenderer.js'


/* Основные объекты! */
const sidePanel = document.querySelector('.side-panel')
const sidePanelConversationsContainer = document.querySelector('.side-panel__list')

const conversationWindow = document.querySelector('.conversation-window')
const conversationWindowMessagesContainer = document.querySelector('.conversation-window__list')
const messageInputField = document.querySelector('.conversation-window__input__text-area')
const searchUserField = document.querySelector('.search-window__search-form__controls__input')

const pageManager = new PageManager(sidePanel, conversationWindow)
const wsClient = new WSClient('ws://localhost:80')
const modal = new FoundUserModalRenderer('search-window')

pageManager.setSidePanelConversationOnClickCallback(loadAndRenderConversationWindow)

wsClient.setOnMessageHandler(pageManager.runUpdateHandlers.bind(pageManager))

wsClient.connect().then(() => {
  console.log('Подключен')
})

wsClient.makeAPIRequest('getUser', {}).then(user => {
  pageManager.setCurrentUser(user)
})

wsClient.makeAPIRequest('getAllConversations', {}).then(data => {
  data.forEach(({conversation, lastMessage}) => {
    pageManager.applyConversationUpdate(conversation)
    pageManager.applyLastMessageUpdate(conversation.id, lastMessage)
  })

  pageManager.renderSidePanel()
})

document.getElementById('btn-menu-trigger').onclick = toggleMenu
document.querySelector('.search-window__search-form__controls__find-button').onclick = searchUser
document.querySelector('.conversation-window__input__send-button').onclick = sendMessage

document.querySelector('.search-window__search-form__controls__input').onkeydown = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    searchUser()
  }
}

document.querySelector('.conversation-window__input__text-area').onkeydown = function(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    sendMessage()
  }
}

/* Закрытие текущего диалога нажатием на esc */
document.body.onkeyup = function(event) {
  if (event.key === 'Escape') {
    hideConversationWindow()
    pageManager.unsetActiveConversation()
  }
}

/* Загрузка сообщений при прокрутке вверх */
conversationWindowMessagesContainer.onscroll = function() {
  if (!isMessagesPreloaderInViewport()) {
    return
  }

  loadAndRenderConversation(
    pageManager.getActiveConversationId(),
    pageManager.getConversationEarliestMessageRelativeId()
  )
}


/* Переключение меню на мобилах */
function toggleMenu() {
  sidePanel.classList.toggle('dialogs-window-mobile-closed')
  sidePanel.classList.toggle('dialogs-window-mobile-opened')
}

/* Показать окно с текущим диалогом */
function showConversationWindow() {
  conversationWindow.classList.remove('hidden-window')
}

/* Спрятать окно с текущим диалогом */
function hideConversationWindow() {
  messageInputField.value = ''
  conversationWindowMessagesContainer.innerHTML = ''
  conversationWindow.classList.add('hidden-window')
}

/* Поиск пользователя и добавление его в диалоги! */
function searchUser() {
  let username = searchUserField.value
  if (username === '') {
    return
  }

  wsClient.makeAPIRequest('searchUser', {username}).then(userUpdate => {
    const user = userUpdate.user
    if (user) {
      if (username === pageManager.getCurrentUser().username) {
        modal.showFound(user)
      } else {
        modal.showFound(user, () => createDialog(userUpdate))
      }
    } else {
      modal.showNotFound(username)
    }
  })

  searchUserField.value = ''
  sidePanelConversationsContainer.scrollTop = sidePanelConversationsContainer.scrollHeight
}

function createDialog(userUpdate) {
  hideConversationWindow()
  wsClient.makeAPIRequest('createDialog', {userId: userUpdate.user.id}).then(update => {
    const conversationUpdate = update.conversation

    // как-то залупно выходит - мы сначала применяем апдейт, а потом заново
    // его загружаем и применяем. Я не придумаль как ещё сделать
    // наверное нужно придумать :/
    pageManager.applyConversationUpdate(conversationUpdate)
    loadAndRenderConversationWindow(conversationUpdate.id)

    modal.hide()
  })
}

/* Отправка сообщений */
function sendMessage() {
  let message = messageInputField.value
  if (message === '') {
    return
  }

  const conversationId = pageManager.getActiveConversationId()

  wsClient.makeAPIRequest("createMessage", {
    conversationId,
    contentType: 'text',
    value: message
  }).then(messageUpdate => {
    // тут шота намутить нужно
  })

  messageInputField.value = ''
  conversationWindowMessagesContainer.scrollTo(0, conversationWindowMessagesContainer.scrollHeight)
}

/* Обработчик нажатия на диалог */
function loadAndRenderConversationWindow(conversationId) {
  pageManager.setActiveConversation(conversationId)

  loadAndRenderConversation(conversationId).then(scrollToMessageRelativeId => {
    if (!scrollToMessageRelativeId) {
      /* а здесь видимо нужно скролить в самый низ */
      return
    }

    // скрол до самого раннего непрочитанного чужого сообщения
    const targetMessage = conversationWindowMessagesContainer
    .querySelector(`[data-message-id="${scrollToMessageRelativeId}"]`)

    conversationWindowMessagesContainer.scrollTop = targetMessage.offsetTop
      - conversationWindowMessagesContainer.offsetTop
  }).then(showConversationWindow)
}

function loadAndRenderConversation(conversationId, relativeId) {
  if (pageManager.isConversationFullyLoaded()) {
    pageManager.renderConversation()
    return Promise.resolve(/* шо тут то передать ляя */)
  }

  return new Promise(resolve => {
    wsClient.makeAPIRequest('getConversation', {
      conversationId,
      relativeId
    }).then(({conversation, messages}) => {
      pageManager.applyConversationUpdate(conversation)
      const {
        needLoadMore,
        earliestNotSelfUnreadMessageRelativeId
      } = pageManager.applyMessagesUpdate(conversation.id, messages)

      pageManager.renderConversation()

      if (needLoadMore || isMessagesPreloaderInViewport()) {
        loadAndRenderConversation(
          conversationId,
          pageManager.getConversationEarliestMessageRelativeId()
        ).then(() => resolve(earliestNotSelfUnreadMessageRelativeId))
      } else {
        resolve(earliestNotSelfUnreadMessageRelativeId)
      }
    })
  })
}

function isMessagesPreloaderInViewport() {
  const preloader = document.querySelector('.conversation-window__list__preloader')

  if (!preloader) {
    return false
  }

  const preloaderRect = preloader.getBoundingClientRect()
  const containerRect = conversationWindowMessagesContainer.getBoundingClientRect()

  return preloaderRect.bottom >= containerRect.top
}
