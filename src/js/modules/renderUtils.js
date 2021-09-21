const messagesContainer = document.querySelector(`.conversation-window__list`)

function getConversationMessageView(relativeId) {
  return messagesContainer.querySelector(`[data-message-id="${relativeId}"]`)
}

function getSidePanelConversationChunk(conversation, lastMessage) {
  const conversationId = conversation.id
  const title = conversation.name
  const unreadCount = conversation.getData().unreadCount

  let lastMessageSelfView = ''
  let lastMessageUnreadView = ''
  let lastMessageTextView = ''

  if (lastMessage) {
    const lastMessageSelf = lastMessage.getData().self
    const lastMessageUnread = !lastMessage.getData().read
    const lastMessageText = lastMessage.getData().content.value

    lastMessageTextView = `
      <p 
      class="side-panel__list__conversation__last-message__text ${lastMessageSelf ? 'side-panel__list__conversation__last-message__text_self' : ''} ${lastMessageSelf && lastMessageUnread ? 'side-panel__list__conversation__last-message__text_self_unread' : ''}"
      >${lastMessageText}</p>
    `

    if (lastMessageSelf) {
      lastMessageSelfView = `
        <p class="side-panel__list__conversation__last-message__self-symbol">Я: </p>
      `
    }

    if (lastMessageSelf && lastMessageUnread) {
      lastMessageUnreadView = `
        <div class="side-panel__list__conversation__last-message__unread-symbol"></div>
      `
    }

  }

  return (`
    <div class="side-panel__list__conversation" data-conversation-id="${conversationId}">
        <p class="side-panel__list__conversation__title">${title}</p>
        <div class="side-panel__list__conversation__last-message">
            ${lastMessageUnreadView} ${lastMessageSelfView} ${lastMessageTextView}
        </div>
        ${unreadCount !== 0 ? `
          <div class="side-panel__list__conversation__unread-counter">
            <span class="side-panel__list__conversation__unread-counter__value">${unreadCount}</span>
          </div>
        ` : ''}
    </div>
  `)
}

function renderSidePanel(DOMString) {
  document.querySelector('.side-panel__list').innerHTML = DOMString
}

function getAllSidePanelConversations() {
  return document.querySelectorAll('.side-panel__list__conversation')
}

function getConversationMessageChunk(message) {
  const relativeId = message.getData().relativeId
  const messageText = message.getData().content.value
  const author = message.getData().user.username
  const self = message.getData().self
  const unread = !message.getData().read
  const createdAt = message.getData().createdAt
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString('eu-RU', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })

  // чем длиннее строчки, тем выше достоинство UwU
  return (`
    <div class="message-container ${self ? 'message-container_self' : ''} ${self && unread ? 'message-container_self_unread' : ''}" data-message-id="${relativeId}">
        <div class="message-container__header">
            <p class="message-container__header__author">${author}</p>
            <span class="message-container__header__time">${formattedCreatedAt}</span>  
        </div>
        <p class="message-container__text">${messageText}</p>
    </div>
  `)
}

function updateConversationMessageView(message) {
  const view = getConversationMessageView(message.getData().relativeId)

  if (message.getData().self) {
    view.classList.add('message-container_self')

    if (!message.getData().read) {
      view.classList.add('message-container_self_unread')
    } else {
      view.classList.remove('message-container_self_unread')
    }
  } else {
    view.classList.remove('message-container_self')
  }
}

function renderConversation(DOMString) {
  document.querySelector('.conversation-window__list').innerHTML = DOMString
}

function getAllConversationMessages() {
  return document.querySelectorAll('.message-container')
}

function isMessagesPreloaderInViewport() {
  const preloader = document.querySelector('.conversation-window__list__preloader')
  const messagesContainer = document.querySelector('.conversation-window__list')

  if (!preloader) {
    return false
  }

  const preloaderRect = preloader.getBoundingClientRect()
  const containerRect = messagesContainer.getBoundingClientRect()

  return preloaderRect.bottom >= containerRect.top
}

function setConversationWindowTitle(title) {
  document.querySelector('.conversation-window__header__username').textContent = title
}

function getConversationWindowPreloaderChunk() {
  return (`
    <div class="conversation-window__list__preloader"></div>
  `)
}

function getConversationWindowUnreadCounterChunk(conversation) {
  const unreadCount = conversation.getData().unreadCount
  return (`
    <div class="unread-counter">
        <p class="unread-counter__value">${unreadCount}</p>
    </div>
  `)
}

function insertMessageToConversation(messageDOM) {
  document.querySelector('.conversation-window__list').insertAdjacentHTML('beforeend', messageDOM)
}


export const sidePanelUtils = {
  getSidePanelConversationChunk,
  renderSidePanel,
  getAllSidePanelConversations
}


export const conversationWindowUtils = {
  getConversationWindowPreloaderChunk,
  getConversationWindowUnreadCounterChunk,
  getConversationMessageChunk,
  setConversationWindowTitle,
  insertMessageToConversation,
  isMessagesPreloaderInViewport,
  updateConversationMessageView,
  getConversationMessageView,
  renderConversation,
  getAllConversationMessages
}
