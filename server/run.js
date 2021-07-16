const {server, sequelize} = require('./definitions')
const {host, port} = require('./config');

(async () => {
  await sequelize.sync({force: true})
})()


// Инициализация хендлеров
require('./http_handlers')


server.listen(port, host, () => {
  console.log(`Сервер запущен на ${host}:${port}`)
})