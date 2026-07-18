const express = require('express');
const { getDoctors, getDoctorById, updateDoctorProfile, getDoctorByUserId } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.get('/user/:userId', getDoctorByUserId);

// Update doctor profile (only accessible to the logged-in doctor or admin)
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctorProfile);

module.exports = router;
