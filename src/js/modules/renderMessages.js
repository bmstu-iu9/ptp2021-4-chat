import {createElementWithClass, createTextElement} from './renderUtils.js'


const dialogsContainer = document.querySelector('.side-panel__list')
const dialogsWindow = document.querySelector('.side-panel')
const messagesContainer = document.querySelector('.conversation-window__list')
const messageInputField = document.querySelector('.conversation-window__input__text-area')
const openedDialogWindow = document.querySelector('.conversation-window')


/* Создание объекта сообщения */
function createMessageElement(fromUser, id, messageText) {
  const messageAuthorElem = createTextElement('p',
    'message-container__author', fromUser)
  const messageTextElem = createTextElement('p',
    'message-container__text', messageText)
  const newMessage = createElementWithClass('div',
    'message-container')

  newMessage.setAttribute('data-message-id', id)

  newMessage.append(messageAuthorElem, messageTextElem)
  return newMessage
}

/* Рендеринг нового сообщения по объекту уведомления */
function renderMessage(message, addToBegin=false, scrollDown=true, scrollTo=undefined) {
  let fromUser = message.user.username

  const newMessage = createMessageElement(fromUser, message.relativeId, message.content.value)

  if (addToBegin && messagesContainer.hasChildNodes()) {
    messagesContainer.insertBefore(newMessage, messagesContainer.firstChild)
  }
  else {
    messagesContainer.appendChild(newMessage)
  }

  if (scrollTo) {
    messagesContainer.scrollTo(0, scrollTo)
  } else if (scrollDown) {
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
  }
}

export {renderMessage}