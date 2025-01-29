const express = require('express');
const { authenticateToken } = require('../Middleware/authMiddleware');
const { getWordCloudAnalysis } = require('../Controllers/WordCloudController');

const router = express.Router();

router.use(authenticateToken);
router.get('/', getWordCloudAnalysis);

module.exports = router;