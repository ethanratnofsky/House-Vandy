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
    Apartment.deleteMany({ apartmentName: "Elliston 23" })
        .then(function () {
            console.log("Data deleted"); // Success
        })
        .catch(function (error) {
            console.log(error); // Failure
        });
    apartments = await ellistonScraper();
    apartments.forEach(async (apartment) => {
        await Apartment.create(apartment);
    });
    console.log(apartments);
}

// Scrape data from Elliston
async function ellistonScraper() {
    // Get the HTML from the Artemis website
    const response = await axios.get("https://www.elliston23apts.com/floorplans", {
        headers: { "Accept-Encoding": "application/json" },
    });

    const $ = cheerios.load(response.data);

    const apartmentsListings = $(".pb-4.mb-2.col-12.col-sm-6.col-lg-4.fp-container");

    let apartment_info = [];

    apartmentsListings.each(function () {
        const apartment = $(this);
        apartmentPrice = apartment
            .find("div.card.text-center.h-100")
            .find("div.card-body")
            .find("p.font-weight-bold.mb-1.text-md")
            .text();
        apartmentPrice = apartmentPrice.replace(/[^0-9]/g, "");
        if (apartmentPrice == "") {
            return;
        }
        apartmentPrice = parseInt(apartmentPrice);
        let apartmentLink = apartment
            .find("h2.card-title.h4.font-weight-bold.text-capitalize")
            .text();
        apartmentLink = apartmentLink.replace(/\s/g, "");
        apartmentLink = apartmentLink.toLowerCase();
        apartmentLink = "https://www.elliston23apts.com/floorplans/" + apartmentLink;

        let apartmentBedrooms = apartment
            .find("div.card.text-center.h-100")
            .find("div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0")
            .find("ul")
            .find("li.list-inline-item.mr-2")
            .first()
            .text();
        let apartmentBathrooms = apartment
            .find("div.card.text-center.h-100")
            .find("div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0")
            .find("ul")
            .find("li.list-inline-item.mr-2:nth-child(2)")
            .text();
        apartmentBathrooms = parseInt(apartmentBathrooms.replace(/[^0-9.]/g, ""));

        let apartmentSquareFeet = apartment
            .find("div.card.text-center.h-100")
            .find("div.card-header.bg-transparent.border-bottom-0.pt-4.pb-0")
            .find("ul")
            .find("li.list-inline-item:nth-child(3)")
            .text();
        apartmentSquareFeet = apartmentSquareFeet.replace(/[^0-9.]/g, "");
        if (apartmentSquareFeet.length >= 5) {
            apartmentSquareFeet = apartmentSquareFeet.substring(0, 4);
        }
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
            apartmentName: "Elliston 23",
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