import { QdrantVectorStore } from "@langchain/qdrant";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import  dotenv from "dotenv";
dotenv.config();
export const vectorStore = async()=>{
     try {
        const embeddings = new HuggingFaceInferenceEmbeddings({
      model: "sentence-transformers/all-mpnet-base-v2",
      apiKey: process.env.SECRET_KEY,
    });
    console.log("Embeddings initialized");
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "pdf-docs",
      });
      console.log("Vector store initialized");
      return vectorStore;
    } catch (err) {
      console.error("Error initializing vector store:", err);
      return;
    }
}