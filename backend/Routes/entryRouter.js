const express = require('express');
const { createEntry , getEntries} = require('../Controllers/EntryController');
const verifyToken = require('../Middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', createEntry);
router.get('/', getEntries);

module.exports = router;