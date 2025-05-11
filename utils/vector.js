const { JinaEmbeddings } = require('@langchain/community/embeddings/jina');
const { Chroma } = require('@langchain/community/vectorstores/chroma');
const ingestArticles = require('../ingestArticles');
require('dotenv').config();

let vectorStore = null;

async function initVectorStore() {
    console.log('Initializing vector store...');
    const docs = await ingestArticles();
    if (!Array.isArray(docs) || docs.length === 0) {
        console.warn('No documents fetched during ingestion.');
        return;
    }

    const embeddings = new JinaEmbeddings({
        jinaApiKey: process.env.JINA_API_KEY,
    });

    vectorStore = await Chroma.fromDocuments(docs, embeddings, {
        collectionName: 'news',
        url: 'http://localhost:8000',
    });

    console.log('Vector store initialized successfully.');
}

async function retrieveRelevantDocs(query, k = 5) {
    if (!vectorStore) {
        console.log('Vector store not initialized. Triggering ingestion...');
        await initVectorStore();
    }

    if (!vectorStore) {
        console.warn('Vector store is still not initialized.');
        return [];
    }

    return await vectorStore.similaritySearch(query, k);
}

module.exports = { initVectorStore, retrieveRelevantDocs };