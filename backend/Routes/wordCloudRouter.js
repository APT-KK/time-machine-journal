const express = require('express');
const verifyToken = require('../Middlewares/authMiddleware');
const { getWordCloudAnalysis } = require('../Controllers/WordCloudController');

const router = express.Router();

router.use(verifyToken);
router.get('/analysis' , getWordCloudAnalysis);

module.exports = router;