module.exports = {
  sessionLifetime: 60 * 60 * 24 * 180 * 1000, // 180 суток, в миллисекундах
  urls: { // url для статических файлов (.html)
    index: '/',                             // главная страница
    authenticationAndRegistration: '/entry' // страница аутентификации/регистрации
  },
  messagesCountPerRequest: 50
}
