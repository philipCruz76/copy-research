<div align="center">

# 🤖 AI Research Assistant

_A powerful AI-driven research platform for document analysis, intelligent conversations, and content generation_

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-00A67E?logo=openai)](https://openai.com/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-6366f1)](https://www.pinecone.io/)

[Live Demo](https://copy-research-delta.vercel.app/) · [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## 🎯 Overview

AI Research Assistant is a comprehensive platform that transforms how you interact with documents and information. Built with cutting-edge AI technologies, it enables intelligent document analysis, semantic search, and automated content generation while maintaining enterprise-grade security and performance.

### ✨ Why Choose AI Research Assistant?

- **🚀 Lightning Fast**: Advanced vector search with fast response times
- **🌐 Multi-language**: Native support for English and Portuguese (Portugal)
- **📱 Responsive**: Beautiful, mobile-first design that works everywhere
- **🔄 Real-time**: Streaming responses for immediate feedback

## 🌟 Key Features

### 📄 Document Intelligence

- **Multi-format Support** - Upload PDF, DOCX, TXT files or import web content via URLs
- **Smart Summarization** - AI-powered document summaries with key topic extraction
- **Citation Tracking** - Precise source attribution with chunk-level references
- **Semantic Search** - Advanced RAG (Retrieval-Augmented Generation) with Pinecone

### 💬 Intelligent Conversations

- **Context-Aware Chat** - Natural conversations with your document knowledge base
- **Follow-up Intelligence** - Smart detection and handling of related questions
- **Web Search Integration** - Automatic web search when context is insufficient
- **Streaming Responses** - Real-time answer generation for better UX

### ✍️ Content Generation

- **Professional Copywriting** - Generate high-quality blog posts and articles
- **Content Wizard** - Step-by-step guided content creation process
- **Customizable Output** - Adjust tone, audience, and style preferences
- **Template Library** - Pre-built templates for common content types

### 🔧 Advanced Capabilities

- **Semantic Similarity** - Cosine similarity for intelligent content matching
- **Smart Query Synthesis** - Convert conversations into optimized search queries
- **Document Embeddings** - State-of-the-art text embeddings for superior accuracy
- **Automated Citations** - Dynamic citation generation and verification

## 🛠️ Technology Stack

<div align="center">

| Category        | Technologies                                                                                                                                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**    | ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)             |
| **AI/ML**       | ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-00A67E?logo=openai) ![LangChain](https://img.shields.io/badge/LangChain-Framework-green) ![AI SDK](https://img.shields.io/badge/AI_SDK-Vercel-black)                          |
| **Database**    | ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql) ![Pinecone](https://img.shields.io/badge/Pinecone-Vector%20DB-6366f1) |
| **Auth & APIs** | ![NextAuth](https://img.shields.io/badge/NextAuth.js-Authentication-purple) ![Tavily](https://img.shields.io/badge/Tavily-Search%20API-orange)                                                                                     |
| **UI/UX**       | ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css) ![Radix UI](https://img.shields.io/badge/Radix_UI-Components-161618) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-0055FF) |

</div>

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/copy-research.git
   cd copy-research
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   # AI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Vector Database
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment

   # Database
   DATABASE_URL=your_postgresql_connection_string

   # Search Integration
   TAVILY_API_KEY=your_tavily_api_key

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # AWS S3 (for file storage)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket_name
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open Application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Quick Start Guide

1. **📁 Upload Documents**

   - Click "Add Documents" in the dashboard
   - Upload PDF, DOCX, or TXT files
   - Or paste web URLs for automatic content extraction

2. **💬 Start Chatting**

   - Navigate to the chat interface
   - Ask questions about your uploaded documents
   - Get AI-powered answers with proper citations

3. **✍️ Generate Content**
   - Use the copywriting tools to create blog posts
   - Leverage the content wizard for guided creation
   - Customize tone, audience, and style preferences

### Example Use Cases

- **📚 Research Analysis**: Upload academic papers and get instant summaries
- **📄 Document Q&A**: Ask specific questions about lengthy documents
- **✍️ Content Creation**: Generate blog posts from your research materials
- **🔍 Information Discovery**: Find relevant information across multiple documents

### Key Components

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **API Layer**: RESTful endpoints with streaming support
- **AI Engine**: OpenAI GPT-4 with LangChain orchestration
- **Vector Store**: Pinecone for semantic search and retrieval
- **Database**: PostgreSQL with Prisma ORM for relational data
- **File Processing**: Multi-format document parsing and chunking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to Top](#-ai-research-assistant)**

</div>
