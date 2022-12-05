//Headers: Imports go here 
require('../models/Apartment');
const cheerios = require('cheerio');
const axios = require('axios');
const request = require('request');
const mongoose = require('mongoose');
const { get } = require('request');
const Apartment = mongoose.model('Apartment')
const puppeteer = require('puppeteer');



// Scrape data from one of our six sites
exports.scrape = (req, res) => {
  
  let apartmentName = req.query.apartmentName;
  const scrapedApartments = runScraping(apartmentName);

  scrapedApartments.then(function(result) {
    console.log(result) //Some apartment listings
 })
  res.send(apartmentName + ' scraper is running')
};

// Get data to send to front end
exports.getApartments = (req, res) => {
  mongoose.connect('mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority').then(() => {
    let apartmentsToReturn = [];
    Apartment.find().then(apartments => {
      apartments.forEach(apartment => {
        apartmentsToReturn.push({
          apartmentName: apartment.apartmentName,
          squareFeet: apartment.squareFeet,
          numBaths: apartment.numBaths, 
          numBeds: apartment.numBeds,
          startingPrice: apartment.startingPrice
        })
        });
      res.send(apartmentsToReturn);
    });
  }).catch(() => {
    console.log('Connection failed!');
  });
};

// Determine Scraper to Run
async function runScraping(apartmentName) {
  // Here we will use a switch statement to determine which scraper to run
  let apartments;
  switch (apartmentName) {
    case 'Artemis':
      await mongoose.connect('mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority');
      Apartment.deleteMany({ apartmentName : "Artemis Midtown" }).then(function(){
          console.log("Data deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
      apartments = await artemisScraper();      
      apartments.forEach(async (apartment) => { 
        await Apartment.create(apartment);
      });
      return apartments
    case 'Apollo':
      await mongoose.connect('mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority');
      Apartment.deleteMany({ apartmentName : "Apollo Midtown" }).then(function(){
          console.log("Data deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
      apartments = await apolloScraper();      
      apartments.forEach(async (apartment) => { 
        console.log(await Apartment.create(apartment));
      });
      return apartments
    case 'Elliston':
      await mongoose.connect('mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority');
      Apartment.deleteMany({ apartmentName : "Elliston 23" }).then(function(){
          console.log("Data deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
      apartments = await ellistonScraper();      
      apartments.forEach(async (apartment) => { 
        console.log(await Apartment.create(apartment));
      });
      return apartments
    case 'Acklen':
      await mongoose.connect('mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority');
      Apartment.deleteMany({ apartmentName : "Acklen West End" }).then(function(){
          console.log("Data deleted"); // Success
      }).catch(function(error){
          console.log(error); // Failure
      });
      apartments = await acklenScraper();      
      apartments.forEach(async (apartment) => { 
        console.log(await Apartment.create(apartment));
      });
      return apartments
    default:
      console.log("Invalid apartment name");
  }
}

// Scrape data from Artemis Midtown
async function artemisScraper() {
  // Get the HTML from the Artemis website 
  const response = await axios.get('https://www.artemismidtown.com/nashville/artemis-midtown/conventional/', {headers: {'Accept-Encoding': 'application/json'}});

  const $ = cheerios.load(response.data);

  const apartmentsListings = $(".fp-row.col-6");

  let apartment_info = [];
  
  apartmentsListings.each(function () {
    const apartment = $(this);
    let apartmentLink = apartment.find('h4').find('a').attr('href');

    let apartmentPrice = apartment.find('div.fp-col.rent').find('div.fp-col-text').text();
    let apartmentBedrooms = apartment.find('div.fp-col.bed-bath').find('span.fp-col-text').text();
    let apartmentBathrooms = parseInt(apartmentBedrooms.substring(2).replace(/[^0-9.]/g, ''));
    let apartmentSquareFeet = apartment.find('div.fp-col.sq-feet').find('span.fp-col-text').text();
    apartmentSquareFeet = parseInt(apartmentSquareFeet.replace(/[^0-9.]/g, ''));
    apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, '');
    if (apartmentBedrooms == '') {
      apartmentBedrooms = 1;
    }

    apartmentBedrooms = parseInt(apartmentBedrooms.substring(0, 1).replace(/[^0-9.]/g, ''));
    apartmentPrice = parseInt(apartmentPrice.replace(/[^0-9]/g, ''));

    apartment_info.push({
      'startingPrice': apartmentPrice,
      'numBeds': apartmentBedrooms,
      'numBaths': apartmentBathrooms,
      'squareFeet': apartmentSquareFeet,
      'apartmentName': 'Artemis Midtown',
      'url': apartmentLink
    });
  });
  return apartment_info;
};

async function acklenScraper() {
  // Get the HTML from the Artemis website 
  const $ = cheerios.load(await getPage('https://www.maac.com/available-apartments/?propertyId=662122&Bedroom=undefined%20Bed'));

  const apartmentsListings = $(".apartment.apartment--no-layout.loaded");

  let apartment_info = [];
  
  apartmentsListings.each(function () {
    const apartment = $(this);
    apartmentPrice = apartment.find('div.apartment__price').text();
    apartmentPrice = apartmentPrice.replace(/[^0-9]/g, '');
    if (apartmentPrice == '') {
      return;
    }
    apartmentPrice = parseInt(apartmentPrice);
    
    let apartmentLink = apartment.find('div.apartment__ctas').find('div.apartment__ctas-content').find('div.apartment__applyFix').find('a').attr('href');

    let apartmentBedrooms = apartment.find('div.p1.apartment__unit-description-text').first().text();
    let apartmentBathrooms = apartment.find('div.p1.apartment__unit-description-text:nth-child(2)').text();
    apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ''));

    let apartmentSquareFeet = apartment.find('div.p1.apartment__unit-description-text:nth-child(3)').text();
    apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9.]/g, '')

    apartmentSquareFeet = parseInt(apartmentSquareFeet);

    apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, '');
    if (apartmentBedrooms == '') {
      apartmentBedrooms = 1;
    }
    apartmentBedrooms = parseInt(apartmentBedrooms);

    apartment_info.push({
      'startingPrice': apartmentPrice,
      'numBeds': apartmentBedrooms,
      'numBaths': apartmentBathrooms,
      'squareFeet': apartmentSquareFeet,
      'apartmentName': 'Acklen West End',
      'url': apartmentLink
    });
  });
  return apartment_info;
};

async function ellistonScraper() {
  // Get the HTML from the Artemis website 
  const response = await axios.get('https://www.elliston23apts.com/floorplans', {headers: {'Accept-Encoding': 'application/json'}});

  const $ = cheerios.load(response.data);

  const apartmentsListings = $(".pb-4.mb-2.col-12.col-sm-6.col-lg-4.fp-container");

  let apartment_info = [];
  
  apartmentsListings.each(function () {
    const apartment = $(this);
    apartmentPrice = apartment.find('div.card.text-center.h-100').find('div.card-body').find('p.font-weight-bold.mb-1.text-md').text();
    apartmentPrice = apartmentPrice.replace(/[^0-9]/g, '');
    if (apartmentPrice == '') {
      return;
    }
    apartmentPrice = parseInt(apartmentPrice);
    let apartmentLink = apartment.find('h2.card-title.h4.font-weight-bold.text-capitalize').text();
    apartmentLink = apartmentLink.replace(/\s/g, '');
    apartmentLink = apartmentLink.toLowerCase();
    apartmentLink = "https://www.elliston23apts.com/floorplans/" + apartmentLink;

    let apartmentBedrooms = apartment.find('div.card.text-center.h-100').find('div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0').find('ul').find('li.list-inline-item.mr-2').first().text();
    let apartmentBathrooms = apartment.find('div.card.text-center.h-100').find('div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0').find('ul').find('li.list-inline-item.mr-2:nth-child(2)').text();
    apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ''));

    let apartmentSquareFeet = apartment.find('div.card.text-center.h-100').find('div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0').find('ul').find('li.list-inline-item:nth-child(3)').text();
    apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9.]/g, '')
    if (apartmentSquareFeet.length >= 5) {
      apartmentSquareFeet = apartmentSquareFeet.substring(0, 4);
    }
    apartmentSquareFeet = parseInt(apartmentSquareFeet);


    apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, '');
    if (apartmentBedrooms == '') {
      apartmentBedrooms = 1;
    }
    apartmentBedrooms = parseInt(apartmentBedrooms);

    apartment_info.push({
      'startingPrice': apartmentPrice,
      'numBeds': apartmentBedrooms,
      'numBaths': apartmentBathrooms,
      'squareFeet': apartmentSquareFeet,
      'apartmentName': 'Elliston 23',
      'url': apartmentLink
    });
  });
  return apartment_info;
};

