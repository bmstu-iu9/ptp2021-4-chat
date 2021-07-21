const path = require('path')

require('dotenv').config()

const isDev = process.env.IS_PROD ? false : true


module.exports = {
  isDev,
  host: isDev ? 'localhost' : '0.0.0.0',
  port: 80,
  publicPath: path.join(__dirname, '../public/'),
  postgres: {
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASS,
    host: process.env.PSQL_HOST,
    port: process.env.DOCKER_PSQL_EXTERNAL_PORT,
    schema: process.env.PSQL_DB_NAME
  }
}