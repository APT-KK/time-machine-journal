const express = require('express');
const { getLocationSummary } = require('../Controllers/LocationSummaryController');

const router = express.Router();

router.post('/location-summary', getLocationSummary);

module.exports = router;
