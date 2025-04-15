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



router.post(
    "/companies",
    upload.fields([{ name: "companyImage", maxCount: 1 }, { name: "companyPdf", maxCount: 1 }]),
    async (req, res) => {
        console.log("Uploaded Files:", req.files);
        console.log("Request Body:", req.body);

        try {
            const { name, industry, contact, arrivalDate, departureDate, jobDescription, eligibilityCriteria, rounds,location } = req.body;
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


// router.post("/companies", verifyEmployee, upload.single("companyImage"), async (req, res) => {
//     try {
//         const { name, industry, contact, arrivalDate, departureDate, jobDescription, eligibilityCriteria, rounds } = req.body;
//         const companyImage = req.file ? req.file.path : null;

//         if (!name || !industry || !contact || !arrivalDate || !departureDate || !jobDescription || !companyImage || !rounds) {
//             return res.status(400).json({ message: "All fields are required!" });
//         }
//         const parsedRounds = JSON.parse(rounds);
//         const parsedEligibility = eligibilityCriteria ? JSON.parse(eligibilityCriteria) : {
//             percentage: 60,
//             passOutYear: 2025,
//             branch: "B.Tech CSE"
//         };
//         const newCompany = new Company({
//             name,
//             industry,
//             contact,
//             arrivalDate,
//             departureDate,
//             jobDescription,
//             eligibilityCriteria: parsedEligibility,
//             rounds: parsedRounds,
//             companyImage
//         });

//         await newCompany.save();
//         res.status(201).json(newCompany);

//     } catch (error) {
//         console.error("Error adding company:", error);
//         res.status(500).json({ message: "Server error!" });
//     }
// });

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
