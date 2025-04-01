const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    contact: { type: String, required: true },
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Company = mongoose.model("Company", companySchema);
module.exports = Company;
