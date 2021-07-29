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

showFormOnLoad()

authFormSwitchButton.addEventListener('click', event => {
  event.preventDefault()
  switchFormTo('registration')
})

registrationFormSwitchButton.addEventListener('click', event => {
  event.preventDefault()
  switchFormTo('auth')
})

authFormSubmitButton.addEventListener('click', event => {
  event.preventDefault()

  const username = authForm.querySelector('input[name="username"]').value
  const password = authForm.querySelector('input[name="password"]').value

  if (username === '' || password === '') {
    return showNotificationWindow(
      errorsMessages.fieldsEmpty.title,
      errorsMessages.fieldsEmpty.message(),
      errorsMessages.fieldsEmpty.asError
    )
  }

  authFormSubmitButton.disabled = true
  authFormSwitchButton.disabled = true

  makeAPIRequest('auth', {username, password})
  .finally(() => {
    authFormSubmitButton.disabled = false
    authFormSwitchButton.disabled = false
  })
})

registrationFormSubmitButton.addEventListener('click', event => {
  event.preventDefault()

  const username = registrationForm.querySelector('input[name="username"]').value
  const password = registrationForm.querySelector('input[name="password"]').value
  const passwordRetry = registrationForm.querySelector('input[name="passwordRetry"]').value

  if (username === '' || password === '' || passwordRetry === '') {
    return showNotificationWindow(
      errorsMessages.fieldsEmpty.title,
      errorsMessages.fieldsEmpty.message(),
      errorsMessages.fieldsEmpty.asError
    )
  }

  if (password !== passwordRetry) {
    return showNotificationWindow(
      errorsMessages.passwordsDontMatch.title,
      errorsMessages.passwordsDontMatch.message(),
      errorsMessages.passwordsDontMatch.asError
    )
  }

  if (!validateUsername(username)) {
    return showNotificationWindow(
      errorsMessages.invalidUsername.title,
      errorsMessages.invalidUsername.message(),
      errorsMessages.invalidUsername.asError
    )
  }

  if (!validatePassword(password)) {
    return showNotificationWindow(
      errorsMessages.invalidPassword.title,
      errorsMessages.invalidPassword.message(),
      errorsMessages.invalidPassword.asError
    )
  }

  registrationFormSubmitButton.disabled = true
  registrationFormSwitchButton.disabled = true

  makeAPIRequest('register', {username, password})
  .finally(() => {
    registrationFormSubmitButton.disabled = false
    registrationFormSwitchButton.disabled = false
  })
})

function makeAPIRequest(action, payload) {
  return fetch(`/api/${action}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(payload)
  }).then(response => {
    if (!response.ok) {
      return response.text().then(errorMessage => {
        processError({
          code: response.status,
          message: errorMessage
        }, payload)
      })
    }

    if (response.redirected) {
      location.replace(response.url)
    }
  }).catch(error => {
    processError({
      code: -1,
      message: error.message
    }, payload)
  })
}

function processError(error, context) {
  if (error.code === -1) {
    return showNotificationWindow(
      errorsMessages.connectionError.title,
      errorsMessages.connectionError.message(),
      errorsMessages.connectionError.asError
    )
  }

  switch (error.message) {
    case errors.usernameNotRegistered.message: {
      return showNotificationWindow(
        errorsMessages.usernameNotRegistered.title,
        errorsMessages.usernameNotRegistered.message(context.username),
        errorsMessages.usernameNotRegistered.asError
      )
    }
    case errors.incorrectPassword.message: {
      return showNotificationWindow(
        errorsMessages.incorrectPassword.title,
        errorsMessages.incorrectPassword.message(),
        errorsMessages.incorrectPassword.asError
      )
    }
    case errors.usernameAlreadyRegistered.message: {
      return showNotificationWindow(
        errorsMessages.usernameAlreadyRegistered.title,
        errorsMessages.usernameAlreadyRegistered.message(context.username),
        errorsMessages.usernameAlreadyRegistered.asError
      )
    }
    default: {
      return showNotificationWindow(
        errorsMessages.defaultError.title,
        errorsMessages.defaultError.message(error.message),
        errorsMessages.defaultError.asError
      )
    }
  }
}

function setInputValue(input, value) {
  input.value = value
  input.dispatchEvent(new Event('input'))
}

function showNotificationWindow(title, paragraph, error = false) {
  hideNotificationWindow() // сперва обнуляем окно, чтобы затем показать 'с чистого листа'

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

  history.replaceState(null, '', url.search)
}

function switchFormTo(action) {
  const formToShow = document.querySelector('.' + CSS.escape(action) + '-form')

  if (!formToShow) {
    throw new Error(`Неверно задан параметр action: формы с классом '${action}-form' не существует`)
  }

  document.querySelectorAll('form').forEach(form => {
    if (form !== formToShow) {
      form.classList.add('form_hidden')
      form.querySelectorAll('input').forEach(input => setInputValue(input, ''))
    }
  })

  hideNotificationWindow()
  formToShow.classList.remove('form_hidden')
  setUsernameInputValue(formToShow)
  setURLParam('action', action)
}

function showFormOnLoad() {
  const param = getURLParam('action')

  if (param === 'registration') {
    switchFormTo('registration')
  } else {
    switchFormTo('auth')
  }
}

function setUsernameInputValue(form) {
  const username = getURLParam('username')

  if (!username) {
    return
  }

  const input = form.querySelector('input[name="username"]')

  if (!input) {
    return
  }

  setInputValue(input, username)

  input.addEventListener('input', () => {
    setURLParam('username', null)
  }, {
    once: true
  })
}
