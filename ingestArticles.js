const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const { Document } = require('@langchain/core/documents');
const readability = require('node-readability');

async function ingestArticles() {
    console.log('Fetching news articles using node-readability...');

    const urls = [
        'https://www.nytimes.com',
        'https://www.bbc.com/news',
        'https://www.cnn.com'
    ];

    const articles = await Promise.all(
        urls.map((url) => {
            return new Promise((resolve) => {
                readability(url, (err, article) => {
                    if (err) {
                        console.error(`Failed to fetch article from ${url}:`, err);
                        resolve(null);
                    } else {
                        resolve({
                            title: article.title,
                            text: article.content,
                            source: url
                        });
                        article.close();
                    }
                });
            });
        })
    );

    const docs = articles
        .filter(article => article !== null)
        .map(article => new Document({
            pageContent: article.text || '',
            metadata: {
                title: article.title,
                source: article.source
            }
        }));

    console.log(`Fetched ${docs.length} articles.`);
    return docs; // Return the documents
}

module.exports = ingestArticles;