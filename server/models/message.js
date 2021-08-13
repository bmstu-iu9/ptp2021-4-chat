const {Content} = require('./content')
const {User} = require('./user')
const {Conversation} = require('./conversation')
const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class Message extends Model{
}


Message.init({
  edited: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  editedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'message',
  updatedAt: false
})

Conversation.hasMany(Message, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
Message.belongsTo(Conversation)

User.hasMany(Message, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
Message.belongsTo(User)

Content.hasOne(Message, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
Message.belongsTo(Content)


module.exports = {
  Message
}
