const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    rollcode: { type: String, required: true, unique: true, minlength: 7, maxlength: 7 },
    password: { type: String, required: true },
    mobileNo: { type: String, required: true, minlength: 10, maxlength: 10 },
}, { timestamps: true });

module.exports = mongoose.model("Students", StudentSchema);
