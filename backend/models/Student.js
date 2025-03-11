const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema(
    {
        rollcode: { type: String, unique: true, required: true },
        password: { type: String, required: true },
    },
    { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

// Hash the password before saving
studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Student", studentSchema);