async function apolloScraper() {
  // Get the HTML from the Artemis website 
  const $ = cheerios.load(await getPage('https://www.apollomidtown.com/models'));

  const apartmentsListings = $(".wrap-model-item.model-list.item");

  let apartment_info = [];

  apartmentsListings.each(function () {
    const apartment = $(this);

    apartmentPrice = apartment.find('div.rent').text();

    apartmentPrice = apartmentPrice.replace(/[^0-9]/g, '');
    if (apartmentPrice == '') {
      return;
    }
    apartmentPrice = parseInt(apartmentPrice);
    
    let apartmentLink = apartment.find('div.model-image').find('a').attr('href');
    apartmentLink = 'https://www.apollomidtown.com/' + apartmentLink;

    let apartmentBedrooms = apartment.find('div.bed').text();
    apartmentBedrooms = apartmentBedrooms.substring(0, 3);

    let apartmentBathrooms = apartment.find('div.bed').text();
    apartmentBathrooms = apartmentBathrooms.substring(6, 13);
    apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ''));
  
    let apartmentSquareFeet = apartment.find('div.sqft').text();
    apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9]/g, '')
    apartmentSquareFeet = parseInt(apartmentSquareFeet);

    apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, '');
    if (apartmentBedrooms == '') {
      apartmentBedrooms = 1;
    }
    apartmentBedrooms = parseInt(apartmentBedrooms);

    apartment_info.push({
      'startingPrice': apartmentPrice,
      'numBeds': apartmentBedrooms,
      'numBaths': apartmentBathrooms,
      'squareFeet': apartmentSquareFeet,
      'apartmentName': 'Apollo Midtown',
      'url': apartmentLink
    });
  });
  return apartment_info;
};


async function getPage(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle0'});

  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();
  return html;
}