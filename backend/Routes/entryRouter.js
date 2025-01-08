const express = require('express');
const { createEntry , getEntries, getEntryById, deleteEntry, updateEntry} = require('../Controllers/EntryController');
const verifyToken = require('../Middlewares/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', createEntry);
router.get('/', getEntries);
router.get('/:id', getEntryById);
router.delete('/:id', deleteEntry);
router.put('/:id', updateEntry)

module.exports = router;