const authForm = document.querySelector('.auth-form')
const registrationForm = document.querySelector('.registration-form')
const authFormSwitchButton = document.querySelector('.auth-form__switch-button')
const registrationFormSwitchButton = document.querySelector('.registration-form__switch-button')
const authFormSubmitButton = document.querySelector('.auth-form__submit-button')
const registrationFormSubmitButton = document.querySelector('.registration-form__submit-button')


const notificationWindow = document.querySelector('.notification-window')
const notificationWindowTitle = document.querySelector('.notification-window__title')
const notificationWindowParagraph = document.querySelector('.notification-window__paragraph')

const errorsMessages = {
  fieldsEmpty: {
    title: 'Ошибка',
    message: () => 'Поля не могут быть пустыми',
    asError: true
  },
  passwordsDontMatch: {
    title: 'Ошибка',
    message: () => 'Пароли не совпадают',
    asError: true
  },
  invalidUsername: {
    title: 'Ошибка',
    message: () => 'Имя пользователя должно иметь длину от 3 до 27 символов и содержать ' +
      'только буквы латинского алфавита и цифры',
    asError: true
  },
  invalidPassword: {
    title: 'Ошибка',
    message: () => 'Пароль должен иметь длину от 6 символов и содержать ' +
      'минимум 1 строчную, 1 заглавную буквы латинского алфавита и 1 цифру',
    asError: true
  },
  connectionError: {
    title: 'Ошибка',
    message: () => 'Не удалось подключиться к серверу',
    asError: true
  },
  incorrectPassword: {
    title: 'Ошибка',
    message: () => 'Неверный пароль',
    asError: true
  },
  usernameNotRegistered: {
    title: 'Уведомление',
    message: (username) => `Такой пользователь не зарегистрирован, вы можете` +
      ` перейти на <a href="/entry?action=registration&username=${username}">страницу регистрации</a>`,
    asError: false
  },
  usernameAlreadyRegistered: {
    title: 'Уведомление',
    message: (username) => `Вы уже ранее регистрировались,` +
      ` перейти на <a href="/entry?action=auth&username=${username}">страницу авторизации</a>?`,
    asError: false
  },
  defaultError: {
    title: 'Ошибка',
    message: (message) => `Неизвестная ошибка: ${message}`,
    asError: true
  }
}

authFormSwitchButton.addEventListener('click', event => {
  event.preventDefault()
  switchFormTo('registration')
})

registrationFormSwitchButton.addEventListener('click', event => {
  event.preventDefault()
  switchFormTo('auth')
})

function setInputValue(input, value) {
  input.value = value
  input.dispatchEvent(new Event('input'))
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