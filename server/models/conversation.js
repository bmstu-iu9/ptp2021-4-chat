const {User} = require('./user')
const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class Conversation extends Model {
}


Conversation.init({
  type: {
    type: DataTypes.ENUM('dialog', 'discussion'),
    allowNull: false
  }
},{
  sequelize,
  modelName: 'conversation',
  updatedAt: false
})


module.exports = {
  Conversation
}