const authForm = document.querySelector('.auth-form')
const registrationForm = document.querySelector('.registration-form')
const authFormSwitchButton = document.querySelector('.auth-form__switch-button')
const registrationFormSwitchButton = document.querySelector('.registration-form__switch-button')

const notificationWindow = document.querySelector('.notification-window')
const notificationWindowTitle = document.querySelector('.notification-window__title')
const notificationWindowParagraph = document.querySelector('.notification-window__paragraph')

authFormSwitchButton.addEventListener('click', function(event) {
  event.preventDefault()
  authForm.classList.add('form_hidden')
  registrationForm.classList.remove('form_hidden')
  authForm.querySelectorAll('input').forEach(input => {
    setInputValue(input, '')
  })
})

registrationFormSwitchButton.addEventListener('click', function(event) {
  event.preventDefault()
  registrationForm.classList.add('form_hidden')
  authForm.classList.remove('form_hidden')
  registrationForm.querySelectorAll('input').forEach(input => {
    setInputValue(input, '')
  })
})

function setInputValue(input, value) {
  input.value = value
  input.dispatchEvent(new Event('input'))
}

function validatePassword(password) {
  let hasUppercase = false
  let hasLowercase = false
  let hasDigits = false

  if (password.length < 6) {
    return false
  }

  for (let i = 0; i < password.length; i++) {
    if (password[i] >= 'A' && password[i] <= 'Z') {
      hasUppercase = true
    }

    if (password[i] >= 'a' && password[i] <= 'z') {
      hasLowercase = true
    }

    if (password[i] >= '0' && password[i] <= '9') {
      hasDigits = true
    }
  }

  return hasLowercase && hasDigits && hasUppercase
}

function showNotificationWindow(title, paragraph, error = false) {
  notificationWindowTitle.innerHTML = title
  notificationWindowParagraph.innerHTML = paragraph

  notificationWindow.classList.remove('notification-window_hidden')

  if (error) {
    notificationWindow.classList.add('notification-window_error')
  }
}

function hideNotificationWindow() {
  notificationWindowTitle.innerHTML = ''
  notificationWindowParagraph.innerHTML = ''

  notificationWindow.classList.add('notification-window_hidden')
  notificationWindow.classList.remove('notification-window_error')
}

function getURLParam(key) {
  const url = new URL(location.href)
  return url.searchParams.get(key)
}

function setURLParam(key, value) {
  const url = new URL(location.href)
  if (value === null) {
    url.searchParams.delete(key)
  } else {
    url.searchParams.set(key, value)
  }
  history.pushState(null, '', url.search)
}