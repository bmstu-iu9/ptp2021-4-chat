const {server} = require('./definitions')
const sequelize = require('./database/sequelize')
const {host, port} = require('./config')


// Инициализация HTTP
require('./http')

server.on('close', async () => {
  await sequelize.close()
})

server.listen(port, host, () => {
  console.log(`Сервер запущен на ${host}:${port}`)
})
