// Author(s): Sneh Patel

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const scraper = require("./routes/scraper.router");

app.use(cors());

app.use("/scraper", scraper);

app.listen(3000, () => {
    console.log("Listening on port " + port);
});
