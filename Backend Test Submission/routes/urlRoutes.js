const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

router.post("/shorturls", async (req,res) => {
    const {url, validity = 30, shortcode } = req.body;

    if(!url) return res.status(400).json({error: "Url is required"});

    const code = shortcode || uuidv4().slice(0,6);

    try {
        const expiresAt = moment().add(validity, "minutes").toDate();

        const newUrl = new Url({
            originalUrl: url,
            shortcode: code,
            expiresAt,
        });

        await newUrl.save();

        res.status(201).json({
            shortlink: `https://hostname:port/${code}`,
            expiry: expiresAt.toISOString()
        });
    } catch (err) {
        res.status(500).json({error: "Something went wrong"});
    }
});

router.get("/:shortcode", async(req,res) => {
    const{shortcode} = req.params;

    const urlData = await Url.findOne({shortcode});

    if(!urlData) return res.status(404).json({error:"Not Found"});

    if(new Date() > new Date(urlData.expiresAt)){
        return res.status(410).json({error: "Link expired"});
    }

    urlData.clicks.push({
        timestamp: new Date(),
        referrer: req.get("Referrer") || "direct",
        location: req.ip,
    });

    await urlData.save();
    res.redirect(urlData.originalUrl);
});

router.get("/shorturls/:shortcode", async(req, res) => {
    const {shortcode} = req.params;

    const urlData = await Url.findOne({shortcode});

    if(!urlData) return res.status(404).json({error:"Not Found"});

    res.json({
        originalUrl: urlData.originalUrl,
        createdAt: urlData.createdAt,
        expiresAt: urlData.expiresAt,
        totalClicks: urlData.clicks.length,
        clickData: urlData.clicks,
    });
});

module.exports = router;