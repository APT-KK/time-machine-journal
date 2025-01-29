const express = require('express');
const { getChatResponse } = require('../Controllers/ChatController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/question', getChatResponse);

module.exports = router;