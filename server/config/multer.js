import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public")
    }, filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        cb(null, filename)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }  //5 mb limits
})

export default upload;