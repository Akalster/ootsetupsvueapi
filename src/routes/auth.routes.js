const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

// register a user
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

module.exports = router;
