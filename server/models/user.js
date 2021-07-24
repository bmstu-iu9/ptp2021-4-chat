const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class User extends Model {
}


class Password extends Model {
}


User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
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
  timestamps: false
})

User.hasOne(Password, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
Password.belongsTo(User)


module.exports = {
  User,
  Password
}
