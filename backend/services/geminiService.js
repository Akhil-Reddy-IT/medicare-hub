const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK if API key exists
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not defined. Running in mock offline mode.');
}

/**
 * Service to analyze symptoms using Gemini
 */
const analyzeSymptoms = async (symptoms) => {
  if (!genAI) {
    return getMockSymptomAnalysis(symptoms);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      You are an expert AI medical assistant. Analyze these symptoms: "${symptoms}".
      You must respond ONLY with a JSON object. The object must follow this schema:
      {
        "conditions": [
          { "name": "Condition Name", "probability": "Percentage (e.g. 70%)", "description": "Brief explanation" }
        ],
        "riskLevel": "Low | Medium | High",
        "precautions": ["precaution 1", "precaution 2"],
        "doctorConsultationNeeded": true/false
      }
      Do not include any markdown syntax like \`\`\`json or backticks in the response. Just return the JSON object.
      DISCLAIMER: Keep in mind this is informational only.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Parse response cleanly
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Symptom Analysis Error:', error);
    return getMockSymptomAnalysis(symptoms);
  }
};

/**
 * Service to explain a medical report text
 */
const summarizeMedicalReport = async (reportText) => {
  if (!genAI) {
    return getMockReportSummary(reportText);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert medical interpreter. A patient has provided the text extracted from their medical report:
      "${reportText}"
      
      Summarize this report in layperson terms.
      Your response should be formatted in Markdown and contain:
      1. A short **Executive Summary** (1-2 sentences).
      2. **Key Findings & Test Markers** (explain what the markers like WBC, Hemoglobin, Cholesterol mean, and highlight any values that seem abnormal, high, or low).
      3. **Simple Explanation of Medical Terms** used in the report.
      4. **Suggested Next Steps** (e.g. consulting a doctor, diet changes, repeat test).
      
      Start with a bold disclaimer: "**Disclaimer: This AI summary is for educational and informational purposes only and is not a professional medical diagnosis or a substitute for a doctor's advice.**"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Report Summary Error:', error);
    return getMockReportSummary(reportText);
  }
};

/**
 * Service to answer general health queries
 */
const askHealthQuestion = async (question) => {
  if (!genAI) {
    return getMockHealthAnswer(question);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a friendly and educational health assistant. Answer the following general question: "${question}".
      Provide a helpful, educational response in clean Markdown. Break it down into causes, prevention, and home management where appropriate.
      
      Always end the response with:
      "*Disclaimer: This information is for educational purposes only. Please consult a qualified healthcare professional for personalized medical advice.*"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Health Assistant Error:', error);
    return getMockHealthAnswer(question);
  }
};

/**
 * Service to generate wellness and lifestyle recommendations
 */
const getWellnessRecommendations = async (age, gender, lifestyle) => {
  if (!genAI) {
    return getMockWellnessRecommendations(age, gender, lifestyle);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are a professional nutritionist and wellness coach.
      Generate personalized wellness recommendations for a client with the following profile:
      - Age: ${age || 'N/A'}
      - Gender: ${gender || 'N/A'}
      - Lifestyle / Diet / Goals: ${lifestyle || 'Active, wants to stay fit'}

      Generate a structured markdown guide covering:
      1. **Diet Suggestions**: Tailored meals or macronutrient focuses.
      2. **Fitness & Exercise Tips**: Workout types and frequencies suitable for age/lifestyle.
      3. **Hydration Recommendations**: Target daily water intake and electrolyte tips.
      4. **Healthy Lifestyle Advice**: Stress management, sleep duration, and wellness tips.
      
      Always start with a brief welcome and end with:
      "*Disclaimer: These suggestions are lifestyle-oriented and do not replace professional dietetic or medical counsel.*"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Wellness Error:', error);
    return getMockWellnessRecommendations(age, gender, lifestyle);
  }
};

// --- MOCK FALLBACK DATA IMPLEMENTATIONS ---

function getMockSymptomAnalysis(symptoms) {
  const query = symptoms.toLowerCase();
  let conditions = [];
  let riskLevel = 'Low';
  let precautions = [];
  let doctorConsultationNeeded = false;

  if (query.includes('fever') || query.includes('cough') || query.includes('headache')) {
    conditions = [
      { name: 'Common Cold', probability: '65%', description: 'A common viral infection of the nose and throat.' },
      { name: 'Influenza (Flu)', probability: '45%', description: 'A contagious respiratory illness caused by influenza viruses.' },
      { name: 'Mild Viral Infection', probability: '30%', description: 'A temporary virus triggering immune response.' }
    ];
    riskLevel = 'Medium';
    precautions = ['Stay well hydrated', 'Get plenty of bed rest', 'Take paracetamol for fever reduction if safe', 'Monitor temperature'];
    doctorConsultationNeeded = false;
  } else if (query.includes('chest pain') || query.includes('shortness of breath') || query.includes('breathing')) {
    conditions = [
      { name: 'Angina / Cardiac Strain', probability: '50%', description: 'Reduced blood flow to the heart muscle causing chest pain.' },
      { name: 'Acid Reflux / GERD', probability: '30%', description: 'Stomach acid flowing back into the esophagus.' },
      { name: 'Anxiety Hyperventilation', probability: '20%', description: 'Stress-induced rapid breathing.' }
    ];
    riskLevel = 'High';
    precautions = ['Avoid strenuous physical activity immediately', 'Sit upright in a well-ventilated room', 'Seek immediate emergency medical attention'];
    doctorConsultationNeeded = true;
  } else {
    conditions = [
      { name: 'Mild Fatigue / General Malaise', probability: '80%', description: 'Could be related to insufficient sleep, stress, or minor immune challenges.' }
    ];
    riskLevel = 'Low';
    precautions = ['Ensure 7-8 hours of sound sleep', 'Maintain a balanced diet', 'Stay hydrated'];
    doctorConsultationNeeded = false;
  }

  return {
    conditions,
    riskLevel,
    precautions,
    doctorConsultationNeeded,
    isMock: true
  };
}

function getMockReportSummary(reportText) {
  return `
**Disclaimer: This AI summary is for educational and informational purposes only and is not a professional medical diagnosis or a substitute for a doctor's advice.**

### 📋 Executive Summary
The submitted medical document appears to represent a blood panels/chemistry test. Key indicators are largely within standard physiological parameters, with a minor elevation in cholesterol levels requiring dietary attention.

### 🔍 Key Findings & Test Markers
- **Hemoglobin (14.2 g/dL)**: *Normal*. Indicates adequate oxygen-carrying capacity of red blood cells.
- **White Blood Cell (WBC) Count (6,500 /uL)**: *Normal*. Suggests no active bacterial or viral infection.
- **Total Cholesterol (245 mg/dL)**: *High (Borderline Elevated)*. Desirable range is below 200 mg/dL. This could indicate a need to limit saturated fats and increase fiber.
- **Fasting Glucose (92 mg/dL)**: *Normal*. Falls safely within the 70-99 mg/dL healthy fasting range.

### 📖 Explanation of Medical Terms
- **WBC**: Immune system cells responsible for fighting infections.
- **Hemoglobin**: The iron-rich protein in red blood cells that transports oxygen.
- **Cholesterol**: A waxy substance used to build cells, but elevated levels can lead to cardiovascular plaque.

### 🚀 Suggested Next Steps
1. **Dietary Adjustments**: Incorporate oats, garlic, olive oil, and leafy greens to naturally manage cholesterol.
2. **Consultation**: Show this report to your physician at your next routine checkup to discuss whether a full lipid profile (HDL, LDL, Triglycerides) is recommended.
  `;
}

function getMockHealthAnswer(question) {
  const query = question.toLowerCase();
  
  if (query.includes('diabetes')) {
    return `
### 🩺 What is Diabetes?
Diabetes is a chronic (long-lasting) health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin.

#### Types of Diabetes
1. **Type 1 Diabetes**: The body does not produce insulin because the immune system mistakenly attacks pancreatic cells.
2. **Type 2 Diabetes**: The body doesn't use insulin well (insulin resistance) and can't keep blood sugar at normal levels. Highly associated with lifestyle factors.

#### Management & Prevention
* Maintain a balanced, low-glycemic diet.
* Engage in at least 150 minutes of moderate activity weekly.
* Monitor blood glucose levels regularly.

*Disclaimer: This information is for educational purposes only. Please consult a qualified healthcare professional for personalized medical advice.*
    `;
  }
  
  return `
### 💡 Health Information: "${question}"
Thank you for your question. Here is an educational breakdown of the topics surrounding this health query:

#### General Overview
Understanding health conditions, their root causes, and lifestyle associations is key to long-term wellness. Many minor health symptoms (like headaches, fatigue, or stress) are the body's natural signals for hydration, rest, or dietary imbalances.

#### Essential Tips
- **Hydration**: Drink 2-3 liters of clean water daily.
- **Rest**: Maintain regular sleep cycles.
- **Active Lifestyle**: Take walks, stretch, and reduce prolonged sitting.

*Disclaimer: This information is for educational purposes only. Please consult a qualified healthcare professional for personalized medical advice.*
  `;
}

function getMockWellnessRecommendations(age, gender, lifestyle) {
  return `
### 🌟 Your Personalized Wellness Recommendations
Welcome to your health plan! Here are customized recommendations designed for a **${age || 'N/A'}-year-old ${gender || 'N/A'}** with lifestyle objectives: *"${lifestyle || 'General Wellness'}"*.

#### 🥦 1. Diet Suggestions
- **Protein Intake**: Focus on lean protein sources (chicken breast, fish, tofu, legumes) to support muscle recovery and metabolic rate.
- **Fiber & Veggies**: Aim for at least 5 servings of vegetables daily. Add complex carbs (quinoa, brown rice, sweet potatoes).
- **Limit Processed Foods**: Minimize refined sugars and high-sodium snacks to maintain energetic stability.

#### 🏃‍♂️ 2. Fitness & Exercise Tips
- **Cardiovascular Workouts**: Engage in 30 minutes of brisk walking, jogging, or cycling 3 times a week.
- **Strength Training**: Integrate light resistance bands or bodyweight exercises (squats, planks, pushups) twice a week to maintain bone density and muscle mass.
- **Consistency**: The key is moving every day. Take the stairs instead of the elevator.

#### 💧 3. Hydration Recommendations
- **Daily Target**: Drink approximately 8-10 glasses (2.5 liters) of water daily.
- **Physical Activity Adjustment**: Add an extra 500ml of water for every 45 minutes of active sweating.
- **Morning Routine**: Start your day with a tall glass of lukewarm water.

#### 🧘 4. Healthy Lifestyle Advice
- **Sleep Quality**: Secure 7-8 hours of uninterrupted sleep. Avoid blue-light screens 1 hour before bedtime.
- **Mindfulness**: Spend 5-10 minutes practicing deep breathing or meditation to mitigate daily cortisol (stress) spikes.

*Disclaimer: These suggestions are lifestyle-oriented and do not replace professional dietetic or medical counsel.*
  `;
}

module.exports = {
  analyzeSymptoms,
  summarizeMedicalReport,
  askHealthQuestion,
  getWellnessRecommendations
};
