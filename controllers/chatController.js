const axios = require('axios');
const { retrieveRelevantDocs } = require('../utils/vector');
const { getClient } = require('../redisClient');
const { v4: uuidv4 } = require('uuid');

async function chatHandler(req, res) {
    const { message, sessionId } = req.body;
    const session = sessionId || uuidv4();
    const redis = getClient();

    try {
        // Retrieve relevant documents for context
        const docs = await retrieveRelevantDocs(message);

        if (!docs || docs.length === 0) {
            console.warn('No relevant documents found for the query.');
            return res.json({ sessionId: session, message, answer: 'No relevant context found for your query.' });
        }

        // Construct the context from retrieved documents
        const context = docs.map(d => d.pageContent).join('\n');

        // Construct the prompt
        const prompt = `Based on the context, answer the query.\nContext:\n${context}\n\nUser: ${message}\nAnswer:`;

        // Make the API call to Gemini Flash
      
            const geminiRes = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
                { contents: [{ parts: [{ text: prompt }] }] },
                { params: { key: process.env.GEMINI_API_KEY } }
            );
        

        // Extract the answer from the response
        console.log('Gemini response:', geminiRes.data);
        
        const answer = geminiRes.data.candidates?.[0]?.output || 'No answer generated.';

        // Log the chat in Redis
        const chatLog = { role: 'user', message };
        const botLog = { role: 'bot', message: answer };

        await redis.rPush(session, JSON.stringify(chatLog));
        await redis.rPush(session, JSON.stringify(botLog));
        await redis.expire(session, 3600); // TTL 1 hour

        // Send the response
        res.json({ sessionId: session, message, answer });
    } catch (err) {
        console.error('Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Server error' });
    }
}

async function fetchHistory(req, res) {
    const redis = getClient();
    const sessionId = req.params.sessionId;
    const history = await redis.lRange(sessionId, 0, -1);
    res.json(history.map(h => JSON.parse(h)));
}

async function clearSession(req, res) {
    const redis = getClient();
    const sessionId = req.params.sessionId;
    await redis.del(sessionId);
    res.sendStatus(200);
}

module.exports = { chatHandler, fetchHistory, clearSession };
