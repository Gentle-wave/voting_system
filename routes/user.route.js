module.exports = app => {
    const express = require('express')
    let router = express.Router()
    const { signup,
        findAllUsers,
        deleteAllUsers,
        deleteUserById,
        findUserById,
        login } = require('../controllers/user.controller');
    const { check, validationResult } = require('express-validator');
    const validateSignup = [
        check('email').isEmail().withMessage('Invalid email format'),
    ];


    router.post('/signup', validateSignup, signup);
    router.post('/login', login);
    router.get('/', findAllUsers);
    router.delete('/', deleteAllUsers);
    router.delete('/:userId', deleteUserById);
    router.get('/:userId', findUserById);



    app.use('/api/user', router)

}