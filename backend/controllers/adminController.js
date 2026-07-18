const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get Admin Dashboard Analytics statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res, next) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await Doctor.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    // Group appointments by status
    const statusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format status counts as a key-value object
    const statsObj = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0
    };
    
    statusCounts.forEach(item => {
      if (statsObj.hasOwnProperty(item._id)) {
        statsObj[item._id] = item.count;
      }
    });

    // Specialization aggregation
    const specs = await Doctor.aggregate([
      {
        $group: {
          _id: '$specialization',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        statusCounts: statsObj,
        specializations: specs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list (with role filter)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }
    const users = await User.find(query).sort('-createdAt');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // If it's a doctor, also delete the Doctor profile
    if (user.role === 'doctor') {
      await Doctor.deleteOne({ userId: user._id });
    }

    // Delete appointments linked to user
    await Appointment.deleteMany({
      $or: [{ patientId: user._id }, { doctorId: user._id }]
    });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User and all associated profiles/records deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
