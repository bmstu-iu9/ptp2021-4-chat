const loginForm = document.querySelector('.login-form')
const registrationForm = document.querySelector('.registration-form')
const loginFormSwitchButton = document.querySelector('.login-form__switch-button')
const registrationFormSwitchButton = document.querySelector('.registration-form__switch-button')

const notificationWindow = document.querySelector('.notification-window')
const notificationWindowTitle = document.querySelector('.notification-window__title')
const notificationWindowParagraph = document.querySelector('.notification-window__paragraph')


loginFormSwitchButton.addEventListener('click', function(event) {
  event.preventDefault()
  loginForm.classList.add('form_hidden')
  registrationForm.classList.remove('form_hidden')
})

registrationFormSwitchButton.addEventListener('click', function(event) {
  event.preventDefault()
  registrationForm.classList.add('form_hidden')
  loginForm.classList.remove('form_hidden')
})

function validatePassword(password) {
  return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/.test(password)
}

function showNotificationWindow(title, paragraph, error = false){
  notificationWindowTitle.innerHTML = title
  notificationWindowParagraph.innerHTML = paragraph

  notificationWindow.classList.remove('notification-window_hidden')

  if (error) {
    notificationWindow.classList.add('notification-window_error')
  }
}

function hideNotificationWindow(){
  notificationWindowTitle.innerHTML = ''
  notificationWindowParagraph.innerHTML = ''

  notificationWindow.classList.add('notification-window_hidden')
  notificationWindow.classList.remove('notification-window_error')
}