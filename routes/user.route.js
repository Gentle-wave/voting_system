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
    router.get('/users', findAllUsers);
    router.delete('/users', deleteAllUsers);
    router.delete('/users/:userId', deleteUserById);
    router.get('/users/:userId', findUserById);



    app.use('/api/user', router)

}