module.exports = (sequelize, Sequelize) => {
    const CompetitionParticipant = sequelize.define('CompetitionParticipant', {
        competitionId: {
            type: Sequelize.NUMERIC,
        },
        userName: {
            type: Sequelize.STRING,
        },
        userId: {
            type: Sequelize.NUMERIC,
        },
    });

    return CompetitionParticipant;
};