const { Router } = require('express');
const Page = require("../models/Page");
const router = Router();

router.get("/list", async (req,res) => {
    const pages = await Page.find().exec();

    const pageList = pages.map(page => {
        return page.title;
    });

    res.json(pageList);
});

router.get("/get", async (req,res) => {
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

router.post("/new", async (req,res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
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

module.exports = router;