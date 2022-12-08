// Author(s): Sneh Patel

//Headers: Imports go here
require("./Apartment");
const cheerios = require("cheerio");
const axios = require("axios");
const mongoose = require("mongoose");
const Apartment = mongoose.model("Apartment");
const puppeteer = require("puppeteer");

// Main function
async function main() {
    await mongoose.connect(
        "mongodb+srv://sneh:oQ9sfXWUdfrItMdv@researchproject.hisvha9.mongodb.net/cloud?retryWrites=true&w=majority"
    );
    Apartment.deleteMany({ apartmentName: "Apollo Midtown" })
        .then(function () {
            console.log("Data deleted"); // Success
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
    apartments = await apolloScraper();
    apartments.forEach(async (apartment) => {
        await Apartment.create(apartment);
    });
    console.log(apartments);
}

// Scrape data from Apollo Midtown
async function apolloScraper() {
    // Get the HTML from the Artemis website
    const $ = cheerios.load(await getPage("https://www.apollomidtown.com/models"));

    const apartmentsListings = $(".wrap-model-item.model-list.item");

    let apartment_info = [];

    apartmentsListings.each(function () {
        const apartment = $(this);

        apartmentPrice = apartment.find("div.rent").text();

        apartmentPrice = apartmentPrice.replace(/[^0-9]/g, "");
        if (apartmentPrice == "") {
            return;
        }
        apartmentPrice = parseInt(apartmentPrice);

        let apartmentLink = apartment.find("div.model-image").find("a").attr("href");
        apartmentLink = "https://www.apollomidtown.com/" + apartmentLink;

        let apartmentBedrooms = apartment.find("div.bed").text();
        apartmentBedrooms = apartmentBedrooms.substring(0, 3);

        let apartmentBathrooms = apartment.find("div.bed").text();
        apartmentBathrooms = apartmentBathrooms.substring(6, 13);
        apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ""));

        let apartmentSquareFeet = apartment.find("div.sqft").text();
        apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9]/g, "");
        apartmentSquareFeet = parseInt(apartmentSquareFeet);

        apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, "");
        if (apartmentBedrooms == "") {
            apartmentBedrooms = 1;
        }
        apartmentBedrooms = parseInt(apartmentBedrooms);

        apartment_info.push({
            startingPrice: apartmentPrice,
            numBeds: apartmentBedrooms,
            numBaths: apartmentBathrooms,
            squareFeet: apartmentSquareFeet,
            apartmentName: "Apollo Midtown",
            url: apartmentLink,
        });
    });
    return apartment_info;
}

async function getPage(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const html = await page.content(); // serialized HTML of page DOM.
    await browser.close();
    return html;
}


main().then(() => {
    console.log("Done");
});
setTimeout(() => {  process.exit();; }, 10000);

