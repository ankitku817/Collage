const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const employeeSchema = new mongoose.Schema(
    {
        empId: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        mobileNo: { type: String },
        name: { type: String },
        fatherName: { type: String },
        course: { type: String },
        experience: { type: String },
        dob: { type: Date },
        email:{type:String},
        profileImage: { type: String },
        department: { type: String },
        designation: { type: String },
        officeLocation: { type: String },
        joiningDate: { type: Date },
        status: { type: String, default: "Active" },
        bio: { type: String },
        socialLinks: {
            linkedin: { type: String },
            twitter: { type: String },
        },
        permissions: [String],
        lastLogin: { type: Date },
        notifications: { type: Boolean, default: true },
        alternateEmail: { type: String },

    },
    { timestamps: true }
);

employeeSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Employee", employeeSchema);
