const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors (with filters/search)
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const { specialization, hospital, feeMax, search } = req.query;
    let query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    if (hospital) {
      query.hospital = { $regex: hospital, $options: 'i' };
    }

    if (feeMax) {
      query.consultationFee = { $lte: Number(feeMax) };
    }

    let doctors = await Doctor.find(query).populate('userId', 'name email gender phone profileImage');

    // If search filter is active, filter doctors by their populated user name
    if (search) {
      const searchLower = search.toLowerCase();
      doctors = doctors.filter(doc => 
        doc.userId && doc.userId.name.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email gender phone profileImage');

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Doctor or Admin only)
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      res.status(404);
      throw new Error('Doctor record not found');
    }

    // Verify ownership: req.user must own this doctor profile OR be admin
    if (doctor.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this profile');
    }

    const { specialization, experience, hospital, consultationFee, availableSlots, biography } = req.body;

    doctor.specialization = specialization || doctor.specialization;
    doctor.experience = experience !== undefined ? Number(experience) : doctor.experience;
    doctor.hospital = hospital || doctor.hospital;
    doctor.consultationFee = consultationFee !== undefined ? Number(consultationFee) : doctor.consultationFee;
    doctor.availableSlots = availableSlots || doctor.availableSlots;
    doctor.biography = biography || doctor.biography;

    const updatedDoctor = await doctor.save();
    const populated = await updatedDoctor.populate('userId', 'name email gender phone profileImage');

    res.json({
      success: true,
      doctor: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile by user ID
// @route   GET /api/doctors/user/:userId
// @access  Public
exports.getDoctorByUserId = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.params.userId }).populate('userId', 'name email gender phone profileImage');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found for this user' });
    }
    res.json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};
