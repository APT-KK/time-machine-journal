const express = require('express');
const verifyToken = require('../Middlewares/authMiddleware');
const { getChatResponse } = require('../Controllers/ChatController');

const router = express.Router();

app.use(verifyToken);

app.post( '/question', getChatResponse);

module.exports = router;