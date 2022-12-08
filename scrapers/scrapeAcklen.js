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
    Apartment.deleteMany({ apartmentName: "Acklen West End" })
        .then(function () {
            console.log("Data deleted"); // Success
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
    apartments = await acklenScraper();
    apartments.forEach(async (apartment) => {
        Apartment.create(apartment);
    });
    console.log(apartments);
}

// Scrape data from Acklen West End
async function acklenScraper() {
    // Get the HTML from the Artemis website
    const $ = cheerios.load(
        await getPage(
            "https://www.maac.com/available-apartments/?propertyId=662122&Bedroom=undefined%20Bed"
        )
    );

    const apartmentsListings = $(".apartment.apartment--no-layout.loaded");

    let apartment_info = [];

    apartmentsListings.each(function () {
        const apartment = $(this);
        apartmentPrice = apartment.find("div.apartment__price").text();
        apartmentPrice = apartmentPrice.replace(/[^0-9]/g, "");
        if (apartmentPrice == "") {
            return;
        }
        apartmentPrice = parseInt(apartmentPrice);

        let apartmentLink = apartment
            .find("div.apartment__ctas")
            .find("div.apartment__ctas-content")
            .find("div.apartment__applyFix")
            .find("a")
            .attr("href");

        let apartmentBedrooms = apartment
            .find("div.p1.apartment__unit-description-text")
            .first()
            .text();
        let apartmentBathrooms = apartment
            .find("div.p1.apartment__unit-description-text:nth-child(2)")
            .text();
        apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ""));

        let apartmentSquareFeet = apartment
            .find("div.p1.apartment__unit-description-text:nth-child(3)")
            .text();
        apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9.]/g, "");

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
            apartmentName: "Acklen West End",
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
setTimeout(() => {  process.exit();; }, 15000);
