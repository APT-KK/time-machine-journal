const express = require('express');
const { Signup , login , logout} = require('../Controllers/authController');
const  verifyToken  = require('../Middlewares/authMiddleware');

const router = express.Router();

router.post('/signup' , Signup);
router.post('/login' , login);
router.post('/logout' , logout);
router.get('/verify' , verifyToken , (req,res) => res.json({ isAuthenticated : true}));

module.exports = router;