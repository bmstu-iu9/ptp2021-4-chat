const path = require('path')


const isDev = process.env.IS_DEV ? true : false


module.exports = {
  isDev,
  host: '0.0.0.0',
  port: parseInt(process.env.DOCKER_NODE_INTERNAL_PORT),
  publicPath: path.join(__dirname, '../public/'),
  postgres: {
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASS,
    host: process.env.DOCKER_PSQL_CONTAINER_NAME,
    port: process.env.DOCKER_PSQL_EXTERNAL_PORT,
    schema: process.env.PSQL_DB_NAME
  }
}