const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authShcema");
require("dotenv").config();

// Register a new user
const registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // ✅ Log request body for debugging
      console.log("Received data:", req.body);
  
      // ✅ Validate input fields
      if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // ✅ Ensure password is a string
      if (typeof password !== "string") {
        return res.status(400).json({ message: "Invalid password format" });
      }
  
      // ✅ Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // ✅ Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // ✅ Create and save the new user
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };