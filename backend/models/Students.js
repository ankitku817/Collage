const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
    {
        rollcode: { type: String, required: true, unique: true, minlength: 7, maxlength: 7 },
        password: { type: String, required: true },

        mobileNo: { type: String },
        name: { type: String },
        fathersname: { type: String },
        collageRollNo: { type: String, unique: true },
        collegeName: { type: String, default: "Amritsar Group Of Colleges, Amritsar, Punjab" },
        course: { type: String },
        department: { type: String },
        dateOfBirth: { type: Date },
        Gender: { type: String, enum: ["Male", "Female", "Other"] },
        countryCode: { type: String, default: "+91" },
        emailId: { type: String, unique: true },
        country: { type: String },
        state: { type: String },
        headline: { type: String },
        semester: { type: String },
        batchYear: { type: String },
        passoutYear:{type:String},
        skills: { type: [String] },
        city: { type: String },
        placement: { type: String, enum: ["yes", "no"], default: "yes" },
        profileImage: { type: String, default: "/uploads/default.png" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Students", StudentSchema);
