const redis = require('redis');
let client;

async function initRedis() {
    client = redis.createClient();
    await client.connect();
    console.log('Redis connected');
}

function getClient() {
    return client;
}

module.exports = { initRedis, getClient };