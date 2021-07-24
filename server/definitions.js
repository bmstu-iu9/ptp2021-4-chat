const http = require('http')
const express = require('express')
const ws = require('ws')
const Sequelize = require('sequelize') // ORM для PostgreSQL
const {postgres} = require('./config')
const {Logger, logLevels} = require('./logger')

const app = express()
const server = http.createServer(app)
const sequelize = new Sequelize(
  `postgres://${postgres.user}:${postgres.password}` +
  `@${postgres.host}:${postgres.port}/${postgres.schema}`, {
    logging: false
  })

const staticRouter = express.Router()
const apiRouter = express.Router()
const logger = new Logger([{
  levels: [logLevels.DEBUG],
  filePath: './server/logs/debug.log'
}, {
  levels: [logLevels.WARNING],
  filePath: './server/logs/warning.log'
}, {
  levels: [logLevels.ERROR],
  filePath: './server/logs/error.log'
}])


module.exports = {
  app,
  staticRouter,
  logger,
  apiRouter,
  server,
  sequelize,
  ws: new ws.Server({server})
}
