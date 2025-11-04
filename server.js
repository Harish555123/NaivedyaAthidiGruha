// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const xlsx = require("xlsx");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// ---------- File Paths ----------
const USERS_FILE = "./data/users.xlsx";
const BOOKINGS_FILE = "./data/bookings.xlsx";

// ---------- Helper Functions ----------
function readSheet(filename) {
  if (!fs.existsSync(filename)) return [];
  const wb = xlsx.readFile(filename);
  const ws = wb.Sheets[wb.SheetNames[0]];
  return xlsx.utils.sheet_to_json(ws);
}

function writeSheet(filename, data) {
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  xlsx.writeFile(wb, filename);
}

// ---------- User Signup ----------
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  let users = readSheet(USERS_FILE);
  if (users.find((u) => u.email === email))
    return res.status(400).json({ message: "Email already registered" });

  const hashed = bcrypt.hashSync(password, 8);
  users.push({ name, email, password: hashed });
  writeSheet(USERS_FILE, users);

  res.json({ success: true, message: "Signup successful" });
});

// ---------- User Login ----------
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const users = readSheet(USERS_FILE);
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (validPassword) {
    res.json({
      success: true,
      message: "Login successful",
      name: user.name,
      email: user.email,
      isAdmin: email === "admin@naivedya.com",
    });
  } else {
    res.json({ success: false, message: "Invalid password" });
  }
});

// ---------- Booking ----------
app.post("/booking", (req, res) => {
  const { name, email, checkin, checkout, guests, roomType } = req.body;

  if (!name || !email || !checkin || !checkout || !guests || !roomType) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const bookings = readSheet(BOOKINGS_FILE);
  bookings.push({
    name,
    email,
    checkin,
    checkout,
    guests,
    roomType,
    createdAt: new Date().toISOString(),
  });

  writeSheet(BOOKINGS_FILE, bookings);
  res.json({ success: true, message: "Booking saved successfully" });
});

// ---------- Admin Bookings View ----------
app.get("/admin/bookings", (req, res) => {
  try {
    const bookings = readSheet(BOOKINGS_FILE);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error reading bookings file" });
  }
});

// ---------- Admin Login ----------
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@naivedya.com";
  const ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    res.json({ success: true, message: "Admin login successful" });
  } else {
    res.json({ success: false, message: "Invalid admin credentials" });
  }
});

// ---------- Run Server ----------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
