const express = require('express');
const verifyToken = require('../Middlewares/authMiddleware');
const { getChatResponse } = require('../Controllers/ChatController');

const router = express.Router();

router.use(verifyToken);

router.post( '/question', getChatResponse);

module.exports = router;