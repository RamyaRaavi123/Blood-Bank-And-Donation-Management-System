const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Donor = require("./models/Donor");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "secretkey123"; // Store securely in production

mongoose.connect("mongodb://localhost:27017/blood_donation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });
  await user.save();
  res.json({ message: "Registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Add Donor (Protected)
app.post("/donor", auth, async (req, res) => {
  const { bloodGroup, contact } = req.body;
  const donor = new Donor({ userId: req.user.userId, bloodGroup, contact });
  await donor.save();
  res.json({ message: "Donor added" });
});

// Get All Donors
app.get("/donors", async (req, res) => {
  const donors = await Donor.find().populate("userId", "name email");
  res.json(donors);
});

// Search Donors
app.get("/donors/search/:group", async (req, res) => {
  const donors = await Donor.find({ bloodGroup: req.params.group }).populate("userId", "name email");
  res.json(donors);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
