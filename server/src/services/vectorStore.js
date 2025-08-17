import { ChromaClient } from 'chromadb';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Embeddings } from "@langchain/core/embeddings";
import { pipeline } from '@xenova/transformers';

const CHROMA_COLLECTION = 'labsense_rag';

// A custom class that runs embeddings locally using Transformers.js
class LocalEmbeddings extends Embeddings {
    constructor() {
        super();
        this.pipeline = null;
    }

    // Initialize the model pipeline. This will download the model on the first run.
    async initialize() {
        if (this.pipeline) return;
        // This uses a small, efficient, and powerful embedding model
        this.pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    async embedDocuments(texts) {
        await this.initialize();
        const output = await this.pipeline(texts, { pooling: 'mean', normalize: true });
        return output.tolist();
    }

    async embedQuery(text) {
        await this.initialize();
        const output = await this.pipeline(text, { pooling: 'mean', normalize: true });
        return output.tolist()[0];
    }
}

const client = new ChromaClient();
const vectorStore = new Chroma(new LocalEmbeddings(), {
    collectionName: CHROMA_COLLECTION,
    url: process.env.CHROMA_URL || 'http://localhost:8000',
});

export const retrieveRelevantContext = async (query) => {
    const retriever = vectorStore.asRetriever(4);
    const relevantDocs = await retriever.invoke(query);
    return relevantDocs.map(doc => doc.pageContent).join('\n\n---\n\n');
};