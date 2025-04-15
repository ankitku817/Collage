const express = require("express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Students = require("../models/Students");
const verifyStudent = require("../middleware/verifyStudent");
const Company = require("../models/Company");
const Application =require( "../models/Application");
const OutgoingCompany = require("../models/OutgoingCompany");
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, uploadDir),
//     filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images and PDF files are allowed!"), false);
        }
    }
});

router.put("/update-profile", verifyStudent, async (req, res) => {
    try {
        const { skills, headline } = req.body;

        const student = await Students.findById(req.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }
        student.skills = skills;
        student.headline = headline || "";

        await student.save();

        res.status(200).json({ message: "Profile updated successfully!", student });
    } catch (error) {
        console.error("Profile update error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});
router.post("/login-student", async (req, res) => {
    try {
        const { rollcode, password } = req.body;
        if (!rollcode || rollcode.length !== 7) {
            return res.status(400).json({ message: "Invalid roll code! It must be exactly 7 characters long." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required!" });
        }
        const student = await Students.findOne({ rollcode: String(rollcode) });
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }
        const token = jwt.sign(
            { id: student._id, rollcode: student.rollcode },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({ message: "Login successful!", token, student: { rollcode: student.rollcode } });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/change-password", verifyStudent, async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match!" });
        }        const student = await Students.findById(req.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }
        const isMatch = await bcrypt.compare(oldPassword, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        student.password = hashedPassword;
        await student.save();

        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/students-profile", verifyStudent, async (req, res) => {
    try {
        const student = await Students.findById(req.studentId).select("-password");

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Profile fetch error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});
router.get("/students", verifyStudent, async (req, res) => {
    try {
        // Get the logged-in student
        const currentStudent = await Students.findById(req.studentId);

        if (!currentStudent) {
            return res.status(404).json({ message: "Student not found!" });
        }
        const students = await Students.find({
            batchYear: currentStudent.batchYear,
            department: currentStudent.department,
            _id: { $ne: currentStudent._id }, 
        }).select("-password");

        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/apply", verifyStudent, upload.single("resume"), async (req, res) => {
    try {
        const {
            companyId,
            name,
            email,
            phone,
            univercityRollNo,
            collegeRollNo,
            dob,
            banch,
            passingYear,
            tenthScore,
            twelfthScore,
            graduationScore,
            pgScore,
            about,
        } = req.body;

        const resumePath = req.file ? req.file.path : null;

        if (!resumePath) {
            return res.status(400).json({ message: "Resume file is required" });
        }
        const currentStudent = await Students.findById(req.studentId);

        const newApplication = new Application({
            studentId:currentStudent, 
            companyId,
            name,
            email,
            phone,
            resume: resumePath,
            univercityRollNo,
            collegeRollNo,
            dob,
            banch,
            passingYear,
            tenthScore,
            twelfthScore,
            graduationScore,
            pgScore,
            about,
        });

        await newApplication.save();

        return res.status(200).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error("Apply Error:", error);
        return res.status(500).json({ message: "Server error while applying" });
    }
});

router.get("/companies", verifyStudent, async (req, res) => {
    try {
        const now = new Date();
        const expiredCompanies = await Company.find({
            $or: [
                { arrivalDate: { $lt: now } },
                { departureDate: { $lt: now } },
            ],
        });

        for (let company of expiredCompanies) {
            const outgoing = new OutgoingCompany(company.toObject());
            await outgoing.save();
            await Company.findByIdAndDelete(company._id);
        }
        const companies = await Company.find().sort({ arrivalDate: 1 });
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Server error!" });
    }
});



module.exports = router;