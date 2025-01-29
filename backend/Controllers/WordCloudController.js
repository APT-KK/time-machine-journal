const Groq = require('groq-sdk');
const Entry = require('../Models/Entry');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getWordCloudAnalysis (req,res) {
    try {
        const userId = req.user._id;
        const entries = await Entry.find({ userId }).sort({ date:-1 });

        const entriesContext = entries.map( entry => (
            `Date: ${entry.date.toISOString().split('T')[0]}
            Content: ${entry.content}\n\n`
        )).join('');

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role:"system",
                    content: `You are a text analysis expert. Analyze the given journal entries and provide the following insights:
                    1. Most Used Words: Extract the most frequently used significant words that represent key themes, emotions, and topics. 
                       Exclude common words and focus on meaningful terms. Limit to 5 - 7 words.
                    2. Writing Themes: Identify the primary themes or topics present in the journal entries. Limit to 6 themes.
                    3. Writing Tone or Style: Analyze the overall tone or style of the entries.
                    4. Rare or Unique Words: Identify rare or unique words that are not commonly found in everyday language . Limit to 5-7 words.

                    Return the output as a JSON object structured as follows:
                    {
                        "most_used_words": [{"text": "happiness", "value": 10}],
                        "themes": ["Personal Growth", "Relationships"],
                        "tone": "Reflective and Positive",
                        "rare_words": [
                            {"text": "serendipity", "value": 9},
                            {"text": "ephemeral", "value": 8}
                        ]
                    }`
                },
                {
                    role:"user",
                    content: `Analyze these journal entries and generate the insight:
                    ${entriesContext}`
                }
            ],
            model:"llama-3.3-70b-versatile",
            temperature: 0.4,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        const insights = JSON.parse(completion.choices[0]?.message?.content || "{}");
        res.status(200).json(insights);

    } catch (error) {
        console.error('Error in getting the Word Cloud Analysis', error);
        res.status(500).json({
            message: `Internal Server Error: ${error.message}`
        });
    }
};

module.exports = {
    getWordCloudAnalysis
};