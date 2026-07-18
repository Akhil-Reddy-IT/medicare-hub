const express = require('express');
const {
  getSymptomAnalysis,
  getReportSummary,
  getHealthInformation,
  getWellnessRecommendations,
  getAIHistory
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Secure all AI endpoints

router.post('/symptom-analysis', getSymptomAnalysis);
router.post('/disease-prediction', getSymptomAnalysis); // Maps to the same symptom checker
router.post('/report-summary', getReportSummary);
router.post('/health-information', getHealthInformation);
router.post('/wellness-recommendations', getWellnessRecommendations);
router.get('/history', getAIHistory);

module.exports = router;
