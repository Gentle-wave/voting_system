const dbConfig = require('../config/db.config.js')

const Sequelize = require('sequelize')

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialet,
    operatorAliases: false,
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user_models')(sequelize, Sequelize)
db.vote = require('./vote.js')(sequelize, Sequelize)
db.competition = require('./competition')(sequelize, Sequelize)


db.competition.belongsToMany(db.user, {
    through: 'CompetitionParticipant', // Junction table name
    foreignKey: 'competitionId',
    otherKey: 'userId',
    as: 'participants',
});

db.competition.belongsToMany(db.user, {
    through: 'CompetitionVote', // Junction table name
    foreignKey: 'competitionId',
    otherKey: 'userId',
    as: 'voters',
});


db.user.belongsToMany(db.competition, {
    through: 'CompetitionParticipant', // Junction table name
    foreignKey: 'userId',
    otherKey: 'competitionId',
    as: 'participations',
  });
  
  db.user.belongsToMany(db.competition, {
    through: 'CompetitionVote', // Junction table name
    foreignKey: 'userId',
    otherKey: 'competitionId',
    as: 'votes',
  });
  



module.exports = db;