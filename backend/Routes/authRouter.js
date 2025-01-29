const express = require('express');
const { Signup , login , logout, verifyAuth } = require('../Controllers/authController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

router.post('/signup' , Signup);
router.post('/login' , login);
router.post('/logout' , logout);
router.get('/verify' , authenticateToken, verifyAuth);

module.exports = router;