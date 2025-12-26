import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { vectorStore as getVectorStore } from "./vector-store.js";
import fs from 'fs';

export async function upload(req, res) {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Processing file:", file.path);

    // Process immediately instead of queuing
    try {
      // 1. Load PDF
      const loader = new PDFLoader(file.path);
      const docs = await loader.load();
      console.log("Loaded documents:", docs.length);

      // 2. Get vector store
      const vectorStore = await getVectorStore();

      // 3. Add documents
      await vectorStore.addDocuments(docs);
      console.log("Documents added to vector store");

      // 4. Clean up the file after processing
      fs.unlinkSync(file.path);

      res.status(200).json({
        success: true,
        message: "File uploaded and processed successfully",
        data: { filename: file.originalname, chunks: docs.length }
      });
    } catch (processingError) {
      console.error("Processing error:", processingError);
      
      // Clean up file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      
      res.status(500).json({
        success: false,
        message: "Error processing file",
        error: processingError.message
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
}