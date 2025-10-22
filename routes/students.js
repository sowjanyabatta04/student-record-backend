const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get student by roll number
router.get('/:rollNumber', async (req, res) => {
    try {
        const student = await Student.findOne({ rollNumber: req.params.rollNumber });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new student
router.post('/', async (req, res) => {
    const student = new Student(req.body);
    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update student
router.put('/:rollNumber', async (req, res) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { rollNumber: req.params.rollNumber },
            req.body,
            { new: true }
        );
        if (!updatedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete student
router.delete('/:rollNumber', async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ rollNumber: req.params.rollNumber });
        if (!deletedStudent) return res.status(404).json({ message: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
