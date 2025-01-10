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

        res.status(200).json({
            response: completion.choices[0]?.message?.content?.trim() || 'neutral' 
        });

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

async function getEntryById (req,res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const entry = await Entry.findOne({_id: id , userId})
        .select('-__v');

        if(!entry) {
            return res.status(404).json({message : 'Entry not found'});
        }

        res.status(200).json({ entry });

    } catch (error) {
        console.error("Error fetching entry:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
};

async function deleteEntry (req,res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const entry = await Entry.findOneAndDelete({ _id: id , userId});

        if(!entry) {
            return res.status(404).json({message : 'Entry not found'});
        };

        await User.findByIdAndUpdate(
            userId,
            { $pull: { entries: id } },
            { new: true }
          );
        
        res.status(200).json({ message: 'Entry deleted successfully!' });
        
    } catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

async function updateEntry (req,res) {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const { title, date , location , description } = req.body;

        const mood = await analyzeTextMood(description);

        const entry = await Entry.findOneAndUpdate(
            { _id: id , userId},
            {
                title,
                content: description,
                location,
                date,
                mood
            },
            {new:true}
        ); 

        if(!entry){
            return res.status(404).json({message: 'Entry not found'});
        }

        return res.status(200).json({message: 'Entry updated successfully' ,
         entry
        });

    } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}
module.exports = {
    createEntry,
    getEntries,
    getEntryById,
    deleteEntry,
    updateEntry
};