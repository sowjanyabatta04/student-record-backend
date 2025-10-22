const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS: allow requests from deployed frontend
app.use(cors({
  origin: process.env.FRONTEND_URL, // set this on Render: your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ✅ Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, unique: true, required: true },
  course: { type: String, required: true },
  marks: { type: Number, required: true }
});

const Student = mongoose.model("Student", studentSchema);

// ✅ CRUD routes
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.get("/api/students/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.rollNumber });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Failed to add student. Roll Number must be unique." });
  }
});

app.put("/api/students/:rollNumber", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNumber: req.params.rollNumber },
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: "Failed to update student" });
  }
});

app.delete("/api/students/:rollNumber", async (req, res) => {
  try {
    await Student.findOneAndDelete({ rollNumber: req.params.rollNumber });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete student" });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
