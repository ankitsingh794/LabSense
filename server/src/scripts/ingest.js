import 'dotenv/config.js';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChromaClient } from 'chromadb';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Embeddings } from "@langchain/core/embeddings";
import { pipeline } from '@xenova/transformers';

// A custom class that runs embeddings locally using Transformers.js
class LocalEmbeddings extends Embeddings {
    constructor() {
        super();
        this.pipeline = null;
    }

    // Initialize the model pipeline. This will download the model on the first run.
    async initialize() {
        if (this.pipeline) return;
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

const DATA_PATH = 'data';
const CHROMA_COLLECTION = 'labsense_rag';

const run = async () => {
    try {
        const loader = new DirectoryLoader(DATA_PATH, {
            '.pdf': (path) => new PDFLoader(path),
        });
        const docs = await loader.load();
        console.log(`Loaded ${docs.length} documents.`);

        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const chunks = await textSplitter.splitDocuments(docs);
        console.log(`Split documents into ${chunks.length} chunks.`);

        // --- THIS IS THE FIX ---
        // ChromaDB only accepts simple metadata. We clean up the complex objects
        // created by the PDFLoader before ingestion.
        console.log('Cleaning up document metadata...');
        for (const chunk of chunks) {
            chunk.metadata = {
                source: chunk.metadata.source,
                page: chunk.metadata.loc?.pageNumber ?? 1,
            };
        }
        // --- END OF FIX ---

        const client = new ChromaClient();

        try {
            console.log('Attempting to delete old collection if it exists...');
            await client.deleteCollection({ name: CHROMA_COLLECTION });
            console.log('Old collection deleted.');
        } catch (error) {
            if (error.name === 'ChromaNotFoundError') {
                console.log('No old collection to delete, proceeding...');
            } else {
                throw error;
            }
        }

        console.log('Ingesting chunks into ChromaDB... (This may take a moment)');
        await Chroma.fromDocuments(
            chunks, 
            new LocalEmbeddings(),
            {
                collectionName: CHROMA_COLLECTION,
                url: process.env.CHROMA_URL || 'http://localhost:8000',
            }
        );

        console.log('✅ Ingestion complete!');
    } catch (error) {
        console.error('❌ Error during ingestion:', error);
    }
};

run();