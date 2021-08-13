const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../definitions')


class Content extends Model {
}


Content.init({
  type: {
    type: DataTypes.ENUM('text', 'voice'),
    allowNull: false
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  files: DataTypes.ARRAY(DataTypes.TEXT)
}, {
  sequelize,
  modelName: 'content',
  timestamps: false
})


module.exports = {
  Content
}