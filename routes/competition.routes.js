module.exports = app => {
    const express = require('express')
    let router = express.Router()
    const competitionController = require('../controllers/competitionController');


    router.post('/:userId', competitionController.createCompetition);
    router.get('/', competitionController.getAllCompetitions);
    router.get('/:id', competitionController.getCompetitionById);
    router.put('/:id', competitionController.updateCompetition);
    router.delete('/:id', competitionController.deleteCompetition);
    router.post('/:competitionId/addUser/:userId', competitionController.addUserToCompetition);
    router.post('/:competitionId/vote/:userId', competitionController.voteInCompetition);
    router.get('/:competitionId/participants', competitionController.getCompetitionParticipants);
    router.get('/:competitionId/voters', competitionController.getCompetitionVoters);
    router.delete('/:competitionId/removeUser/:userId', competitionController.removeUserFromCompetition);
    router.get('/singleusercompetition/:userId', competitionController.getCompetitionsByUserId)


    app.use('/api/competitions', router)
}

