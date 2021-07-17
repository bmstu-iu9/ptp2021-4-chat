const http = require('http')
const express = require('express')
const ws = require('ws')
const Sequelize = require('sequelize') // ORM для PostgreSQL
const {postgres} = require('./config')


const app = express()
const server = http.createServer(app)
const sequelize = new Sequelize(
  postgres.schema, postgres.user, postgres.password, {
    host: postgres.host,
    port: postgres.port,
    logging: false,
    dialect: 'postgres'
  })


module.exports = {
  app,
  server,
  sequelize,
  ws: new ws.Server({server})
}

