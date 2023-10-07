const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
db = require('../models');
const User = db.user
require('dotenv').config();
const APISECRET_KEY = process.env.SECRET_KEY

const validateSignup = [
    check('email').isEmail().withMessage('Invalid email format'),
];

// Signup function
const signup = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, gender } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ firstName, lastName, email, gender, password: hashedPassword });

        const token = jwt.sign({ userId: newUser.id }, APISECRET_KEY, { expiresIn: '1h' });

        res.status(201).json({ message: 'User created successfully', newUser, token });
    } catch (error) {
        next(error);
    }
};

// Login function
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: user.id }, APISECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful', user,
            Token: token
        });
    } catch (error) {
        next(error);
    }
};


// Function to retrieve all users
const findAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users available.' });
        }
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};


// Function to delete all users
const deleteAllUsers = async (req, res, next) => {
    try {
        const result = await User.destroy({ where: {} });
        if (result > 0) {
            res.status(201).json({ message: `${result} user(s) have been deleted successfully.` });
        } else {
            res.status(404).json({ message: 'No user found to delete.' });
        }
    } catch (err) {
        next(err);
    }
};

// Function to delete a user by ID
const deleteUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        await user.destroy();
        res.status(200).json({ message: 'User has been deleted.' });
    } catch (err) {
        next(err);
    }
};

// Function to find a user by ID
const findUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};


module.exports = {
    signup,
    findAllUsers,
    deleteAllUsers,
    deleteUserById,
    findUserById,
    login,
};
