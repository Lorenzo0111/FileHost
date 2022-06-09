const { Router } = require('express');
const Page = require("../models/Page");
const router = Router();

router.get("/list", async (req,res) => {
    if (!checkHeader(req,res)) return;

    const pages = await Page.find().exec();

    const pageList = pages.map(page => {
        return page.title;
    });

    res.json(pageList);
});

router.get("/get", async (req,res) => {
    if (!checkHeader(req,res)) return;

    const {title} = req.query;

    if (!title) {
        res.json({
            error: "No title provided"
        });
        return;
    }

    const page = await Page.findOne({title: title}).exec();

    res.json(page);
});

router.get("/login", async (req,res) => {
    if (!checkHeader(req,res)) return;

    res.json(true);
});

router.post("/new", async (req,res) => {
    const { title, content, secret } = req.body;

    if (!title || !content || !secret) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    if (secret !== process.env.ADMINSECRET) {
        return res.status(401).json({
            message: "Secret password not valid"
        });
    }

    const previous = await Page.findOne({ title }).exec();
    if (previous) {
        previous = await Page.findOneAndUpdate({ title }, { content }).exec();
        return res.json(previous);
    }

    const page = new Page({
        title,
        content
    });

    await page.save();

    res.json({
        message: "Page created"
    });
});

function checkHeader(req,res) {
    if (!req.headers.authorization) {
        res.status(401).json({
            message: "No authorization header provided"
        });

        return false;
    }

    if (req.headers.authorization !== process.env.SECRET) {
        res.status(401).json({
            message: "Invalid authorization header"
        });

        return false;
    }

    return true;
}

module.exports = router;