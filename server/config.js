const path = require('path')


const isDev = process.env.IS_DEV ? true : false


module.exports = {
  isDev,
  host: isDev ? 'localhost' : '0.0.0.0',
  port: 80, // стандартный порт для HTTP
  publicPath: path.join(__dirname, '../public/'),
  postgres: {
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASS,
    host: 'localhost',
    port: 5432, // стандратный порт для postgreSQL
    schema: process.env.PSQL_DB_NAME
  }
}