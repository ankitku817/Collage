const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const admin = require("firebase-admin");
const path = require("path");
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = '52c7d68a1a002eb7f1b10fc4d2510150926904906b6ad1e5ff863b9b8f33c8c66476b7dfe6c36b579964951059bc89ff1f4f0f3ccd140fe141e9e2546f49d3a6';

const serviceAccount = require(path.resolve(__dirname, "../config/serviceAccountKey.json"));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://twiller-c48b4.firebaseio.com',
});

const otpStore = {}; // Store OTP for verification

// Create a transporter with Gmail service and app password
const transporter = nodemailer.createTransport({
    service: "gmail", // or another email service
    auth: {
        user: "ankitkumarhardia6325@gmail.com", // Your Gmail address
        pass: "ygwk zhqn fmbk mbkk", // The 16-character app password you generated
    },
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Route to send OTP
router.post("/send-otp", body("email").isEmail(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Generate random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in memory (in real-world apps, store it securely)
        otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // OTP expires in 5 minutes

        // Send OTP via email
        await transporter.sendMail({
            from: '"OTP Service" <ankitkumarhardia6325@gmail.com>',
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is: ${otp}`,
        });

        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
});

// Route to verify OTP
router.post("/verify-otp", body("email").isEmail(), body("otp").isNumeric(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;

    // Check if OTP exists for the email and if it's expired
    if (!otpStore[email]) {
        return res.status(400).json({ success: false, message: "OTP not found" });
    }

    const storedOtp = otpStore[email].otp;
    const expiryTime = otpStore[email].expires;

    if (Date.now() > expiryTime) {
        // OTP expired
        delete otpStore[email]; // Clean up expired OTP
        return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    // Compare the entered OTP with the stored OTP
    if (storedOtp === otp) {
        // OTP is valid
        delete otpStore[email]; // Clean up after successful verification
        res.json({ success: true, message: "OTP verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Invalid OTP" });
    }
});

// Route for Google login
router.post('/google-login', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ error: 'ID Token is required' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        let user = await User.findOne({ firebaseUid: uid });
        if (!user) {
            user = new User({
                firebaseUid: uid,
                username: decodedToken.name || `user-${uid}`,
                email: decodedToken.email,
                name: decodedToken.name || 'Anonymous',
            });
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// Sign Up Route
router.post('/signup', async (req, res) => {
    const { username, name, email, password } = req.body;

    if (!username || !email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, name, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Details Route
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Logout Route
router.post('/logout', verifyToken, (req, res) => {
    try {
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
