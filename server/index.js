// server/index.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== Test route =====
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ===== In-memory storage =====
let users = []; // { name, email, password, role, verified }

// ===== Signup route =====
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  console.log("Signup attempt:", req.body);

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(409).json({ message: "Email already registered" });
  }

  users.push({ name, email, password, role, verified: false });

  return res.status(201).json({
    message: "Signup successful",
    user: { name, email, role },
  });
});

// ===== Verify route =====
app.post("/api/auth/verify", (req, res) => {
  const { email } = req.body;
  console.log("Verification attempt:", req.body);

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.verified = true;

  return res.status(200).json({ message: "Verification successful" });
});

// ===== Login route =====
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;
  console.log("Login attempt:", req.body);

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required" });
  }

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  if (!user.verified) {
    return res.status(403).json({ message: "User not verified" });
  }

  if (user.role !== role) {
    return res.status(403).json({ message: `Role mismatch. You are registered as ${user.role}.` });
  }

  // Dummy token for frontend
  return res.status(200).json({
    message: "Login successful",
    user: { name: user.name, email: user.email, role: user.role },
    token: "fake-jwt-token",
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});