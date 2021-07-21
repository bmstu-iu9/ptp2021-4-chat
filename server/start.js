const {app, server, sequelize} = require('./definitions')
const {host, port} = require('./config');


(async () => {
  // Инициализация middleware
  require('./middleware')

  await initDatabase()

  // Инициализация хендлеров
  require('./http_handlers')

  server.listen(port, host, () => {
    console.log(`Сервер запущен на ${host}:${port}`)
  })
})()


async function initDatabase(force = false) {
  // Инициализация моделей
  require('./models')

  // Инициализация базы данных
  await sequelize.sync({force})
}