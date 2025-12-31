# Document Analysis & Chat System - Backend

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust backend system for document analysis and AI-powered chat using Retrieval-Augmented Generation (RAG) architecture. This system enables users to upload documents, process them into vector embeddings, and interact with them through an intelligent chat interface.

## 🚀 Features

### Core Features
- **📄 PDF Document Processing** - Upload and process PDF documents asynchronously
- **🔍 Semantic Search** - Vector-based similarity search using Qdrant
- **🤖 AI-Powered Chat** - Context-aware responses using Google's Gemini AI
- **⚡ Async Processing** - BullMQ queue for scalable document processing
- **📊 Real-time Updates** - WebSocket support for processing status
- **🔒 Security** - File validation, rate limiting, and CORS protection

### Technical Features
- **Modular Architecture** - Clean separation of concerns
- **Error Handling** - Comprehensive error handling and logging
- **Scalable Design** - Microservices-ready architecture
- **Containerized** - Docker and Docker Compose support
- **Monitoring** - Health checks and metrics endpoint


### System Flow
1. **Document Upload** → File validation → Temporary storage → Queue addition
2. **Queue Processing** → PDF text extraction → Embedding generation → Vector storage
3. **Chat Query** → Vector similarity search → Context retrieval → AI response generation

## 📋 Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
2. **Docker** and **Docker Compose**
3. **Git**

### Required Accounts & API Keys
1. **Google Cloud Account** - For Gemini API access
2. **HuggingFace Account** - For embedding models
3. **Qdrant Cloud Account** - Or self-hosted Qdrant instance
4. **Redis Cloud Account**  - For production queue

# Server Configuration
PORT=8080
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080

# API Keys
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
QDRANT_API_KEY=your_qdrant_api_key_here

# Database & Services
QDRANT_URL=https://your-qdrant-cluster.cloud
REDIS_URL=redis://localhost:6379

# File Upload
MAX_FILE_SIZE=20971520  # 20MB in bytes
UPLOAD_DIR=./uploads
