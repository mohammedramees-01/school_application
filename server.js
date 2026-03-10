// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoutes from "./routes/auth.js"
// // import { protect } from "../middleware/authMiddleware.js";
// import studentRoutes from "./routes/student.js";
// // import Student from "../models/Student.js";


// // dotenv.config({ path: "../.env" });
// dotenv.config();
// const app = express();
// app.use(express.json());

// // Test route for root
// app.get("/", (req, res) => {
//   res.send("Project running on port 3001 ✅");
// });
// app.use("/api/auth", authRoutes);
// app.use("/api/students", studentRoutes);
// // app.use("/api/students", studentRoutes);
// // router.get("/me", protect, (req, res) => {
// //   res.json(req.user);
// // });


// // Async DB connection
// const startServer = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Database Connected Successfully");

//     // app.listen(3001, () => {
//     //   console.log("Server running on http://localhost:3001");
//     // });
//         app.listen(process.env.PORT, () => {
//       console.log("Server running on http://localhost:3001");
//     });
//   } catch (err) {
//     console.error("Failed to connect to MongoDB:", err);
//     process.exit(1);
//   }
// };

// startServer();
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // ✅ add this
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";

dotenv.config();
const app = express();

// ✅ CORS middleware (VERY IMPORTANT - before routes)
app.use(cors({
  origin: "https://school-application-front-end.vercel.app", // React Vite frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send(`Project running on port ${process.env.PORT} ✅`);
});


app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Async DB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

startServer();