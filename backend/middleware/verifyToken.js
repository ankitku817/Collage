const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
        console.log("✅ Decoded Token:", decoded); // Debugging log

        if (!decoded.rollcode) {
            console.log("❌ Rollcode missing in token payload:", decoded);
            return res.status(401).json({ message: "Unauthorized: Token invalid or missing rollcode!" });
        }

        req.user = decoded; // Attach user data
        next();
    } catch (error) {
        console.error("❌ JWT Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token!" });
    }
};

module.exports = verifyToken;
