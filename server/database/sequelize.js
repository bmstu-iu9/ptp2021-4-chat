const {Sequelize} = require('sequelize')
const {postgresUrl} = require('../config')
require('./sequelizePostgresFix')


module.exports = new Sequelize(postgresUrl, {
  logging: false,
  pool: {
    min: 1
  }
})
