# 📰 RAG-Powered News Chatbot — Backend

This backend powers a chatbot that uses Retrieval-Augmented Generation (RAG) to answer user questions based on ingested news articles.

## 🧠 Tech Stack

- **Node.js + Express** – Web server
- **Chroma** – Vector store
- **Jina Embeddings** – Text embedding model
- **Google Gemini API** – LLM for response generation
- **Redis** – Chat session memory
- **LangChain** – Text splitting, vector search, document abstraction

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/news-rag-chatbot.git
cd backend
```

 ### 2. Install Dependencies
 ```bash
    npm install
```

 ### 3.Set Up Environment Variables
 ```bash
    Take example from .env.example
```

 ### 4. Start Redis (if not already running)

 ### 5.Ingest News Articles
 ```bash
 curl http://localhost:5000/api/ingest
```

### 6. node server.js

