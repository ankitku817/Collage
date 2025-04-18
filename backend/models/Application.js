const mongoose = require("mongoose");
const ApplicationSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    name: String,
    email: String,
    phone: String,
    resume: String,
    univercityRollNo: String,
    collegeRollNo: String,
    dob: Date,
    banch: String,
    passingYear: String,
    tenthScore: String,
    twelfthScore: String,
    graduationScore: String,
    pgScore: String,
    about: String,
}, { timestamps: true });

const Application = mongoose.model("Application", ApplicationSchema);
module.exports = Application;
