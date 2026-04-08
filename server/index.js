// server/index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ======= In-memory storage for testing =======
let users = []; // { id, name, email, password, role }
let events = []; // { id, title, date, location, capacity, organizerId }

// ======= Routes =======

// Test route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Signup
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists." });
  }

  const newUser = { id: users.length + 1, name, email, password, role };
  users.push(newUser);

  res.status(201).json({ message: "Signup successful", user: newUser });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", user });
});

// Verify
app.post("/api/auth/verify", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  console.log("Verification requested for token:", token);

  // For testing, always return success
  return res.status(200).json({ message: "Verification successful" });
});

// Forgot Password (simulated)
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  console.log(`Password reset requested for email: ${email}`);
  return res.status(200).json({ message: "Reset link sent to your email (simulated)" });
});

// Create Event (Organizer)
app.post("/api/events", (req, res) => {
  const { title, date, location, capacity, organizerId } = req.body;

  if (!title || !date || !location || !capacity || !organizerId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const newEvent = {
    id: events.length + 1,
    title,
    date,
    location,
    capacity,
    organizerId
  };
  events.push(newEvent);

  res.status(201).json({ message: "Event created successfully", event: newEvent });
});

// Get all events (optional: filter by organizer)
app.get("/api/events", (req, res) => {
  const { organizerId } = req.query;
  if (organizerId) {
    const organizerEvents = events.filter(e => e.organizerId == organizerId);
    return res.json(organizerEvents);
  }
  res.json(events);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});