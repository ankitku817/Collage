const express = require("express");
const verifyEmployee = require("../middleware/verifyEmployee");
const Company = require("../models/Company");
const Application = require("../models/Application");
const router = express.Router();

const getStartOfDay = () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); 
    return startOfDay;
};

const getEndOfDay = () => {
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
};

router.get("/arriving-today", async (req, res) => {
    try {
        const todayStart = getStartOfDay();
        const todayEnd = getEndOfDay();
        const companies = await Company.find({
            arrivalDate: { $gte: todayStart, $lte: todayEnd }
        });

        if (companies.length === 0) {
            return res.status(404).json({ message: "No companies arriving today" });
        }

        return res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching companies" });
    }
});
router.get("/ongoing-recruitments", async (req, res) => {
    try {
        const now = new Date();
        const ongoingCompanies = await Company.find({
            arrivalDate: { $lte: now },
            departureDate: { $gte: now }
        }).sort({ arrivalDate: 1 });

        res.status(200).json(ongoingCompanies);
    } catch (error) {
        console.error("Error fetching ongoing recruitments:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// Get details of a specific recruitment (company) by ID
router.get("/recruitments/:id", async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "Recruitment not found!" });
        }
        res.status(200).json(company);
    } catch (error) {
        console.error("Error fetching recruitment details:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/apply/:companyId", async (req, res) => {
    try {
        const { studentId, resume } = req.body; 
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).json({ message: "Recruitment not found!" });
        }
        const newApplication = new Application({
            studentId,
            companyId: req.params.companyId,
            resume,
            appliedAt: new Date(),
        });

        await newApplication.save();
        res.status(201).json({ message: "Application submitted successfully!" });
    } catch (error) {
        console.error("Error applying to recruitment:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// Fetch all applications for a specific student
router.get("/applications/:studentId", async (req, res) => {
    try {
        const applications = await Application.find({ studentId: req.params.studentId });
        res.status(200).json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// Verify if a student has applied to a particular recruitment (company)
router.get("/has-applied/:studentId/:companyId", async (req, res) => {
    try {
        const application = await Application.findOne({
            studentId: req.params.studentId,
            companyId: req.params.companyId
        });
        if (application) {
            return res.status(200).json({ hasApplied: true });
        } else {
            return res.status(200).json({ hasApplied: false });
        }
    } catch (error) {
        console.error("Error checking application status:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

module.exports = router;
