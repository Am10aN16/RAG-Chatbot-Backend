const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const { initRedis } = require('./redisClient');
const ingestArticles = require('./ingestArticles');
const { initVectorStore } = require('./utils/vector');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

app.get('/api/ingest', async (req, res) => {
    await ingestArticles();
    res.send('Ingestion complete.');
});

app.listen(PORT, async () => {
    try {
        console.log(`Server starting on http://localhost:${PORT}`);

        // Initialize Redis
        await initRedis();

        // Initialize Vector Store
        await initVectorStore();

        console.log('Server started successfully.');
    } catch (error) {
        console.error('Error during server initialization:', error.message);
        process.exit(1); // Exit the process if initialization fails
    }
});