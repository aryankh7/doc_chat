import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { vectorStore as getVectorStore } from "./vector-store.js";
import { QdrantClient } from "@qdrant/js-client-rest";

dotenv.config();

// Parse Redis URL for BullMQ
const redisConnection = process.env.REDIS_URL 
  ? { 
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null // Important for BullMQ
    }
  : {
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null
    };

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("job Data", job.data);
    const data = JSON.parse(job.data);
    console.log(`Processing file: ${data.path}`);

    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    console.log("Loaded documents");

    const vectorStore = await getVectorStore();

    try {
      // Initialize Qdrant client to check for existing embeddings
      const qdrantClient = new QdrantClient({
        url: process.env.QDRANT_URL,
        apiKey: process.env.QDRANT_API_KEY,
      });

      const collectionName = "pdf-docs";
      
      // Check if collection exists and has points with this filename
      try {
        const scrollResult = await qdrantClient.scroll(collectionName, {
          filter: {
            must: [
              {
                key: "metadata.source",
                match: {
                  value: data.path
                }
              }
            ]
          },
          limit: 100,
          with_payload: true,
          with_vector: false
        });

        // If points exist, delete them
        if (scrollResult.points && scrollResult.points.length > 0) {
          console.log(`Found ${scrollResult.points.length} existing embeddings for file: ${data.filename}`);
          
          await qdrantClient.delete(collectionName, {
            filter: {
              must: [
                {
                  key: "metadata.source",
                  match: {
                    value: data.path
                  }
                }
              ]
            }
          });
          
          console.log(`Deleted existing embeddings for file: ${data.filename}`);
        } else {
          console.log(`No existing embeddings found for file: ${data.filename}`);
        }
      } catch (checkErr) {
        console.log("Error checking for existing embeddings (collection may not exist yet):", checkErr.message);
      }

      // Add new documents to vector store
      await vectorStore.addDocuments(docs);
      console.log("Documents added to vector store");
    } catch (err) {
      console.error("Error adding documents to vector store:", err);
      throw err;
    }
  },
  {
    concurrency: 100,
    connection: redisConnection
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

console.log('Worker started and waiting for jobs...');