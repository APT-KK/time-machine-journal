const Entry= require('../Models/Entry');
const User = require('../Models/User');
const Groq = require('groq-sdk');

require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY 
});

async function analyzeTextMood (content)  {
    try {

        const completion = await groq.chat.completions.create({
            messages: [ 
                {
                    role: "system",
                    content:"1) You are an emotional analysis assistant specialized in detecting moods and emotional states from text. Your primary function is to analyze the emotional undertones in user messages.\n" +
                            "2) You must respond with exactly one word that best captures the dominant emotion or mood. Choose from emotions like: happy, sad, angry, excited, nervous, confused, neutral, etc.\n" +
                            "3) If multiple emotions are present, identify the strongest or most prominent one.\n" +
                            "4) If the emotional state is unclear or ambiguous, default to 'neutral'."
                },
                {
                    role: "user",
                    content: `Analyze the following text : "${content}"`
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content?.trim() || 'neutral' ;

    } catch (error) {
        console.error('Error in analyzeTextMood:', error);
        return 'neutral';
    }
};

async function createEntry (req, res) {
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

async function getEntries (req,res) {
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