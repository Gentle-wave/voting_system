module.exports = (sequelize, Sequelize) => {
    const CompetitionParticipant = sequelize.define('CompetitionParticipant', {
        competitionId: {
            type: Sequelize.NUMERIC,
        },
        userId: {
            type: Sequelize.NUMERIC,
        },
    });

    return CompetitionParticipant;
};