const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add a specialization'],
    trim: true,
    index: true
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  hospital: {
    type: String,
    required: [true, 'Please add hospital affiliation'],
    trim: true
  },
  consultationFee: {
    type: Number,
    required: [true, 'Please add consultation fee']
  },
  availableSlots: {
    type: [String],
    default: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
  },
  biography: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);
