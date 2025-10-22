const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    marks: { type: Number, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
