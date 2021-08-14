const path = require('path')

require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'

const postgres = {
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASS,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  schema: process.env.PSQL_DB_NAME
}

module.exports = {
  isDev,
  host: isDev ? 'localhost' : '0.0.0.0',
  port: 80,
  publicPath: path.join(__dirname, '../public/'),
  commonPath: path.join(__dirname, '../common/'),
  postgres
}

module.exports.postgresUrl = `postgres://` +
  `${postgres.user}:${postgres.password}` +
  `@${postgres.host}:${postgres.port}` +
  `/${postgres.schema}`
