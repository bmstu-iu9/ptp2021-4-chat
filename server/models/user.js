const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class User extends Model {}
class Password extends Model {}


User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  modelName: 'user',
  updatedAt: false
})

Password.init({
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'password',
  freezeTableName: true,
  tableName: 'passwords',
  timestamps: false
})

Password.belongsTo(User, {
  onDelete: 'cascade'
})


module.exports = {
  User,
  Password
}