const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema({
    percentage: { type: Number, default: 60 },
    passOutYear: { type: Number, default: 2025 },
    branch: { type: String, default: "B.Tech CSE" }
}, { _id: false }); // Prevents generating an ID for this subdocument

const roundSchema = new mongoose.Schema({
    roundName: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    jobDescription: { type: String, required: true },
    eligibilityCriteria: { type: eligibilitySchema, required: true },
    rounds: { type: [roundSchema], required: true },
    companyImage: { type: String, required: true },
    companyPdf: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
