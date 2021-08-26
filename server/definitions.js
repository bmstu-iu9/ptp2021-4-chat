const http = require('http')
const express = require('express')
const ws = require('ws')
const WSServer = require('./misc/WSServer')
const {Logger, logLevels} = require('./misc/logger')


const app = express()
const server = http.createServer(app)

const staticRouter = express.Router()
const apiRouter = express.Router()

const wss = new WSServer(server)
const wssClients = {}
const wssClientsContexts = {}

const logger = new Logger([{
  levels: [logLevels.DEBUG],
  filePath: './server/logs/debug.log'
}, {
  levels: [logLevels.WARNING],
  filePath: './server/logs/warning.log'
}, {
  levels: [logLevels.ERROR],
  filePath: './server/logs/error.log'
}], [logLevels.WARNING, logLevels.ERROR])


module.exports = {
  server,
  wss,
  wssClients,
  wssClientsContexts,
  app,
  staticRouter,
  apiRouter,
  logger
}
