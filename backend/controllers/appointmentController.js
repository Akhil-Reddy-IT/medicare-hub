const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (Patient only, though Admin can book on behalf)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, notes } = req.body;

    // Check if doctor profile exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      res.status(404);
      throw new Error('Doctor not found');
    }

    // Check for double booking (same doctor, same date, same time slot, non-cancelled)
    const existing = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $ne: 'cancelled' }
    });

    if (existing) {
      res.status(400);
      throw new Error('This time slot is already booked for this doctor');
    }

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      notes,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    let appointments;

    if (req.user.role === 'patient') {
      appointments = await Appointment.find({ patientId: req.user.id })
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email profileImage phone' }
        })
        .sort('-appointmentDate');
    } else if (req.user.role === 'doctor') {
      // Find the doctor profile associated with this user
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        res.status(404);
        throw new Error('Doctor profile not found');
      }

      appointments = await Appointment.find({ doctorId: doctorProfile._id })
        .populate('patientId', 'name email age gender profileImage phone')
        .sort('-appointmentDate');
    } else if (req.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('patientId', 'name email profileImage')
        .populate({
          path: 'doctorId',
          populate: { path: 'userId', select: 'name email profileImage' }
        })
        .sort('-appointmentDate');
    }

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status/notes/prescription
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // Role-based permissions checks
    const isPatient = appointment.patientId.toString() === req.user.id;

    let isDoctor = false;
    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (doctorProfile && appointment.doctorId.toString() === doctorProfile._id.toString()) {
      isDoctor = true;
    }

    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to modify this appointment');
    }

    const { status, appointmentDate, appointmentTime, notes, prescription } = req.body;

    // Patients can reschedule or cancel
    if (isPatient) {
      if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
      if (appointmentTime) appointment.appointmentTime = appointmentTime;
      if (status === 'cancelled') appointment.status = 'cancelled';
      if (notes) appointment.notes = notes;
    }

    // Doctors can change status (confirm, complete, cancel) and write prescription/notes
    if (isDoctor) {
      if (status) appointment.status = status;
      if (prescription !== undefined) appointment.prescription = prescription;
      if (notes) appointment.notes = notes;
    }

    // Admin can edit everything
    if (isAdmin) {
      if (status) appointment.status = status;
      if (appointmentDate) appointment.appointmentDate = new Date(appointmentDate);
      if (appointmentTime) appointment.appointmentTime = appointmentTime;
      if (prescription !== undefined) appointment.prescription = prescription;
      if (notes) appointment.notes = notes;
    }

    const updatedAppointment = await appointment.save();

    res.json({
      success: true,
      appointment: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel/Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404);
      throw new Error('Appointment not found');
    }

    // User ownership or admin verify
    if (
      appointment.patientId.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      res.status(403);
      throw new Error('Not authorized to cancel this appointment');
    }

    // Instead of absolute deleting, we can update status to cancelled
    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    next(error);
  }
};
