const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const signUp = async (req , res) => {
    try {
        const {username , email , password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User already exists, you can login directly' });
        }

        const newUser = new User ({
            username, email , hashedPassword
        });
        await newUser.save();

        res.status(201).json({message: 'User created successfully!'}); 
    } catch (error) {
        res.status(500).json({message: `Internal server error! ${error}`});
    }
};

const login = async (req , res) => {
    try {
        const {email , password} = req.body;
        const user = User.findOne({email});

        if (!user) {
            return res.status(404).json({message: 'User not found!'});
        }

        const isMatch = await bcrypt.compare(hashedPassword, User.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid credentials!'});
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )
        
        res.status(200)
            .json({
                message: "Login is successful!",
                jwtToken,
                email,
                name: user.username
            })
    } catch (err) {
        res.status(500).json({message: `Internal server error! ${error}`});
    }
};


module.exports = {
    signUp,
    login
}