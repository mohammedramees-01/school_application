// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import Student from "../models/Student.js";
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
// 👇 console log token
console.log("JWT TOKEN:", token);

  res.json({ token, role: user.role });
});
    
router.post("/create-user", protect, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);

  const student = await Student.create({
    name: req.body.name,
    class: req.body.class
  });
  const hashed = await bcrypt.hash(req.body.password, 10);

  await User.create({
    email: req.body.email,
    password: hashed,
    role: "student",
    studentId: student._id
  });
  res.sendStatus(201);
});
router.post("/create-first-admin", async (req, res) => {
  const exists = await User.findOne({ role: "admin" });
  if (exists) {
    return res.status(400).json({ message: "Admin already exists" });
  }

  const hashed = await bcrypt.hash(req.body.password.toString(), 10);

  await User.create({
    email: req.body.email,
    password: hashed,
    role: "admin"
  });

  res.status(201).json({ message: "Admin created" });
});

export default router;
