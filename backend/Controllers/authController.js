const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validating input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Checking if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists, you can login directly' });
        }

        // Hashing and salting the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating and saving the new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error("Error in signUp:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validating the input
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Checking if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // matching the passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        // Generating JWT token
        const token = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Logging the response
        console.log("Login successful:", {
            message: "Login is successful!",
            token,
            email: user.email,
            name: user.username,
        });

        // Sending the response
        res.status(200).json({
            message: "Login is successful!",
            token,
            email: user.email,
            name: user.username,
        });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

module.exports = {
    signUp,
    login,
};
