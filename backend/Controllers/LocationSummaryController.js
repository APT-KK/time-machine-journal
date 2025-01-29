const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getLocationSummary(req, res) {
    try {
        const { location, entries } = req.body;

        if (!location || typeof location !== 'string') {
            return res.status(400).json({
                success: false,
                message: "Invalid location format"
            });
        }

        if (!entries || !Array.isArray(entries) || entries.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No entries provided for this location"
            });
        }
        
        //Validating the entries
        const validEntries = entries.every(entry => {

            if (!entry || typeof entry !== 'object') return false;
            if (!entry.date || !entry.title || !entry.content || !entry.location) return false;
            if (typeof entry.title !== 'string' || typeof entry.content !== 'string' || 
                typeof entry.location !== 'string') return false;

            try {
                const date = new Date(entry.date);
                if (isNaN(date.getTime())) return false;

            } catch (error) {
                return false;
            }
            return true;
        });

        if (!validEntries) {
            return res.status(400).json({
                success: false,
                message: "Invalid entry format - entries must include valid date, title, content, and location"
            });
        }

        const formatDate = (dateString) => {
            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) {
                    throw new Error('Invalid date'); //error if date isn't a number!
                }
                return date.toISOString().split('T')[0];
            } catch (error) {
                return 'Date not available';
            }
        };

        // Sanitize and format entries
        const sanitizedEntries = entries.map(entry => ({
            date: formatDate(entry.date),
            title: String(entry.title).slice(0, 200) || 'Untitled', //limiting the title length
            content: String(entry.content).slice(0, 5000) || 'No content', // Limiting the content length
            mood: String(entry.mood)
        }));

        const entriesContext = sanitizedEntries.map(entry => (
            `Date: ${entry.date}
            Title: ${entry.title}
            Content: ${entry.content}
            Mood: ${entry.mood}\n\n`
        )).join('');

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a travel diary assistant that creates concise, engaging summaries of visits to specific locations. 
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
                    role: "user",
                    content: `Please create a concise summary of my experiences in ${location} based on these journal entries.`
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 500
        });

        if (!completion.choices?.[0]?.message?.content) {
            throw new Error('No summary generated');
        }

        const summary = completion.choices[0].message.content;

        return res.status(200).json({
            success: true,
            response: summary
        });

    } catch (error) {
        console.error('Error in getLocationSummary:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate summary. Please try again.",
            error: error.message
        });
    }
}

module.exports = {
    getLocationSummary
};