const {Model, DataTypes} = require('sequelize')
const sequelize = require('../sequelize')
const {User} = require('./user')


class Session extends Model {
}


Session.init({
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  expirationDate: {
    type: DataTypes.DATE,
  }
}, {
  sequelize,
  modelName: 'session',
  timestamps: false
})

User.hasMany(Session, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
Session.belongsTo(User)


module.exports = {
  Session
}
