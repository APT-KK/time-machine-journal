const Entry= require('../Models/Entry');
const User = require('../Models/User');
const Groq = require('groq-sdk');

require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY 
});

async function analyzeTextMood(content) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an emotional analysis assistant. Analyze the text and return ONLY a JSON object with:\n" +
                            "1. mood: One word that best captures the dominant emotion (Happy, Sad, Excited, Anxious, Calm, Neutral)\n" +
                            "2. confidence: A number between 0.1 and 1.0 indicating how confident you are in this assessment\n" +
                            "Format: {\"mood\": \"happy\", \"confidence\": 0.8}"
                },
                {
                    role: "user",
                    content: `Analyze the following text: "${content}"`
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3, 
            max_tokens: 100
        });

        let analysisText = completion.choices[0]?.message?.content || '';
        
        // Clean up the response to ensure it's valid JSON
        analysisText = analysisText.trim();
        if (!analysisText.startsWith('{')) {
            throw new Error('Invalid JSON format');
        }

        const analysis = JSON.parse(analysisText);
        
        // Validate the parsed object
        if (!analysis.mood || typeof analysis.confidence !== 'number') {
            throw new Error('Invalid analysis format');
        }

        return {
            mood: analysis.mood,
            confidence: analysis.confidence
        };

    } catch (error) {
        console.error('Error in analyzeTextMood:', error);
        return { mood: 'neutral', confidence: 0.5 };
    }
}

async function createEntry (req, res) {
    try {
        const { title, location, date, description } = req.body;
        const userId = req.user._id;

        if(!title) {
            return res.status(400).json({message: 'Title is required'});
        }
        
        const moodAnalysis = await analyzeTextMood(description);

        const entry = new Entry({
            title,
            content: description,
            location,
            date,
            mood: moodAnalysis.mood,
            confidence: moodAnalysis.confidence,
            userId
        });

        const savedEntry = await entry.save();

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
        res.setHeader('Content-Type', 'application/json');
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

        if(!title){
            return res.status(400).json({message: 'Title is required'});
        }

        const moodAnalysis = await analyzeTextMood(description);

        const entry = await Entry.findOneAndUpdate(
            { _id: id , userId},
            {
                title,
                content: description,
                location,
                date,
                mood: moodAnalysis.mood,
                confidence: moodAnalysis.confidence,
                userId
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
    updateEntry,
    analyzeTextMood
};
