import {createElementWithClass, createTextElement} from './renderUtils.js'


const dialogsContainer = document.querySelector('.side-panel__list')
const dialogsWindow = document.querySelector('.side-panel')
const messagesContainer = document.querySelector('.conversation-window__list')
const messageInputField = document.querySelector('.conversation-window__input__text-area')
const openedDialogWindow = document.querySelector('.conversation-window')
const openedDialogUsername = document.querySelector('.conversation-window__header__username')

/* Изменение имени диалога */
function renameOpenedDialog(name) {
  openedDialogUsername.textContent = name
}

/* Создание элемента диалога */
function createConversationElement(username, id, messageText, self, onclickFunc) {
  let conversationLastMessage
  if (messageText) {
    conversationLastMessage = createElementWithClass('p',
      'conversation-last-message')
    if (self) {
      const conversationLastMessageSelf = createTextElement('span',
        'conversation-last-message-self', 'Я: ')
      conversationLastMessage.append(conversationLastMessageSelf)
    }
    conversationLastMessage.append(messageText)
  }
  const conversationUsername = createTextElement('p',
    'conversation-username', username)
  const newConversation = createElementWithClass('div',
    'conversation')
  newConversation.setAttribute('data-conversation-id', id)
  newConversation.appendChild(conversationUsername)
  if (messageText) {
    newConversation.appendChild(conversationLastMessage)
  }

  newConversation.onclick = () => onclickFunc(newConversation)

  return newConversation
}


/* Рендеринг нового диалога по объекту уведомления */
function renderConversation(conversation, lastMessage, addToBegin, onclickFunc) {
  let username
  if (conversation.type === 'dialog') {
    username = conversation.participants[0].username
  } else {
    username = conversation.name
  }
  const id = conversation.id
  let message
  let self
  if (lastMessage) {
    message = lastMessage.content.value
    self = lastMessage.self
  }
  const newConversation = createConversationElement(username, id, message, self, onclickFunc)
  if (addToBegin && dialogsContainer.hasChildNodes()) {
    dialogsContainer.insertBefore(newConversation, dialogsContainer.firstChild)
  }
  else {
    dialogsContainer.appendChild(newConversation)
  }

  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Перенос диалога на первое место */
function moveConversationToBegin(conversationId) {
  const conversationElement = document.querySelector(`[data-conversation-id="${conversationId}"]`)

  if (conversationElement && dialogsContainer.hasChildNodes()) {
    dialogsContainer.insertBefore(conversationElement, dialogsContainer.firstChild)
  }
}

/* Изменение последнего сообщения в диалоге */
function changeConversationLastMessage(conversationId, messageText, self) {
  const conversationElement = document.querySelector(`[data-conversation-id="${conversationId}"]`)

  if (!conversationElement) {
    return
  }

  let conversationLastMessage = conversationElement.querySelector('.side-panel__list__conversation__last-message')
  if (!conversationLastMessage) {
    conversationLastMessage = createElementWithClass('p',
      'conversation-last-message')
    conversationElement.appendChild(conversationLastMessage)
  }

  let newInnerHTML = ''
  if (self) {
    newInnerHTML += '<span class=\\"conversation-last-message-self\\">Я: </span>'
  }
  newInnerHTML += messageText
  conversationLastMessage.innerHTML = newInnerHTML
}

function setConversationActive(conversationId) {
  const conversationElement = document.querySelector(`[data-conversation-id="${conversationId}"]`)
  conversationElement.classList.add('active-conversation')
}

function unsetConversationActive(conversationId) {
  const conversationElement = document.querySelector(`[data-conversation-id="${conversationId}"]`)
  conversationElement.classList.remove('active-conversation')
}

/* exports */
export {renderConversation, createConversationElement,
  changeConversationLastMessage, moveConversationToBegin,
  setConversationActive, unsetConversationActive,
  renameOpenedDialog}