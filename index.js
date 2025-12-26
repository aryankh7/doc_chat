import express from 'express';
import cors from 'cors';
import { upload } from './src/uploadFile.js';
import { handleUpload } from './src/api/handleUpload.js';
import {chat} from "./src/api/chat.js"
const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = "https://chatpdf-chatpdf.up.railway.app";

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use(cors({
  origin: ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});
app.post('/upload', upload.single("file"), handleUpload);

app.post('/chat', chat)
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
