const Groq = require('groq-sdk');
const Entry = require('../Models/Entry');
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

async function getChatResponse (req,res) {
    try {
      const { question } = req.body;
      const userId = req.user._id;

      const entries = await Entry.find({ userId }).sort({ date: -1 }).limit(20);

      const entriesContext = entries.map(entry => (

          `Date : ${entry.date.toISOString().split('T')[0]}
           Title: ${entry.title}
           Content: ${entry.content}
           Mood: ${entry.mood}
           Location: ${entry.location} \n \n` 

      )).join('');

      const completion = await groq.chat.completions
      .create({
        messages : [
            {
                role: "system",
                content: `You are a personal journal and diary assistant that helps the users to understand their journal entries. \n
                You have full access to their previous journal entries and are supposed to answer to their queries regarding the same. \n
                You can even refer to the previously done Mood Analysis if need arises in case you feel like you don't have sufficient information relating to the question. \n
                You are supposed to answer the user's questions empathically and thoughtfully. \n
                Guidelines:
                    - Always ground your responses in the actual content of the journal entries
                    - When discussing locations, be specific about places mentioned
                    - Reference actual dates and chronology when relevant
                    - If asked about places not in the entries, acknowledge this
                    - Connect insights across multiple entries when possible
                    - Consider both explicit statements and implicit patterns
                    - Be empathetic and personal in your responses
                    - Maintain a supportive and encouraging tone

                    Here are the journal entries to analyze:
                    ${entriesContext} `
            },
            {
                role: "user",
                content: `Here is the question about my journal entries: "${ question }" 
                \n Please answer it accordingly based on your analysis of my previous journal entries!`
            }
        ],

        model: "llama-3.3-70b-versatile", 
        temperature: 0.6,
        max_tokens: 550

      });

      res.status(200).json({
        response: completion.choices[0]?.message?.content || "Couldn't generate the response!"
      });

    } catch (error) {
        console.error('Error in getChatResponse:', error);
        res.status(500).json({
            message: `Internal server error: ${error.message}`
    });
  }
}

module.exports = {
    getChatResponse
};
