# AI Research Assistant

A powerful AI-driven research assistant built with Next.js that helps you analyze documents, generate content, and conduct intelligent conversations with your data.

## 🚀 Key Features

### 📄 Document Processing & Analysis
- **Multi-format Support**: Upload PDF, DOCX, TXT files or add content via web URLs
- **Intelligent Summarization**: Automatic document summaries with key topic extraction
- **Vector Storage**: Advanced semantic search using Pinecone for document retrieval
- **Citation Support**: Precise citations with chunk-level references

### 🤖 Intelligent Chat Assistant
- **Context-Aware Conversations**: Chat with your documents using advanced RAG (Retrieval-Augmented Generation)
- **Follow-up Detection**: Smart detection of follow-up questions for better context continuity
- **Web Search Integration**: Automatically searches the web when document context is insufficient
- **Multi-language Support**: Supports both English and Portuguese (Portugal)
- **Real-time Streaming**: Fast, streaming responses for better user experience

### ✍️ AI Copywriting Tools
- **Blog Post Generation**: Create professional blog posts from your documents
- **Content Wizard**: Step-by-step content creation with preview functionality
- **Customizable Output**: Adjust tone, audience, and keywords for targeted content
- **Mobile Responsive**: Optimized interface for both desktop and mobile devices

### 🔧 Advanced AI Capabilities
- **Semantic Similarity**: Uses cosine similarity for intelligent content matching
- **Smart Query Synthesis**: Converts chat context into optimized search queries
- **Document Embeddings**: Advanced text embeddings for superior search accuracy

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI/ML**: OpenAI GPT models, LangChain, AI SDK
- **Database**: Prisma ORM with PostgreSQL
- **Vector Database**: Pinecone for semantic search
- **Authentication**: NextAuth.js
- **UI/UX**: Tailwind CSS, Radix UI, Framer Motion
- **File Processing**: PDF parsing, web scraping with Cheerio
- **Search**: Tavily API for web search integration

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd copy-research
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   PINECONE_API_KEY=your_pinecone_key
   DATABASE_URL=your_database_url
   TAVILY_API_KEY=your_tavily_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Upload Documents**: Start by uploading your research documents or adding web URLs
2. **Chat with Your Data**: Ask questions about your documents in natural language
3. **Generate Content**: Use the copywriting tools to create blog posts and articles
4. **Explore Insights**: Review document summaries and key topics automatically extracted

## 🔒 Privacy & Security

- Your documents are processed securely and stored with proper access controls
- Vector embeddings ensure fast retrieval without compromising document integrity
- All conversations and documents are associated with your session for privacy

## 🤝 Contributing

This project is built with modern web technologies and follows best practices for scalability and maintainability. Contributions are welcome!

## 📄 License

This project is for research and educational purposes.
