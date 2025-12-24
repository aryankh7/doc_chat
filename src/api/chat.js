import { vectorStore } from "../vector-store.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

export const chat = async (req, res) => {
  try {
    const {query} = req.body;
    const store = await vectorStore();
    const retriever = store.asRetriever({
      k: 2,
    });
    const result = await retriever.invoke(query);
    const context = result.map((doc) => doc.pageContent).join("\n");
    console.log("Retrieved Context:", context);

    const systemPrompt = `You are a helpful assistant. ONLY answer based on the context provided below.
        If the answer is not in the context, say "I could not find the answer in the document."
    Context:${JSON.stringify(result)} Question:${query}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
    });
    res.json({
      message: response.text,
      sources: result.map((doc) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
      })), // e.g., { pageNumber: 3 }
    });
  } catch (error) {
    res.json({ message: "server error", error: error.message });
  }
};
