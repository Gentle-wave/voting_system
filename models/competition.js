
//const { Sequelize, Model, DataTypes } = require('sequelize')
module.exports = (sequelize, Sequelize) => {
    const competition = sequelize.define('competition', {
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      startDate :{
        type : Sequelize.DATE
      },
      duration : {
        type : Sequelize.STRING
      }
    });
  
    return competition;
  };
  
    