import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {adminOnly} from "./middleware/index.js"
import Certificate from "./models/Certificate.js"
import User from "./models/User.js"

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Co-Curricular Course Management API is running...");
});

app.post("/certificate", adminOnly, async (req, res) => {
    try {
      const { hash } = req.body;
  
      const certificate = new Certificate({ hash });
      await certificate.save();
  
      res.status(201).json({ message: "certificate added successfully", certificate });
    } catch (error) {
      res.status(500).json({ message: "Error adding certificate", error });
    }
});

app.get("/:hash", async (req, res) => {
    try {
      const certificate = await Certificate.findOne({hash: req.params.hash});
  
      if (!certificate) return res.status(404).json({ message: "certificate not found" });
  
      res.json(certificate);
    } catch (error) {
      res.status(500).json({ message: "Error fetching certificate details", error });
    }
});

app.post("/addAuthority", async (req, res) => {
    try {
      const { name } = req.body;
  
      const user = new User({ name });
      await user.save();
  
      res.status(201).json({ message: "user added successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error adding user", error });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
