const loginForm = document.querySelector('.login-form')
const registrationForm = document.querySelector('.registration-form')
const loginFormSwitchButton = document.querySelector('.login-form__switch-button')
const registrationFormSwitchButton = document.querySelector('.registration-form__switch-button')


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
