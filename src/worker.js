import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { vectorStore as getVectorStore } from "./vector-store.js";

dotenv.config();

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("job Data", job.data);
    const data = JSON.parse(job.data);
    console.log(`Processing file: ${data.path}`);

    // 1. Load PDF
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();
    console.log("Loaded documents");

    // 2. Split into chunks
    // const splitter = new CharacterTextSplitter({
    //   chunkSize: 500,
    //   chunkOverlap: 50,
    // });
    // const splitDocs = await splitter.splitDocuments(docs);
    // console.log("Split into chunks:", splitDocs.length);

    // 3. Create embedding instance
    

    // 4. Connect to vector DB
    
    const vectorStore = await getVectorStore()

    // 5. Add documents
    try {
      await vectorStore.addDocuments(docs);
      console.log("Documents added to vector store");
    } catch (err) {
      console.error("Error adding documents to vector store:", err);
    }
  },
  {
    concurrency: 100,
    connection: process.env.REDIS_URL
  }
);
