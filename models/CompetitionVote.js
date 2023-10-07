
//const { Sequelize, Model, DataTypes } = require('sequelize')
module.exports = (sequelize, Sequelize) => {
    const competitionVote = sequelize.define('competitionvote', {
        competitionId: {
            type: Sequelize.NUMERIC,
        },
        userId: {
            type: Sequelize.NUMERIC,
        },
    });

    return competitionVote;
};

