const jwt = require("jsonwebtoken");
const Students = require("../models/Students");
const verifyStudent = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access Denied! Malformed token." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.studentId = decoded.id;

        const student = await Students.findById(req.studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found!" });
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = verifyStudent;
