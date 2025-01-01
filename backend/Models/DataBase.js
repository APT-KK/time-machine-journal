const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected Successfully!');
        
        mongoose.connection.on('error', err => {
            console.error('MongoDB Runtime Error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB Disconnected');
        });

    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
