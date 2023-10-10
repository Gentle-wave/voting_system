// const dbConfig = require('../config/db.config.js')

// const Sequelize = require('sequelize')

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialet,
//     operatorAliases: false,
// })

// const db = {}
const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const db = {};
require ('dotenv').config();

let sequelizeOptions = {
  dialect: 'postgres',
  protocol: 'postgres', 
  logging: true, 
};
if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const dialect = url.protocol.replace(':', ''); // Remove the trailing colon
  
    sequelizeOptions = {
      ...sequelizeOptions,
      dialect,
      host: url.hostname,
      port: url.port,
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      ssl: true, 
      dialectOptions: {
        ssl: {
          require: true, 
          rejectUnauthorized: false,
        },
      },
    };
  } else {
  // If you have a local development database, configure it here
  sequelizeOptions = {
    ...sequelizeOptions,
    dialect:process.env.DIALECT,
    host: process.env.HOST,
    port: 5432,
    username: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  };
}

const sequelize = new Sequelize(sequelizeOptions);

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./user_models')(sequelize, Sequelize)
db.competition = require('./competition')(sequelize, Sequelize)
db.competitionVote = require('./CompetitionVote')(sequelize, Sequelize)
db.competitionParticipant = require('./CompetitionParticipant')(sequelize, Sequelize)


// db.competition.belongsToMany(db.user, {
//     through: db.competitionParticipant, // Junction table name
//     foreignKey: 'competitionId',
//     otherKey: 'userId',
//     as: 'participants',
// });

// db.competition.belongsToMany(db.user, {
//     through: db.competitionVote, // Junction table name
//     foreignKey: 'competitionId',
//     otherKey: 'userId',
//     as: 'voters',
// });


// db.user.belongsToMany(db.competition, {
//     through: db.competitionParticipant, // Junction table name
//     foreignKey: 'userId',
//     otherKey: 'competitionId',
//     as: 'participations',
//   });
  
//   db.user.belongsToMany(db.competition, {
//     through: db.competitionVote, // Junction table name
//     foreignKey: 'userId',
//     otherKey: 'competitionId',
//     as: 'votes',
//   });
  
module.exports = db;
  