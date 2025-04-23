const express = require("express");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const verifyEmployee = require("../middleware/verifyEmployee"); 
const Employee = require("../models/Employee");
const Student = require("../models/Students"); 
const Company = require("../models/Company");
const OutgoingCompany = require("../models/OutgoingCompany.js");
const multer = require("multer");
const Application = require("../models/Application.js");
const SelectedStudent = require("../models/SelectedStudent");
const uploadDir = path.join(__dirname, "../uploads");
const router = express.Router();

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

router.post("/storeSelectedStudents", async (req, res) => {
    const { companyId, roundsData, finalSelectedStudents } = req.body;

    if (!companyId || !roundsData || roundsData.length === 0) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        let selectedStudentRecord = await SelectedStudent.findOne({ companyId });

        if (!selectedStudentRecord) {
            selectedStudentRecord = new SelectedStudent({
                companyId,
                roundsData,
                finalSelectedStudents,
            });
        } else {
            for (const { round, selectedStudents } of roundsData) {
                const existingIndex = selectedStudentRecord.roundsData.findIndex(r => r.round === round);
                if (existingIndex !== -1) {
                    selectedStudentRecord.roundsData[existingIndex].selectedStudents = selectedStudents;
                } else {
                    selectedStudentRecord.roundsData.push({ round, selectedStudents });
                }
            }
            selectedStudentRecord.finalSelectedStudents = finalSelectedStudents || selectedStudentRecord.finalSelectedStudents;
        }

        await selectedStudentRecord.save();
        res.status(200).json({ success: true, message: "Selected students saved." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving selected students." });
    }
});

router.put("/updateSelectedStudents", async (req, res) => {
    const { companyId, roundsData, finalSelectedStudents } = req.body;

    if (!companyId || !roundsData || roundsData.length === 0) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    try {
        let selectedStudentRecord = await SelectedStudent.findOne({ companyId });

        if (!selectedStudentRecord) {
            selectedStudentRecord = new SelectedStudent({
                companyId,
                roundsData,
                finalSelectedStudents,
            });
        } else {
            for (const { round, selectedStudents } of roundsData) {
                const existingIndex = selectedStudentRecord.roundsData.findIndex(r => r.round === round);
                if (existingIndex !== -1) {
                    selectedStudentRecord.roundsData[existingIndex].selectedStudents = selectedStudents;
                } else {
                    selectedStudentRecord.roundsData.push({ round, selectedStudents });
                }
            }

            selectedStudentRecord.finalSelectedStudents = finalSelectedStudents || selectedStudentRecord.finalSelectedStudents;
        }

        await selectedStudentRecord.save();

        res.status(200).json({ success: true, message: "Selected students updated." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating selected students." });
    }
});

router.get("/getSelectedStudents/:companyId", async (req, res) => {
    const { companyId } = req.params;

    try {
        const selected = await SelectedStudent.findOne({ companyId });

        if (!selected) {
            return res.status(404).json({ success: false, message: "No selected students found." });
        }

        const result = {};

        // Loop through roundsData to extract students for each round
        selected.roundsData.forEach(({ round, selectedStudents }) => {
            result[`round${round}`] = {
                selectedStudents,
            };
        });

        result["finalSelectedStudents"] = selected.finalSelectedStudents || [];

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error while fetching selected students." });
    }
});

router.post("/companies",upload.fields([{ name: "companyImage", maxCount: 1 }, { name: "companyPdf", maxCount: 1 }]),async (req, res) => {
        console.log("Uploaded Files:", req.files);
        console.log("Request Body:", req.body);
        try {
            const { name, industry, contact, arrivalDate, departureDate, jobDescription, eligibilityCriteria, rounds, location } = req.body;
            if (!req.files?.companyImage) {
                return res.status(400).json({ message: "Company image is required!" });
            }
            const companyImage = req.files.companyImage[0].filename;
            const companyPdf = req.files?.companyPdf ? req.files.companyPdf[0].filename : null;
            let parsedEligibility;
            try {
                parsedEligibility = JSON.parse(eligibilityCriteria);
            } catch (err) {
                return res.status(400).json({ message: "Invalid eligibilityCriteria format!" });
            }
            let parsedRounds;
            try {
                parsedRounds = JSON.parse(rounds);
                if (!Array.isArray(parsedRounds) || parsedRounds.length === 0) {
                    return res.status(400).json({ message: "Rounds should be a non-empty array!" });
                }
            } catch (err) {
                return res.status(400).json({ message: "Invalid rounds format!" });
            }
            const newCompany = new Company({
                name,
                industry,
                contact,
                arrivalDate,
                departureDate,
                jobDescription,
                location,
                eligibilityCriteria: parsedEligibility,
                rounds: parsedRounds,
                companyImage,
                companyPdf,
            });
            await newCompany.save();
            res.status(201).json(newCompany);
        } catch (error) {
            console.error("Error adding company:", error);
            res.status(500).json({ message: "Server error!" });
        }
    }
);

router.get("/applications/:companyId", verifyEmployee, async (req, res) => {
    try {
        const { companyId } = req.params;
        const applications = await Application.find({ companyId }).populate("studentId");
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/students", verifyEmployee, async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/companies", verifyEmployee, async (req, res) => {
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

router.get("/companies/outgoing", verifyEmployee, async (req, res) => {
    try {
        const outgoingCompanies = await OutgoingCompany.find().sort({ departureDate: -1 });
        res.status(200).json(outgoingCompanies);
    } catch (error) {
        console.error("Error fetching outgoing companies:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/allcompanies", verifyEmployee, async (req, res) => {
    try {
        const activeCompanies = await Company.find().sort({ arrivalDate: 1 });
        const outgoingCompanies = await OutgoingCompany.find().sort({ departureDate: -1 });

        res.status(200).json({
            active: activeCompanies,
            outgoing: outgoingCompanies,
        });
    } catch (error) {
        console.error("Error fetching all companies:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/todaycompanies", verifyEmployee, async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); 

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 

        const todayCompanies = await Company.find({
            arrivalDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
        }).sort({ arrivalDate: 1 });

        res.status(200).json(todayCompanies);
    } catch (error) {
        console.error("Error fetching today's companies:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.delete("/companies/:id", verifyEmployee, async (req, res) => {
    try {
        const { id } = req.params;
        await Company.findByIdAndDelete(id);
        res.status(200).json({ message: "Company deleted successfully!" });
    } catch (error) {
        console.error("Error deleting company:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/employee-login", async (req, res) => {
    try {
        const { empId, password } = req.body;

        const employee = await Employee.findOne({ empId });
        if (!employee) {
            return res.status(400).json({ message: "Invalid Employee Id" });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password!" });
        }

        const token = jwt.sign(
            { employeeId: employee._id, empId: employee.empId },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            employee: {
                id: employee._id,
                empId: employee.empId,
            },
        });
    } catch (error) {
        console.error("Employee login error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.get("/employees", verifyEmployee, async (req, res) => {
    try {
        const employee = await Employee.findById(req.employeeId).select("-password");
        if (!employee) return res.status(404).json({ message: "User not found!" });
        res.status(200).json(employee); 
    } catch (error) {
        console.error("Profile fetch error:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});

router.put("/employees", verifyEmployee, async (req, res) => {
    try {
        const employeeId = req.employeeId;

        const {
            email,
            department,
            designation,
            officeLocation,
            joiningDate,
            status,
            bio,
            socialLinks,
            permissions,
            lastLogin,
            notifications,
            alternateEmail,
        } = req.body;

        const updateData = {};

        if (email) updateData.email = email;
        if (department) updateData.department = department;
        if (designation) updateData.designation = designation;
        if (officeLocation) updateData.officeLocation = officeLocation;
        if (joiningDate) updateData.joiningDate = joiningDate;
        if (status) updateData.status = status;
        if (bio) updateData.bio = bio;
        if (socialLinks) updateData.socialLinks = socialLinks;
        if (permissions) updateData.permissions = permissions;
        if (lastLogin) updateData.lastLogin = lastLogin;
        if (notifications !== undefined) updateData.notifications = notifications;
        if (alternateEmail) updateData.alternateEmail = alternateEmail;

        console.log("Updating with:", updateData); // 👈 Debug log

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                select: "-password", // Make sure password exists to exclude
            }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        return res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error("Profile update error:", error.message);
        return res.status(500).json({ message: "Failed to update profile" });
    }
});

module.exports = router;
