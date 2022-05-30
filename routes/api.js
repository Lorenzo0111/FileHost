const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
const SECRET = process.env.SECRET || 'secret';

router.post("/upload", upload.single("file"), (req,res) => {
    if (!req.file) {
        res.status(400).send("No file uploaded");
        return;
    }

    res.send(req.protocol + '://' + req.get('host') + "/api/download?file=" + req.file.filename);
});

router.post("/paste", (req,res) => {
    const { name, text, secret } = req.body;

    if (!name || !text || !secret) {
        res.status(400).send("No text or name or secret uploaded");
        return;
    }

    if (!(secret === SECRET)) {
        res.status(401).send("Wrong secret");
        return;
    }

    const fileName = encodeURIComponent(name.replace(" " , "-") + ".md");

    fs.writeFileSync("uploads/" + fileName, text);

    res.send(req.protocol + '://' + req.get('host') + "/#" + fileName);
});

router.get("/download", (req,res) => {
    if (!req.query.file) {
        return res.status(400).send("No file specified");
    }

    res.download(`uploads/${encodeURIComponent(req.query.file)}`);
});

router.get("/paste", (req,res) => {
    if (!req.query.name) {
        return res.status(400).send("No name specified");
    }

    let name = encodeURIComponent(req.query.name.replace(" ","-"));
    if (!name.endsWith(".md")) {
        name += ".md";
    }

    if (!fs.existsSync(`uploads/${name}`)) {
        return res.status(404).send("File not found");
    }

    res.sendFile(path.join(__dirname, `../uploads/${name}`));
});

module.exports = router;