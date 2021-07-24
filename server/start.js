const {isDev} = require('./config')
const {server, sequelize} = require('./definitions')
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

  const options = {}
  if (isDev) {
    options.force = force
    options.alter = !force
  }

  // Инициализация базы данных
  await sequelize.sync(options)
}
