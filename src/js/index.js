
const dialogsContainer = document.querySelector('.dialogs-list')
const dialogsWindow = document.querySelector('.dialogs-window')
const messagesContainer = document.querySelector('.messages-list')
const messageInputField = document.getElementById('input-message-text-area')
const openedDialogWindow = document.querySelector('.opened-dialog-window')

/* Вспомогательные функции */
function createElementWithClass(elementName, className) {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  return newElem
}

/* Очистка всех сообщений и полей в открытом диалоге */
function clearOpenedDialog() {
  messageInputField.value = ""
  messagesContainer.innerHTML = ""
}

/* Показать окно с текущим диалогом */
function showOpenedDialog() {
  openedDialogWindow.classList.toggle("hidden-window", false)
}

/* Спрятать окно с текущим диалогом */
function closeOpenedDialog() {
  openedDialogWindow.classList.toggle("hidden-window", true)
}

/* Создание элемента диалога */
function createConversationElement(username, lastMessage) {
  const conversationFirstMessage = createElementWithClass("p",
    "conversation-last-message")
  conversationFirstMessage.innerText = lastMessage
  const conversationText = createElementWithClass("p",
    "conversation-username")
  conversationText.innerText = username
  const newConversation = createElementWithClass("div",
    "conversation")
  newConversation.append(conversationText, conversationFirstMessage)

  newConversation.onclick = showOpenedDialog

  return newConversation
}

/* Добавление диалога в список всех диалогов */
function addConversation() {
  const inputField = document.getElementById('search-user-input')
  let username = inputField.value
  if (username === "") {
    return
  }
  const newConversation = createConversationElement(username, "")
  dialogsContainer.appendChild(newConversation)
  inputField.value = ""
  dialogsContainer.scrollTop = dialogsContainer.scrollHeight
}

/* Создание объекта сообщения */
function createMessageElement(fromUser, messageText) {
  const messageAuthorElem = createElementWithClass('p',
    'message-author')
  messageAuthorElem.innerText = fromUser
  const messageTextElem = createElementWithClass('p',
    'message-text')
  messageTextElem.innerText = messageText
  const newMessage = createElementWithClass('div',
    'message-container')
  newMessage.append(messageAuthorElem, messageTextElem)
  return newMessage
}

/* Добавление сообщения в диалог */
function addMessage() {
  let message = messageInputField.value
  let fromUser = "Я"
  if (message === "") {
    return
  }
  const newMessage = createMessageElement(fromUser, message)
  messagesContainer.appendChild(newMessage)
  messageInputField.value = ""
  messagesContainer.scrollTo(0, messagesContainer.scrollHeight)
}

/* Переключение менюшки на мобилах */
function toggleMenu() {
  dialogsWindow.classList.toggle("dialogs-window-mobile-closed")
  dialogsWindow.classList.toggle("dialogs-window-mobile-opened")
}


/* Привязка */
document.getElementById('send-button').onclick = addMessage
document.getElementById('input-message-text-area').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addMessage();
  }
});

document.getElementById('btn-find').onclick = addConversation
document.getElementById('search-user-input').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addConversation();
  }
});

/* Закрытие текущего диалога нажатием на esc */
document.body.addEventListener('keyup', function(e) {
  if (e.key === "Escape") {
    clearOpenedDialog()
    closeOpenedDialog()
  }
});

document.getElementById('btn-menu-trigger').onclick = toggleMenu

document.querySelectorAll('.conversation').forEach(
  elem => elem.onclick = showOpenedDialog
)