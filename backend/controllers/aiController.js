const AIHistory = require('../models/AIHistory');
const MedicalRecord = require('../models/MedicalRecord');
const geminiService = require('../services/geminiService');

// @desc    Analyze symptoms using Gemini AI
// @route   POST /api/ai/symptom-analysis
// @access  Private (Patient/Doctor)
exports.getSymptomAnalysis = async (req, res, next) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      res.status(400);
      throw new Error('Please provide symptoms string');
    }

    const analysis = await geminiService.analyzeSymptoms(symptoms);

    // Save to AI History database
    await AIHistory.create({
      userId: req.user.id,
      symptoms,
      predictionResult: analysis
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Summarize and explain medical reports
// @route   POST /api/ai/report-summary
// @access  Private
exports.getReportSummary = async (req, res, next) => {
  try {
    const { reportText, recordId } = req.body;
    let textToAnalyze = reportText;

    // If a recordId is specified, retrieve the record
    if (recordId && !textToAnalyze) {
      const record = await MedicalRecord.findById(recordId);
      if (!record) {
        res.status(404);
        throw new Error('Medical record file not found');
      }
      
      // Simulate text extraction based on file name or type
      textToAnalyze = `Report Name: ${record.reportName}. File Type: ${record.reportType}. Simulating diagnostic analysis on laboratory tests. Patient ID: ${record.patientId}`;
    }

    if (!textToAnalyze) {
      res.status(400);
      throw new Error('Please provide reportText or recordId');
    }

    const summary = await geminiService.summarizeMedicalReport(textToAnalyze);

    // Save to AI History database
    await AIHistory.create({
      userId: req.user.id,
      symptoms: 'Medical Report: ' + (recordId || 'Pasted Text'),
      reportSummary: summary
    });

    res.json({
      success: true,
      summary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ask general health questions
// @route   POST /api/ai/health-information
// @access  Private
exports.getHealthInformation = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      res.status(400);
      throw new Error('Please provide a health question');
    }

    const answer = await geminiService.askHealthQuestion(question);

    res.json({
      success: true,
      answer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized wellness recommendations
// @route   POST /api/ai/wellness-recommendations
// @access  Private
exports.getWellnessRecommendations = async (req, res, next) => {
  try {
    const { lifestyle } = req.body;

    // Retrieve user age & gender from req.user
    const age = req.user.age;
    const gender = req.user.gender;

    const recommendations = await geminiService.getWellnessRecommendations(age, gender, lifestyle);

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI analysis history for user
// @route   GET /api/ai/history
// @access  Private
exports.getAIHistory = async (req, res, next) => {
  try {
    const history = await AIHistory.find({ userId: req.user.id }).sort('-createdAt');
    res.json({
      success: true,
      count: history.length,
      history
    });
  } catch (error) {
    next(error);
  }
};
