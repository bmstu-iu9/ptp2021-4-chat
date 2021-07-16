const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const ws = require('ws')

const Sequelize = require('sequelize') // ORM для PostgreSQL
const {publicPath, postgres} = require('./config')


const app = express()
const server = http.createServer(app)
const sequelize = new Sequelize(`postgres://${postgres.user}:${postgres.pass}` +
  `@${postgres.host}:${postgres.port}/${postgres.databaseName}`)

// Настройка middleware
app.use(express.static(publicPath, {
  index: false,
  extensions: ['html']
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


module.exports = {
  app,
  server,
  sequelize,
  ws: new ws.Server({server: server})
}

