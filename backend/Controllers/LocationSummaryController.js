const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getLocationSummary (req,res) {
    try {

        const { location, entries } = req.body;

        const entriesContext = entries.map(entry => (
            `Date: ${entry.date.toISOString().split('T')[0]}
                Title: ${entry.title}
                Content: ${entry.content}
                Mood: ${entry.mood} \n\n`
           )).join('');

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role:"system",
                    content:`You are a travel diary assistant that creates concise, engaging summaries of visits to specific locations. 
                    Focus on highlighting key experiences, emotions, and memorable moments from the journal entries.
                    
                    Guidelines:
                    - Summarize the overall experience and mood of the visits
                    - Highlight specific activities or places mentioned
                    - Note any patterns or changes across multiple visits
                    - Keep the tone personal and reflective
                    - Include emotional context when relevant
                    
                    Here are the journal entries about ${location}:
                    ${entriesContext}`
                },
                {
                    role:"user",
                    content:`Please create a concise summary of my experiences in ${location} based on these journal entries.`
                }
            ],
            model:"llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300
        });

        res.status(200).json({
            response:completion.choices[0]?.message?.content  || "Couldn't generate the summary,Sorry!"
        });

    } catch (error) {
      console.error('Error in getLocationSummary', error);
      res.status(500).json({
        message: `Internal servor error: ${error.message}`
      });
    }
}

module.exports = {
    getLocationSummary
};