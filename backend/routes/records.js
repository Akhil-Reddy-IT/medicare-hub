const express = require('express');
const { uploadRecord, getRecords, deleteRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(protect); // Secure all record routes

router.post('/upload', upload.single('file'), uploadRecord);
router.get('/', getRecords);
router.delete('/:id', deleteRecord);

module.exports = router;
