
function createElementWithClass(elementName, className) {
  let newElem = document.createElement(elementName)
  newElem.setAttribute("class", className)
  return newElem
}

function addMessage(){
  const inputField = document.getElementById('input-message-text-area')
  let message = inputField.value
  let fromUser = "Я"
  if (message !== "") {
    let messagesContainer = document.querySelector('.messages-list')
    let newMessageAuthor = createElementWithClass('p',
      'message-author')
    newMessageAuthor.innerText = fromUser
    let newMessageText = createElementWithClass('p',
      'message-text')
    newMessageText.innerText = message
    let newMessage = createElementWithClass('div',
      'message-container')
    newMessage.appendChild(newMessageAuthor)
    newMessage.appendChild(newMessageText)

    messagesContainer.appendChild(newMessage)
    inputField.value = ""
  }
}

function addDialog(){
  const inputField = document.getElementById('search-user-input')
  let userName = inputField.value
  if (userName !== "") {
    let dialogsContainer = document.querySelector('.dialogs-list')
    let newDialogText = document.createElement("p")
    newDialogText.setAttribute("class", "user-name-text")
    newDialogText.innerText = userName
    let newDialog = document.createElement("div")
    newDialog.setAttribute("class", "user-dialog-preview")
    newDialog.appendChild(newDialogText)

    dialogsContainer.appendChild(newDialog)
    inputField.value = "" //Очищаем поле ввода
    //прокрутка до низа
    dialogsContainer.scrollTop = dialogsContainer.scrollHeight;

  }
}

function toggleMenu() {
  const element = document.querySelector('.window-dialogs')
  if (element.style.visibility === "hidden" ||  element.style.visibility === "") {
    element.style.visibility = "visible"
    element.style.height = "100%"
    element.style.width = "50%"
  } else if (element.style.visibility === "visible") {
    element.style.cssText = ""
  }
}

document.getElementById('send-button').onclick = addMessage
document.getElementById('input-message-text-area').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addMessage();
  }
});

document.getElementById('btn-find').onclick = addDialog
document.getElementById('search-user-input').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addDialog();
  }
});

document.getElementById('btn-menu-trigger').onclick = toggleMenu