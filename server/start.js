const {server} = require('./definitions')
const sequelize = require('./database/sequelize')
const {host, port} = require('./config')


// Инициализация HTTP
require('./http')

// Инициализация WS
require('./ws')

server.on('close', async () => {
  await sequelize.close()
})

server.listen(port, host, async () => {
  await sequelize.authenticate()
  console.log(`Сервер запущен на ${host}:${port}`)
})
