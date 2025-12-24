import { Queue } from 'bullmq';

const myQueue = new Queue('file-upload-queue', {
    connection: {
        host: 'localhost', // Redis server host
        port: 6379, // Redis server port
    },
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