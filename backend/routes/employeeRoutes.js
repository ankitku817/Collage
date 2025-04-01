const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyEmployee = require("../middleware/verifyEmployee"); 
const Employee = require("../models/Employee");
const Student = require("../models/Students"); 
const Company = require("../models/Company");

const router = express.Router();
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
        const companies = await Company.find().sort({ arrivalDate: 1 }); 
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/companies", verifyEmployee, async (req, res) => {
    try {
        const { name, industry, contact, arrivalDate, departureDate } = req.body;

        if (!name || !industry || !contact || !arrivalDate || !departureDate) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newCompany = new Company({ name, industry, contact, arrivalDate, departureDate });
        await newCompany.save();

        res.status(201).json(newCompany);
    } catch (error) {
        console.error("Error adding company:", error);
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
module.exports = router;
