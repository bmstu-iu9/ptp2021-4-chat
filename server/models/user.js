const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class User extends Model {}
class UserPassword extends Model {}


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

UserPassword.init({
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'userPassword',
  freezeTableName: true,
  tableName: 'usersPasswords',
  timestamps: false
})

UserPassword.belongsTo(User, {
  onDelete: 'cascade'
})


module.exports = {
  User,
  UserPassword
}