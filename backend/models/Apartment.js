// Author(s): Sneh Patel

// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
    squareFeet: {
        type: Number,
        required: true,
    },
    numBeds: {
        type: Number,
        required: true,
    },
    numBaths: {
        type: Number,
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
    },
    apartmentName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

module.export = mongoose.model("Apartment", apartmentSchema);
