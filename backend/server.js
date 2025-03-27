const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// Import Routes
const adminRoutes = require("./routes/adminRoutes");
const studentsRoutes = require("./routes/studentsRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Create "uploads" directory if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(uploadDir));

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentsRoutes);
app.use("/api/admin/check-code", adminRoutes); // ✅ Fixed the route

// Root Route
app.get("/", (req, res) => {
    res.send("Backend is working successfully!!!");
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
