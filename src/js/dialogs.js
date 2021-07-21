
function addDialog(){
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
    inputField.value = "" //Очищаем поле ввода
  }
}

document.getElementById('btn-find').onclick = addDialog
document.getElementById('search-user-input').addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addDialog();
  }
});