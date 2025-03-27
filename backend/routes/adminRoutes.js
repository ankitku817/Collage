const express = require("express");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Admin = require("../models/Admin");
const Students = require("../models/Students");
const Employee = require("../models/Employee");
const verifyAdmin = require("../middleware/verifyAdmin");
const verifyStudent = require("../middleware/verifyStudent");
const router = express.Router();
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
const generateUniqueCode = async () => {
    let uniqueCode;
    let isUnique = false;

    while (!isUnique) {
        uniqueCode = Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
        const existingCode = await Admin.findOne({ uniqueCode });
        if (!existingCode) isUnique = true;
    }

    return uniqueCode;
};
router.post("/register", async (req, res) => {
    try {
        const { name, email, phone, password, collegeName } = req.body;
        let existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already registered!" });
        }
        const uniqueCode = await generateUniqueCode();
        const newAdmin = new Admin({
            name,
            email,
            phone,
            password,
            collegeName,
            uniqueCode, 
        });

        await newAdmin.save();

        res.status(201).json({
            message: "Admin registered successfully!",
            uniqueCode: uniqueCode, 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
});
router.get("/admin-profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized!" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const admin = await Admin.findById(decoded.adminId).select("-password");
        if (!admin) {
            console.log("Admin not found in database!");
            return res.status(404).json({ message: "Admin not found!" });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.put(
    "/admin-update-profile",
    verifyAdmin,
    upload.single("profileImage"),
    async (req, res) => {
        try {
            const { name, email, phone, collegeName, dateOfBirth, joiningDate, uniqueCode } = req.body;
            const profileImage = req.file ? req.file.filename : undefined;

            console.log("📁 Uploaded File:", req.file);
            console.log("📄 Request Body:", req.body);

            if (!req.adminId) {
                return res.status(400).json({ message: "Admin ID is missing. Unauthorized request." });
            }

            // Find the existing admin
            const existingAdmin = await Admin.findById(req.adminId);
            if (!existingAdmin) {
                return res.status(404).json({ message: "Admin not found." });
            }

            // Validate uniqueCode only if it's being updated
            if (uniqueCode && !/^\d{10}$/.test(uniqueCode)) {
                return res.status(400).json({ message: "Unique code must be exactly 10 digits." });
            }

            // Update only provided fields
            const updatedFields = {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(collegeName && { collegeName }),
                ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
                ...(joiningDate && { joiningDate: new Date(joiningDate) }),
                ...(uniqueCode && { uniqueCode }),
                ...(profileImage && { profileImage: profileImage }),
            };

            const updatedAdmin = await Admin.findByIdAndUpdate(
                req.adminId,
                { $set: updatedFields },
                { new: true, runValidators: true }
            );
            res.status(200).json({ message: "Profile Updated Successfully!", admin: updatedAdmin });
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            res.status(500).json({ message: "Server Error!", error: error.message });
        }
    }
);

router.post("/login", async (req, res) => {
    try {
        const { uniqueCode, password } = req.body;

        const admin = await Admin.findOne({ uniqueCode });
        if (!admin) {
            return res.status(400).json({ message: "Invalid unique code or password!" });
        }
        
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid unique code or password!" });
        }
        
        const token = jwt.sign(
            { adminId: admin._id, uniqueCode: admin.uniqueCode, email: admin.email },
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" } 
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                uniqueCode: admin.uniqueCode,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/request-password-change", async (req, res) => {
    try {
        const { uniqueCode } = req.body;
        const admin = await Admin.findOne({ uniqueCode });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        const otp = generateOTP();
        admin.otp = otp;
        admin.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins
        await admin.save();

        // Send OTP via email and SMS
        await sendEmailOTP(admin.email, otp);
        await sendSMSOTP(admin.phone, otp);

        res.status(200).json({ message: "OTP sent to email and phone." });
    } catch (error) {
        console.error("OTP error:", error);
        res.status(500).json({ message: "Failed to send OTP." });
    }
});

router.post("/change-password", async (req, res) => {
    try {
        const { uniqueCode, otp, newPassword } = req.body;
        const admin = await Admin.findOne({ uniqueCode });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found!" });
        }

        if (admin.otp !== otp || Date.now() > admin.otpExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        admin.otp = null;
        admin.otpExpires = null;
        await admin.save();

        res.status(200).json({ message: "Password changed successfully!" });
    } catch (error) {
        console.error("Password change error:", error);
        res.status(500).json({ message: "Failed to change password." });
    }
});

router.post("/add-students", verifyAdmin, async (req, res) => {
    try {
        const { rollcode, password, mobileNo } = req.body;
        if (!rollcode || rollcode.length !== 7) {
            return res.status(400).json({ message: "Roll code must be exactly 7 characters long!" });
        }
        if (!/^\d{10}$/.test(mobileNo)) {
            return res.status(400).json({ message: "Invalid mobile number! It must be exactly 10 digits." });
        }
        const existingStudent = await Students.findOne({ rollcode: String(rollcode) });
        if (existingStudent) {
            return res.status(400).json({ message: "Student with this roll number already exists!" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = new Students({
            rollcode: String(rollcode),
            password: hashedPassword,
            mobileNo: String(mobileNo),
        });
        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully!" });
    } catch (error) {
        console.error("Error registering student:", error.message);
        res.status(500).json({ message: "Server error!" });
    }
});
router.get("/students", verifyAdmin, async (req, res) => {
    try {
        const students = await Students.find(); 
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.put("/students/update/:id", verifyAdmin, async (req, res) => {
    console.log("Received update request for ID:", req.params.id);
    console.log("Request body:", req.body); 

    try {
        const { id } = req.params;
        let updateData = { ...req.body };

        // Hash password if it's being updated
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedStudent = await Students.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
    } catch (error) {
        console.error("Error updating student:", error); // Log the error
        res.status(500).json({ message: "Error updating student", error: error.message });
    }
});

// router.put("/update/:id", verifyAdmin, async (req, res) => {
//     try {
//         const { id } = req.params;
//         let updateData = { ...req.body };

//         // Hash password if it's being updated
//         if (updateData.password) {
//             updateData.password = await bcrypt.hash(updateData.password, 10);
//         }

//         const updatedStudent = await Students.findByIdAndUpdate(id, updateData, { new: true });

//         if (!updatedStudent) {
//             return res.status(404).json({ message: "Student not found" });
//         }

//         res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating student", error: error.message });
//     }
// });
router.get("/employees", verifyAdmin, async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

router.post("/register-employee", verifyAdmin, async (req, res) => {
    try {
        const { empId, password } = req.body;
        const existingEmployee = await Employee.findOne({ empId });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this Employee ID already exists!" });
        }

        const newEmployee = new Employee({ empId, password });
        await newEmployee.save();

        res.status(201).json({ message: "Employee registered successfully!" });
    } catch (error) {
        console.error(error);
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

module.exports = router;
