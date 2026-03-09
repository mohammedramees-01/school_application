
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();


// ✅ Student: View own data
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const student = await Student.findById(user.studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Admin: Get all students
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await Student.find();
    res.json(students);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Admin: Create student
router.post("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, className } = req.body;

    const student = await Student.create({
      name,
      email,
      className
    });

    res.status(201).json(student);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ✅ Admin: Update progress
router.put("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const { marks, grade, remarks } = req.body;

    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          "progress.marks": marks,
          "progress.grade": grade,
          "progress.remarks": remarks
        }
      },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;





