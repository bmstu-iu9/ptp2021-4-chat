const sequelize = require('../sequelize')
const {Conversation} = require('./conversation')
const {DataTypes} = require('sequelize')
const {Model} = require('sequelize')


class DiscussionMeta extends Model {
}


DiscussionMeta.init({
  name: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'discussionMeta',
  freezeTableName: true,
  tableName: 'discussionMetas',
  timestamps: false,
  name: {
    singular: 'discussionMeta',
    plural: 'discussionMetas'
  }
})

Conversation.hasOne(DiscussionMeta, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
DiscussionMeta.belongsTo(Conversation)


module.exports = {
  DiscussionMeta
}