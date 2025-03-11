const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const adminRoutes = require("./routes/adminRoutes");
const studentsRoutes = require("./routes/studentsRoutes");

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

const fs = require("fs");
const path = require("path");

const uploadDir = path.join(__dirname, "./uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/uploads", express.static("uploads"));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use("/api/admin", adminRoutes);
app.use("/api/student", studentsRoutes);
app.use("/api/admin/check - code", adminRoutes);

app.get('/', (req, res) => {
    res.send('Backend is working successfully!!!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
