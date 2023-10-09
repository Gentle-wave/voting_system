db = require('../models');

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

    // Add this association to your Competition model
db.competition.belongsToMany(db.user, {
  through: db.competitionParticipant,
  foreignKey: 'competitionId',
  otherKey: 'userId',
  as: 'participants',
});
  
    return competition;
  };
  



    