module.exports = (sequelize, Sequelize) => {
    const Vote = sequelize.define('vote', {
      votedForUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  
    return Vote;
  };
  