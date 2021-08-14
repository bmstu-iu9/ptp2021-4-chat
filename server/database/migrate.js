if (require.main !== module) {
  console.error(`Файл ${__filename} не может быть импортирован`)
}

const options = {}
process.argv.forEach(argument => {
  if (argument === '--force') {
    options.force = true
  }
})

options.alter = !options.force


const sequelize = require('./sequelize');


(async () => {
  require('./models')

  await sequelize.sync(options)
  await sequelize.close()
  console.log('Миграции успешно завершены!')
})()
