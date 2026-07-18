const fs = require('fs');
const path = require('path');
const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Upload a new medical record
// @route   POST /api/records/upload
// @access  Private (Patient only)
exports.uploadRecord = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a file');
    }

    const { reportName, reportType } = req.body;

    if (!reportName || !reportType) {
      // Remove uploaded file on validation failure
      fs.unlinkSync(req.file.path);
      res.status(400);
      throw new Error('Please provide reportName and reportType');
    }

    // Store local file path URL
    const fileUrl = `/uploads/${req.file.filename}`;

    const record = await MedicalRecord.create({
      patientId: req.user.id,
      reportName,
      reportType,
      fileUrl
    });

    res.status(201).json({
      success: true,
      record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all medical records
// @route   GET /api/records
// @access  Private
exports.getRecords = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patientId = req.user.id;
    } else if (req.user.role === 'doctor') {
      const { patientId } = req.query;
      if (!patientId) {
        res.status(400);
        throw new Error('Please provide patientId query parameter');
      }

      // Verify that this doctor has at least one appointment with this patient
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        res.status(404);
        throw new Error('Doctor profile not found');
      }

      const hasAppointment = await Appointment.findOne({
        patientId,
        doctorId: doctorProfile._id
      });

      if (!hasAppointment && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to access records for this patient');
      }

      query.patientId = patientId;
    } else if (req.user.role === 'admin') {
      const { patientId } = req.query;
      if (patientId) {
        query.patientId = patientId;
      }
    }

    const records = await MedicalRecord.find(query).sort('-uploadedAt');

    res.json({
      success: true,
      count: records.length,
      records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medical record
// @route   DELETE /api/records/:id
// @access  Private
exports.deleteRecord = async (req, res, next) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      res.status(404);
      throw new Error('Record not found');
    }

    // Verify ownership
    if (record.patientId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this record');
    }

    // Delete physical file from uploads folder
    const filename = path.basename(record.fileUrl);
    const filePath = path.join(__dirname, '../uploads', filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database entry
    await record.deleteOne();

    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
