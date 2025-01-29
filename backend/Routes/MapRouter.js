const express = require('express');
const { Geocode } = require('../Controllers/geocoding');
const { getLocationSummary } = require('../Controllers/LocationSummaryController');
const { authenticateToken } = require('../Middleware/authMiddleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/geocode', Geocode);
router.post('/location-summary', getLocationSummary);

module.exports = router;