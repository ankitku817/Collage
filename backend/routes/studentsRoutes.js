const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Students = require("../models/Students");
const verifyStudent = require("../middleware/verifyStudent");

const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
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

router.put("/student-update-profile", verifyStudent, upload.single("profileImage"), async (req, res) => {
    try {
        const studentId = req.studentId || req.body.studentId;  // Ensure the ID is taken correctly

        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required!" });
        }

        const existingStudent = await Students.findById(studentId);
        if (!existingStudent) {
            return res.status(404).json({ message: "Student not found." });
        }

        const { name, fathersName, collageRollNo, gender, dateOfBirth, mobileNo, emailId, course, department, semester, batch, address } = req.body;
        const profileImage = req.file ? req.file.filename : existingStudent.profileImage; // Keep old image if not updated

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
            studentId,
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Student data updated successfully!", student: updatedStudent });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server Error!", error: error.message });
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



module.exports = router;