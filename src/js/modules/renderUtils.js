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

function createLastMessageView(messageState) {
  const lastMessage = createElementWithClass('p', 'side-panel__conversation__last-message')

  if (messageState.self) {
    lastMessage.append(
      createTextElement('span', 'side-panel__conversation__last-message__self', 'Я: ')
    )
  }

  lastMessage.append(messageState.content.value)

  return lastMessage
}

function createSidePanelConversationView(conversationId, title) {
  const conversation = createElementWithClass('div', 'side-panel__conversation')
  conversation.setAttribute('data-conversation-id', conversationId)

  conversation.appendChild(
    createTextElement('p', 'side-panel__conversation__username', title)
  )

  return conversation
}

function setSidePanelElementLastMessageView(conversationView, messageState) {
  let sidePanelElementLastMessage = conversationView.querySelector('.conversation-last-message')

  if (!sidePanelElementLastMessage) {
    sidePanelElementLastMessage = createElementWithClass('p', 'side-panel__conversation__last-message')
    conversationView.appendChild(sidePanelElementLastMessage)
  }

  if (messageState.self) {
    sidePanelElementLastMessage.append(
      createTextElement('span', 'side-panel__conversation__last-message__self', 'Я: ')
    )
  }

  sidePanelElementLastMessage.append(messageState.content.value)
}


export {
  createElementWithClass,
  createTextElement,
  createCustomElement
}

export const sidePanelUtils = {
  createLastMessageView,
  createSidePanelConversationView,
  setSidePanelElementLastMessageView
}