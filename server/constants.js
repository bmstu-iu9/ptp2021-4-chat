module.exports = {
  passwordMinLength: 6,
  sessionLifetime: 60 * 60 * 24 * 180 * 1000, // 180 суток, в миллисекунда
  urls: { // url для статических файлов (.html)
    index: '/', // главная страница
    authenticationAndRegister: '/login' // страница аутентификации/регистрации
  }
}