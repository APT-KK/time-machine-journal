const express = require('express');
const { Signup , login } = require('../Controllers/authController');

const router = express.Router();

router.post('/signup' , Signup);
router.post('/login' , login);

module.exports = router;