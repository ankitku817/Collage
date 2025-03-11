const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const verifyAdmin = async (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("❌ No token provided!");
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔍 Decoded Token:", decoded);

        req.adminId = decoded.adminId; 
        console.log("🔍 Extracted Admin ID:", req.adminId);

        const admin = await Admin.findById(req.adminId);
        if (!admin) {
            console.log("❌ Admin not found in database!");
            return res.status(404).json({ message: "Admin not found!" });
        }

        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = verifyAdmin;
