const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static(uploadDir));

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const adminRoutes = require("./routes/adminRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const employeRoutes = require("./routes/employeeRoutes");
const companyRoutes = require("./routes/companyRoutes");

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentsRoutes);
app.use("/api/employee", employeRoutes);
app.use("/api/admin/check-code", adminRoutes);
app.use("/api/company", companyRoutes);

app.get("/", (req, res) => {
    res.send("Backend is working successfully!!!");
});

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
