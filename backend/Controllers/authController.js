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
          sameSite: 'lax',
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
            return res.status(400).json({ 
                success: false,
                message: 'Email and password are required' 
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                email: user.email,
                name: user.username
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};

const logout = async (req,res) => {
    res.clearCookie('jwt');
    res.status(200).json({message : 'Logged out successfully!'});
}

const verifyAuth = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.status(200).json({ 
            success: true,
            isAuthenticated: true,
            user: {
                email: user.email,
                name: user.username
            }
        });

    } catch (error) {
        console.error('Verify auth error:', error);
        res.status(401).json({ 
            success: false,
            message: 'Authentication failed' 
        });
    }
};

module.exports = {
    Signup,
    login,
    logout,
    verifyAuth
};
