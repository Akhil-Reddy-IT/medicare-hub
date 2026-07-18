import React, { useState } from 'react';
import { aiService } from '../services/api';
import Loader from '../components/Loader';
import { 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle,
  FileCheck,
  Stethoscope,
  Info
} from 'lucide-react';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setErrorMsg('Please describe your symptoms.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await aiService.symptomAnalysis(symptoms);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (error) {
      setErrorMsg('Failed to fetch symptom analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Gemini AI Symptom Checker</h2>
        <p className="text-xs text-navy-400 mt-1">
          Describe what you feel and get an instantaneous clinical conditions assessment
        </p>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex gap-3">
        <Info className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Important Medical Notice & Disclaimer</p>
          <p className="mt-1 leading-relaxed text-amber-800">
            This symptom checker utilizes Google Gemini AI to offer general informational wellness guidance. It is **NOT** a substitute for professional medical diagnosis, clinical evaluation, or treatment advice. Always seek immediate emergency medical care if you experience chest pain, severe shortness of breath, or sudden motor dysfunction.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Input Form (Col span 1) */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAnalyze} className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm space-y-4">
            <h3 className="font-bold text-navy-950 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-hospital-500" />
              Symptom Description
            </h3>

            <div>
              <label className="block text-[10px] font-bold text-navy-400 uppercase mb-2">
                What are you experiencing?
              </label>
              <textarea 
                rows="4" 
                placeholder="e.g. Mild fever, dry cough, and headache for past 2 days."
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full px-3 py-2.5 border border-navy-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500 focus:bg-white transition"
              ></textarea>
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-hospital-500 hover:bg-hospital-600 text-white font-bold py-3 rounded-lg text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI Analyzing symptoms...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Symptoms</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: AI Analysis Output Results (Col span 2) */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm space-y-6 animate-fadeIn">
              {/* Top Banner: Risk Level */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${getRiskColor(result.riskLevel)}`}>
                <div>
                  <h4 className="text-xs uppercase font-bold tracking-wider opacity-70">AI Risk Assessment</h4>
                  <p className="text-xl font-black mt-0.5">{result.riskLevel} Severity Risk</p>
                </div>
                
                {result.doctorConsultationNeeded && (
                  <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm">
                    <ShieldAlert className="w-4 h-4" />
                    Doctor Consultation Advised
                  </div>
                )}
              </div>

              {/* Conditions List */}
              <div className="space-y-3">
                <h3 className="font-bold text-navy-950 text-sm">Potential Health Conditions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.conditions?.map((cond, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-navy-100 bg-navy-50 bg-opacity-20">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-xs font-bold text-navy-800">{cond.name}</h4>
                        <span className="text-[10px] font-bold bg-hospital-50 text-hospital-700 px-2 py-0.5 rounded-full border border-hospital-200">
                          {cond.probability} Match
                        </span>
                      </div>
                      <p className="text-[11px] text-navy-500 leading-relaxed mt-1.5">{cond.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions Accordion list */}
              <div className="space-y-3">
                <h3 className="font-bold text-navy-950 text-sm">Recommended Precautionary Steps</h3>
                <ul className="space-y-2">
                  {result.precautions?.map((prec, idx) => (
                    <li key={idx} className="text-xs text-navy-700 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-[10px] text-navy-400 italic border-t border-navy-50 pt-4 mt-4">
                *The analysis above is a machine-generated suggestion and is provided strictly for educational purposes.
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border-2 border-dashed border-navy-200 bg-white rounded-2xl flex flex-col items-center justify-center p-8 text-center text-navy-400">
              <HelpCircle className="w-12 h-12 text-navy-300 mb-3" />
              <h3 className="text-sm font-bold text-navy-800">No Assessment Ready</h3>
              <p className="text-xs text-navy-500 max-w-sm mt-1">
                Enter details regarding what symptoms you are experiencing in the form on the left to activate Gemini AI analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
