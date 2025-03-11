const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Students = require("../models/Students");
const verifyStudent = require("../middleware/verifyStudent");

const router = express.Router();

// Ensure Upload Directory Exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Student Login Route
router.post("/login-student", async (req, res) => {
    try {
        const { rollcode, password } = req.body;

        // Validate input
        if (!rollcode || rollcode.length !== 7) {
            return res.status(400).json({ message: "Invalid roll code! It must be exactly 7 characters long." });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required!" });
        }

        // Check if student exists
        const student = await Students.findOne({ rollcode: String(rollcode) });
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials!" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: student._id, rollcode: student.rollcode },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Token valid for 7 days
        );

        res.status(200).json({ message: "Login successful!", token, student: { rollcode: student.rollcode } });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});

// Get Student Profile
router.get("/students-profile", verifyStudent, async (req, res) => {
    try {
        const student = await Students.findById(req.studentId).select("-password"); // Exclude password

        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error("Profile fetch error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});

// Update Student Profile
router.put("/student-update-profile", verifyStudent, upload.single("profileImage"), async (req, res) => {
    try {
        const { name, fathersName, collageRollNo, gender, dateOfBirth, mobileNo, emailId, course, department, semester, batch, address } = req.body;
        const profileImage = req.file ? req.file.filename : undefined;

        const existingStudent = await Students.findById(req.studentId);
        if (!existingStudent) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Update only provided fields
        const updatedFields = {
            ...(name && { name }),
            ...(fathersName && { fathersName }),
            ...(collageRollNo && { collageRollNo }),
            ...(gender && { gender }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(mobileNo && { mobileNo }),
            ...(emailId && { emailId }),
            ...(course && { course }),
            ...(department && { department }),
            ...(semester && { semester }),
            ...(batch && { batch }),
            ...(address && { address }),
            ...(profileImage && { profileImage }),
        };

        const updatedStudent = await Students.findByIdAndUpdate(
            req.studentId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Student data updated successfully!", student: updatedStudent });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server Error!", error: error.message });
    }
});

module.exports = router;
