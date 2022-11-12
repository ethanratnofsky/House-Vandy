const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
//const Article = require('./models').Article;

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.get('/', (req, res) => {
  res.send('Scraper home')
})

// define the about route
router.get('/runScraper', (req, res) => {
  //Here we will use a switch statement to determine which scraper to run
      // Access the provided 'apartmentName' query parameters
      let apartmentName = req.query.apartmentName;
  res.send(apartmentName + ' scraper is running')
})

module.exports = router