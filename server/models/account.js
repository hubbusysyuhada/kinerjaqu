'use strict';
const { nanoid } = require('nanoid')
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasMany(models.Task)
    }
  };
  Account.init({
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    securityQuestion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    securityAnswer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    activationCode: {
      type: DataTypes.INTEGER,
      defaultValue: Math.floor(1000 + Math.random() * 9000),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Account',
    hooks: {
      beforeValidate(instance) {
        instance.id = nanoid(15)
      },
      beforeCreate(instance) {
        instance.password = bcrypt.hashSync(instance.password, 5)
      },
      beforeUpdate(instance) {
        instance.password = bcrypt.hashSync(instance.password, 5)
      }
    }
  });
  return Account;
};