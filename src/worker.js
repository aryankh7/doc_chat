import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { vectorStore as getVectorStore } from "./vector-store.js";

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
      await vectorStore.addDocuments(docs);
      console.log("Documents added to vector store");
    } catch (err) {
      console.error("Error adding documents to vector store:", err);
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