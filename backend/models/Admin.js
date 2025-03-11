const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
        },
        password: { type: String, required: true },
        collegeName: { type: String, required: true },
        uniqueCode: {
            type: String,
            unique: true,
            required: true,
            match: [/^\d{10}$/, "Unique code must be exactly 10 digits"],
            default: () => Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        },
        profileImage: { type: String, default: "default.jpg" }, // Store image URL or path
        dateOfBirth: { type: Date, default: null },
        joiningDate: { type: Date, default: null },
    },
    { timestamps: true } // Auto-add `createdAt` and `updatedAt`
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
