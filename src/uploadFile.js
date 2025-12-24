import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, 'src/uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename
    }
});
const upload = multer({ 
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // 10 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDF files are allowed."), false);
        }
    }
 });


export { upload };
