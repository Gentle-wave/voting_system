const db = require('../models');
const Competition = db.competition;
const User = db.user;
const Vote = db.vote;
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

// exports.addUserToCompetition = async (req, res, next) => {
//     const { competitionId, userId } = req.params;

//     try {
//         // Check if the competition exists
//         const competition = await Competition.findByPk(competitionId);

//         if (!competition) {
//             return res.status(404).json({ message: 'Competition not found' });
//         }

//         // Check if the user exists
//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Check if the user is already registered for this competition
//         // const isUserRegistered = await CompetitionParticipant.findByPk(userId);

//         // if (isUserRegistered) {
//         //     return res.status(400).json({ message: 'User is already registered for this competition' });
//         // }


//         const newCompetitionUser = await CompetitionParticipant.create({
//             competitionId,
//             userId
//         });


//         res.status(200).json({
//             message: 'User added to the competition successfully',
//             newCompetitionUser: newCompetitionUser
//         });
//     } catch (err) {
//         console.error('Error adding user to competition: ', err);
//         next(err);
//     }
// };

// // Allow a user to vote in a competition
// exports.voteInCompetition = async (req, res, next) => {
//     const { competitionId, userId } = req.params;

//     try {
//         const competition = await Competition.findByPk(competitionId);

//         if (!competition) {
//             return res.status(404).json({ message: 'Competition not found' });
//         }
//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // const isUserRegistered = await competition.hasUser(user);

//         // if (!isUserRegistered) {
//         //     return res.status(400).json({ message: 'User is not registered for this competition' });
//         // }

//         // Perform the voting process
//         // For example, you can create a new Vote entry in your database to record the user's vote
//         const vote = await CompetitionVote.create({
//             competitionId,
//             userId,
//         });

//         res.status(200).json({
//             message: 'Vote recorded successfully',
//             votes: vote
//         });
//     } catch (err) {
//         console.error('Error recording vote: ', err);
//         next(err);
//     }
// };

// Allow a user to be added to a competition
exports.addUserToCompetition = async (req, res, next) => {
    const { competitionId, userId } = req.params;

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

        // Add the user to the competition
        await competition.addUser(user);

        res.status(200).json({
            message: 'User added to the competition successfully'
        });
    } catch (err) {
        console.error('Error adding user to competition: ', err);
        next(err);
    }
};

// Allow a user to vote in a competition
exports.voteInCompetition = async (req, res, next) => {
    const { competitionId, userId } = req.params;

    try {
        const competition = await Competition.findByPk(competitionId);

        if (!competition) {
            return res.status(404).json({ message: 'Competition not found' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Record the user's vote in the competition
        await competition.addUser(user);

        res.status(200).json({
            message: 'Vote recorded successfully'
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
        const participants = await await CompetitionParticipant.findAll({
            where: { competitionId },
            attributes: ['userId'], 
            group: ['userId'], 
        });

        const participantsDetails = await User.findAll({
            where: { id: participants.map((participants) => participants.userId) },
            attributes: ['id', 'email', 'firstName', 'lastName'],
        });


        res.status(200).json({participants : participantsDetails });
    } catch (err) {
        console.error('Error fetching competition participants: ', err);
        next(err);
    }
};


// Get voters of a specific competition
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
            attributes: ['userId'], // Select only the userId from Vote records
            group: ['userId'], // Group the results by userId to get unique voters
        });

        // Fetch user details for each voter (e.g., email, name)
        const voterDetails = await User.findAll({
            where: { id: voters.map((voter) => voter.userId) },
            attributes: ['id', 'email', 'firstName', 'lastName'],
        });

        res.status(200).json({ voters: voterDetails });
    } catch (err) {
        console.error('Error fetching competition voters: ', err);
        next(err);
    }
};
