const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reportName: {
    type: String,
    required: [true, 'Please add a report name'],
    trim: true
  },
  reportType: {
    type: String,
    enum: ['blood_test', 'prescription', 'xray', 'other'],
    required: [true, 'Please specify the report type']
  },
  fileUrl: {
    type: String,
    required: [true, 'Please provide the file URL']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
