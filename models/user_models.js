db = require('../models');
//const { Sequelize, Model, DataTypes } = require('sequelize')
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false, // Make email column not nullable
      unique: true,     // Enforce email uniqueness
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email format', // Custom error message for invalid email
        },
      },
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false, // Make password column not nullable
    },
    gender : {
        type : Sequelize.STRING
    }
  });

  return User;
};


// Add this association to your User model
