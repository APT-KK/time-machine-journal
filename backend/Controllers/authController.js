const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const Signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists, you can login directly' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign(
            {email: newUser.email, _id: newUser._id},
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.cookie('jwt' , token , {
          httpOnly : true,
          secure: process.env.NODE_ENV === 'production', // currently its development so it will be false , change it when deploying
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // found while debugging (warning)
          maxAge : 24 * 60 * 60 * 1000   
        });

        res.status(201).json({ message: 'User created successfully!' , 
            isAuthenticated : true });
            
    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        res.status(200).json({
            message: "Login successful!",
            isAuthenticated: true,
            email: user.email,
            name: user.username,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

const logout = async (req,res) => {
    res.clearCookie('jwt');
    res.status(200).json({message : 'Logged out successfully!'});
}
module.exports = {
    Signup,
    login,
    logout
};
