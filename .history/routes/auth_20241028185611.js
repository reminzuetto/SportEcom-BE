// Import necessary libraries
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// User registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Username or password is incorrect" });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Middleware for token authentication
const auth = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Update user information
router.put("/save", async (req, res) => {
  try {
    const { username, name, address, phone, email } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user information
    user.name = name || user.name;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.email = email || user.email;

    // Save updated user
    await user.save();

    res
      .status(200)
      .json({ message: "User information updated successfully", user });
  } catch (err) {
    console.error("Error updating user information:", err);
    res.status(500).json({ message: "An error occurred" });
  }
});

// Export router for use in other files
module.exports = router;
