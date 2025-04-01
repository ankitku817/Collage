const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const verifyEmployee = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied! No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

        req.employeeId = decoded.employeeId; 

        const employee = await Employee.findById(req.employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found!" });
        }

        req.employee = employee; 

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = verifyEmployee;
