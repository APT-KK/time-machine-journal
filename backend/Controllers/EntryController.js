const Entry= require('../Models/Entry');
const User = require('../Models/User');
const Groq = require('groq-sdk');

require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY 
});

const analyzeTextMood = async (content) => {
    try {

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Analyze the following text and describe the mood in a single word : "${content}"`
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content?.trim() || 'neutral' ;

    } catch (error) {
        console.error('Error in analyzeTextMood:', error);
        return 'neutral';
    }
};

const createEntry = async (req, res) => {
    try {
        const { title , location , date , description} = req.body;
        const userId = req.user._id;
        
        const mood = await analyzeTextMood(description);

        const entry = new  Entry({
            title,
            content: description,
            location,
            date,
            mood,
            userId
        });

        const savedEntry = await entry.save();
        console.log('Entry saved:', savedEntry);

         await User.findByIdAndUpdate(
            userId,
            { $push: { entries: savedEntry._id } },
            { new: true }
        );

        res.status(201).json({
            message: 'Entry created successfully',
            entry: savedEntry
        });
    } catch (error) {
        console.error('Error in createEntry:', error);
        res.status(500).json({
            message: `Internal server error: ${error.message}`
        });
    }
};

const getEntries = async (req,res) => {
    try {
        const userId = req.user._id;
        const entries = await Entry.find({userId}).sort({date: -1}).select('-__v');

        res.status(200).json(entries);

    } catch (error) {
        console.error('Error in getEntries:', error);
        res.status(500).json({
            message: `Internal server error: ${error.message}`
        });
    }
}

module.exports = {
    createEntry,
    getEntries
};