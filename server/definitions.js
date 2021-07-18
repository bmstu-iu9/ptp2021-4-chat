const http = require('http')
const express = require('express')
const ws = require('ws')
const Sequelize = require('sequelize') // ORM для PostgreSQL
const {postgres} = require('./config')


const app = express()
const server = http.createServer(app)
const sequelize = new Sequelize(
  `postgres://${postgres.user}:${postgres.password}` +
  `@${postgres.host}:${postgres.port}/${postgres.schema}`, {
    logging: false,
  })


module.exports = {
  app,
  server,
  sequelize,
  ws: new ws.Server({server})
}

