module.exports = (sequelize, Sequelize) => {
    const CompetitionParticipant = sequelize.define('CompetitionParticipant', {
        competitionId: {
            type: Sequelize.NUMERIC,
        },
        userName: {
            type: Sequelize.STRING,
        },
    });

    return CompetitionParticipant;
};