const db = require('../models');
const Competition = db.competition;
const User = db.user;
const CompetitionVote = db.competitionVote
const CompetitionParticipant = db.competitionParticipant

// Create a new competition
exports.createCompetition = async (req, res, next) => {
    try {
        const { title, description, startDate, duration } = req.body;

        if (!title || !description || !startDate || !duration) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const competition = await Competition.create({ title, description, startDate, duration });
        res.status(201).json(competition);
    } catch (err) {
        console.error('Error creating competition: ', err);
        next(err);
    }
};

// Get all competitions
exports.getAllCompetitions = async (req, res, next) => {
    try {
        const competitions = await Competition.findAll();

        if (competitions.length === 0) {
            return res.status(200).json({ message: 'No competition currently active' });
        }

        res.status(200).json({
            competitions: competitions
        });
    } catch (err) {
        console.error('Error fetching competitions: ', err);
        next(err);
    }
};


// Get a competition by ID
exports.getCompetitionById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const competition = await Competition.findByPk(id);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        res.status(200).json(competition);
    } catch (err) {
        console.error('Error fetching competition by ID: ', err);
        next(err);
    }
};

// Update a competition by ID
exports.updateCompetition = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, startDate, duration } = req.body;

    try {
        const competition = await Competition.findByPk(id);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        competition.title = title;
        competition.description = description;
        competition.startDate = startDate;
        competition.duration = duration;

        await competition.save();

        res.status(200).json(competition);
    } catch (err) {
        console.error('Error updating competition: ', err);
        next(err);
    }
};

// Delete a competition by ID
exports.deleteCompetition = async (req, res, next) => {
    const { id } = req.params;

    try {
        const competition = await Competition.findByPk(id);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        await competition.destroy();
        res.status(200).json({ message: 'Competition has been deleted' });
    } catch (err) {
        console.error('Error deleting competition: ', err);
        next(err);
    }
};

// Allow a user to be added to a competition
exports.addUserToCompetition = async (req, res, next) => {
    const { competitionId, userId } = req.params;
    const { userName, } = req.body;

    try {
        // Check if the competition exists
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        // Check if the user exists
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Check if the user is already registered for this competition
        const isUserRegistered = await CompetitionParticipant.findOne({
            where: {
                competitionId,
                userId,
            },
        });

        if (isUserRegistered) {
            return res.status(400).json({ message: 'User is already registered for this competition' });
        }


        // Create new registration and add it to the database
        const newCompetitionUser = await CompetitionParticipant.create({
            competitionId,
            userName,
            userId
        });

        res.status(200).json({
            message: 'User added to the competition successfully',
            newCompetitionUser: newCompetitionUser,
        });
    } catch (err) {
        console.error('Error adding user to competition: ', err);
        next(err);
    }
};
// Remove an individual from a competition by their id and competition ID
exports.removeUserFromCompetition = async (req, res, next) => {
    const { competitionId, userId } = req.params;
   // const { userId } = req.body

    try {
        // Check if the competition exists
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        // Check if the user exists
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is registered for this competition
        const registration = await CompetitionParticipant.findOne({
            where: {
                competitionId, userId,
            },
        });

        if (!registration) {
            return res.status(400).json({ message: 'User is not registered for this competition' });
        }

        // Remove the user from the competition
        await registration.destroy();

        // Delete the user's votes in the competition
        await CompetitionVote.destroy({
            where: {
                competitionId,
                userId,
            },
        });

        res.status(200).json({ message: 'User removed from the competition and their votes deleted successfully' });
    } catch (err) {
        console.error('Error removing user from competition: ', err);
        next(err);
    }
};

// Allow a user to vote in a competition
exports.voteInCompetition = async (req, res, next) => {
    const { competitionId, userId } = req.params;
    const { voteesName } = req.body;

    try {
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already voted in this competition
        const existingVote = await CompetitionVote.findOne({
            where: {
                competitionId,
                userId,
            },
        });

        if (existingVote) {
            return res.status(400).json({ message: 'User has already voted in this competition' });
        }

        // Perform the voting process
        const vote = await CompetitionVote.create({
            competitionId,
            userId,
            voteesName,
        });

        res.status(200).json({
            message: 'Vote recorded successfully',
            votes: vote,
        });
    } catch (err) {
        console.error('Error recording vote: ', err);
        next(err);
    }
};


// Get participants of a specific competition
exports.getCompetitionParticipants = async (req, res, next) => {
    const { competitionId } = req.params;

    try {
        // Check if the competition exists
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        // Get the participants of the competition
        const participants = await CompetitionParticipant.findAll({
            where: { competitionId },
        });

        if (participants.length === 0) {
            return res.status(200).json({ message: 'There are no participants in this competition yet' });
        }

        res.status(200).json({ participants: participants });
    } catch (err) {
        console.error('Error fetching competition participants: ', err);
        next(err);
    }
};



// Get the names and count of voters in a competition
exports.getCompetitionVoters = async (req, res, next) => {
    const { competitionId } = req.params;

    try {
        // Check if the competition exists
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        // Get the users who have voted in the competition
        const voters = await CompetitionVote.findAll({
            where: { competitionId },
        });

        // Extract the names of voters
        const voterNames = voters.map((voter) => voter);

        res.status(200).json({ voterCount: voters.length, voters: voterNames });
    } catch (err) {
        console.error('Error fetching competition voters: ', err);
        next(err);
    }
};
