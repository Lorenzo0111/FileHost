const { Router } = require('express');
const multer = require('multer');
const path = require('path');

const router = Router();
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
       cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({
     storage: storage,
     dest: 'uploads/',
     limits: {
         fileSize: 5000000
     }
});

router.post("/upload", upload.single("file"), (req,res) => {
    if (!req.file) {
        res.status(400).send("No file uploaded");
        return;
    }

    res.send(req.protocol + '://' + req.get('host') + "/api/download?file=" + req.file.filename);
});

router.get("/download", (req,res) => {
    if (!req.query.file) {
        return res.status(400).send("No file specified");
    }

    res.download(`uploads/${encodeURIComponent(req.query.file)}`);
});

module.exports = router;