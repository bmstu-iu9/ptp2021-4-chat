function createElementWithClass(tag, className) {
  let element = document.createElement(tag)
  element.classList.add(className)
  return element
}

function createTextElement(tag, className, innerText = '') {
  let element = document.createElement(tag)

  element.classList.add(className)
  element.innerText = innerText

  return element
}

function createCustomElement(tag, className, id = null, innerText = '') {
  let element = document.createElement(tag)
  element.classList.add(className)

  if (id) {
    element.setAttribute('id', id)
  }

  element.innerText = innerText
  return element
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

  // чем длиннее строчки, тем выше достоинство UwU
  return (`
    <div class="message-container ${self ? 'message-container_self' : ''} ${self && unread ? 'message-container_self_unread' : ''}" data-message-id="${relativeId}">
        <p class="message-container__author">${author}</p>
        <p class="message-container__text">${messageText}</p>
    </div>
  `)
}

function renderConversation(DOMString) {
  document.querySelector('.conversation-window__list').innerHTML = DOMString
}

function setConversationWindowTitle(title) {
  document.querySelector('.conversation-window__header').textContent = title
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

// это нужно скорее всего поменять, выглядит так себе)
function getDOMObjects(parentClassName) {
  const DOMObjects = {}
  DOMObjects.parent = document.querySelector(`.${parentClassName}`)
  DOMObjects.modal = document.querySelector(`.${parentClassName}__found-user`)
  DOMObjects.title = document.querySelector(`.${parentClassName}__found-user__header__title`)
  DOMObjects.closeButton = document.querySelector(`.${parentClassName}__found-user__header__close-button`)
  DOMObjects.username = document.querySelector(`.${parentClassName}__found-user__user-data__username`)
  DOMObjects.sendButton = document.querySelector(`.${parentClassName}__found-user__user-data__send`)

  return DOMObjects
}

function getPredefinedClassNames(parentClassName) {
  return {
    error: `${parentClassName}__found-user_error`,
    incorrect: `${parentClassName}__found-user_incorrect`,
    currentUser: `${parentClassName}__found-user_current-user`
  }
}

export {
  createElementWithClass,
  createTextElement,
  createCustomElement
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
  renderConversation
}


export const foundUserModalUtils = {
  getDOMObjects,
  getPredefinedClassNames
}