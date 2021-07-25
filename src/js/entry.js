const createAccountButton = document.querySelector('.btn-create-account')
const loginButton = document.querySelector('.btn-login')
const loginForm = document.querySelector('.login-form')
const registrationForm = document.querySelector('.registration-form')

createAccountButton.addEventListener('click', function (event) {
    event.preventDefault()
    loginForm.classList.add('form_hidden')
    registrationForm.classList.remove('form_hidden')
})

loginButton.addEventListener('click', function (event) {
    event.preventDefault()
    registrationForm.classList.add('form_hidden')
    loginForm.classList.remove('form_hidden')
})