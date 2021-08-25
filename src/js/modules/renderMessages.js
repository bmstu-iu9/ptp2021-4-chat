import {createElementWithClass, createTextElement} from './renderUtils.js'

const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')


/* Создание объекта сообщения */
function createMessageElement(fromUser, id, messageText) {
  const messageAuthorElem = createTextElement('p',
    'message-author', fromUser)
  const messageTextElem = createTextElement('p',
    'message-text', messageText)
  const newMessage = createElementWithClass('div',
    'message-container')

  newMessage.setAttribute("data-message-id", id)

  newMessage.append(messageAuthorElem, messageTextElem)
  return newMessage
}

/* Рендеринг нового сообщения по объекту уведомления */
function renderMessage(message, addToBegin=false, scrollDown=true) {
  let fromUser = message.user.username

  const newMessage = createMessageElement(fromUser, message.relativeId, message.content.value)

  if (addToBegin && messagesContainer.hasChildNodes()) {
    messagesContainer.insertBefore(newMessage, messagesContainer.firstChild)
  }
  else {
    messagesContainer.appendChild(newMessage)
  }

  if (scrollDown) {
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
  }
}

export {renderMessage}