// Author(s): Sneh Patel

const express = require("express");
const router = express.Router();

const scraper_controller = require("../controllers/scraperController");

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

// define the home page route
router.get("/", (req, res) => {
    res.send("Scraper home");
});

// define the about route
router.get("/runScraper", scraper_controller.scrape);

// define the about route
router.get("/getApartments", scraper_controller.getApartments);

module.exports = router;
