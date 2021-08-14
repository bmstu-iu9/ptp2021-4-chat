const {Model, DataTypes} = require('sequelize')
const sequelize = require('../sequelize')


class User extends Model {
}


class Password extends Model {
}


class OnlineUser extends Model {

}


User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('username', value.toLowerCase())
    }
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

OnlineUser.init({}, {
  sequelize,
  modelName: 'onlineUser',
  timestamps: false
})

User.hasOne(OnlineUser, {
  foreignKey: {
    allowNull: false
  },
  onDelete: 'cascade'
})
OnlineUser.belongsTo(User)


module.exports = {
  User,
  Password,
  OnlineUser
}
