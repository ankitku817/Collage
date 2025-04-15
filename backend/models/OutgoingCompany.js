// models/OutgoingCompany.js
const mongoose = require("mongoose");

const outgoingCompanySchema = new mongoose.Schema({
    name: String,
    industry: String,
    contact: String,
    arrivalDate: Date,
    departureDate: Date,
    jobDescription: String,
    location: String,
    eligibilityCriteria: Object,
    rounds: Array,
    companyImage: String,
    companyPdf: String,
}, { timestamps: true });

module.exports = mongoose.model("OutgoingCompany", outgoingCompanySchema);
