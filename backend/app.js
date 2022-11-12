const express = require('express');
const app = express();
const port = 3000;

const scraper = require('./routes/scraper.router');


app.use('/scraper', scraper);

var server = app.listen(3000, function() {
    console.log('Listening on port ' + port);
});