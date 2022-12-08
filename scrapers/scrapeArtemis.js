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
    Apartment.deleteMany({ apartmentName: "Artemis Midtown" })
        .then(function () {
            console.log("Data deleted"); // Success
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
    apartments = await artemisScraper();
    apartments.forEach(async (apartment) => {
        await Apartment.create(apartment);
    });
    console.log(apartments);
}

// Scrape data from Artemis Midtown
async function artemisScraper() {
    // Get the HTML from the Artemis website
    const response = await axios.get(
        "https://www.artemismidtown.com/nashville/artemis-midtown/conventional/",
        { headers: { "Accept-Encoding": "application/json" } }
    );

    const $ = cheerios.load(response.data);

    const apartmentsListings = $(".fp-row.col-6");

    let apartment_info = [];

    apartmentsListings.each(function () {
        const apartment = $(this);
        let apartmentLink = apartment.find("h4").find("a").attr("href");

        let apartmentPrice = apartment.find("div.fp-col.rent").find("div.fp-col-text").text();
        let apartmentBedrooms = apartment
            .find("div.fp-col.bed-bath")
            .find("span.fp-col-text")
            .text();
        let apartmentBathrooms = parseInt(apartmentBedrooms.substring(2).replace(/[^0-9.]/g, ""));
        let apartmentSquareFeet = apartment
            .find("div.fp-col.sq-feet")
            .find("span.fp-col-text")
            .text();
        apartmentSquareFeet = parseInt(apartmentSquareFeet.replace(/[^0-9.]/g, ""));
        apartmentBedrooms = apartmentBedrooms.replace(/[^0-9.]/g, "");
        if (apartmentBedrooms == "") {
            apartmentBedrooms = 1;
        }

        apartmentBedrooms = parseInt(apartmentBedrooms.substring(0, 1).replace(/[^0-9.]/g, ""));
        apartmentPrice = parseInt(apartmentPrice.replace(/[^0-9]/g, ""));

        apartment_info.push({
            startingPrice: apartmentPrice,
            numBeds: apartmentBedrooms,
            numBaths: apartmentBathrooms,
            squareFeet: apartmentSquareFeet,
            apartmentName: "Artemis Midtown",
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

setTimeout(() => {  process.exit();; }, 7000);


