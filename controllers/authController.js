const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT Token Generator
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Sign Up
exports.signup = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ firstName, lastName, email, password, phone });
        const token = generateToken(user._id);

        res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Log In
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);
        res.status(200).json({ message: "Login successful", token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
