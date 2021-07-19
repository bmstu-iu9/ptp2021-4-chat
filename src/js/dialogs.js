
document.getElementById('btn-find').onclick = function(){
  let inputField = document.getElementById('search-user-input')
  let userName = inputField.value
  if (userName != "") {
    let dialogsContainer = document.querySelector('.dialogs-list')
    let new_dialog_p = document.createElement("p")
    new_dialog_p.setAttribute("class", "user-name-text")
    new_dialog_p.innerText = userName
    let new_dialog = document.createElement("div")
    new_dialog.setAttribute("class", "user-dialog-preview")
    new_dialog.appendChild(new_dialog_p)

    dialogsContainer.appendChild(new_dialog)
  }
}