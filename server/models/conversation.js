const {User} = require('./user')
const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class Conversation extends Model {
}

class ConversationParticipant extends Model {
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

ConversationParticipant.init({},{
  sequelize,
  modelName: 'conversationParticipant',
  timestamps: false
})

User.hasMany(ConversationParticipant,{
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})

ConversationParticipant.belongsTo(User)

Conversation.hasMany(ConversationParticipant,{
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})

ConversationParticipant.belongsTo(Conversation)


module.exports = {
  Conversation,
  ConversationParticipant
}