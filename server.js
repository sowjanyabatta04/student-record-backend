const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL, // your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

const studentSchema = new mongoose.Schema({
  name: String,
  rollNumber: { type: String, unique: true },
  course: String,
  marks: Number
});

const Student = mongoose.model("Student", studentSchema);

app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: "Failed to add student. Roll Number must be unique." });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
