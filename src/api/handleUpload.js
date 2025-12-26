import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();
const myQueue = new Queue('file-upload-queue', {
    connection: process.env.REDIS_URL,
});
export async function handleUpload(req, res) {
    try {
        const file = req.file
        // console.log("File received:", file);
        if(file){
            myQueue.add('process-file', JSON.stringify({
                filename:file.originalname,
                destination:file.destination,
                path:file.path,
            }))
        }

        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data:{}
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}