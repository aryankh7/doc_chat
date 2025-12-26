import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

// Parse Redis URL for BullMQ
const redisConnection = process.env.REDIS_URL 
  ? { 
      url: process.env.REDIS_URL,
      maxRetriesPerRequest: null
    }
  : {
      host: '127.0.0.1',
      port: 6379,
      maxRetriesPerRequest: null
    };

const myQueue = new Queue('file-upload-queue', {
  connection: redisConnection,
});

export async function handleUpload(req, res) {
  try {
    const file = req.file;
    
    if (file) {
      await myQueue.add('process-file', JSON.stringify({
        filename: file.originalname,
        destination: file.destination,
        path: file.path,
      }));
      
      console.log('Job added to queue:', file.originalname);
    }

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: {}
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message 
    });
  }
}