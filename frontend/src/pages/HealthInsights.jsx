import React, { useState } from 'react';
import { aiService } from '../services/api';
import Loader from '../components/Loader';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  Activity, 
  Scale, 
  Compass, 
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

const HealthInsights = () => {
  // Q&A States
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [qaLoading, setQaLoading] = useState(false);

  // Wellness States
  const [lifestyle, setLifestyle] = useState('');
  const [wellnessPlan, setWellnessPlan] = useState('');
  const [wellLoading, setWellLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setQaLoading(true);
    setAnswer('');
    try {
      const res = await aiService.healthInformation(question);
      if (res.data.success) {
        setAnswer(res.data.answer);
      }
    } catch (error) {
      setAnswer('AI assistant failed to answer. Please try another health topic.');
    } finally {
      setQaLoading(false);
    }
  };

  const handleGetWellness = async (e) => {
    e.preventDefault();
    if (!lifestyle.trim()) return;

    setWellLoading(true);
    setWellnessPlan('');
    try {
      const res = await aiService.wellnessRecommendations(lifestyle);
      if (res.data.success) {
        setWellnessPlan(res.data.recommendations);
      }
    } catch (error) {
      setWellnessPlan('Failed to generate wellness advice. Please try again.');
    } finally {
      setWellLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Gemini AI Health Insights & Assistant</h2>
        <p className="text-xs text-navy-400 mt-1">Get answers to health questions and personalized lifestyle tips</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Q&A Assistant Section */}
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm flex flex-col min-h-[480px]">
          <h3 className="font-bold text-navy-950 flex items-center gap-2 border-b border-navy-50 pb-3">
            <HelpCircle className="w-5 h-5 text-hospital-500" />
            General Health Q&A Assistant
          </h3>
          <p className="text-[10px] text-navy-400 mt-1 mb-4">
            Ask any medical educational questions (e.g. causes of high cholesterol, diabetes management, sleeping tips).
          </p>

          {/* Q&A Output Screen */}
          <div className="flex-1 overflow-y-auto p-4 rounded-xl border border-navy-100 bg-navy-50 bg-opacity-25 text-xs text-navy-800 leading-relaxed max-h-[300px] whitespace-pre-wrap">
            {qaLoading ? (
              <Loader size="sm" />
            ) : answer ? (
              <div className="prose text-[11px] font-sans">{answer}</div>
            ) : (
              <p className="text-center text-navy-400 py-24 italic">Type your health query below to receive answer insights.</p>
            )}
          </div>

          {/* Q&A Input Input */}
          <form onSubmit={handleAsk} className="mt-4 flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. How does stress trigger headaches?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="flex-grow px-3 py-2.5 border border-navy-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
            />
            <button 
              type="submit" 
              disabled={qaLoading}
              className="bg-hospital-500 hover:bg-hospital-600 text-white p-2.5 rounded-xl transition flex items-center justify-center disabled:bg-navy-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Wellness Recommendations Section */}
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm flex flex-col min-h-[480px]">
          <h3 className="font-bold text-navy-950 flex items-center gap-2 border-b border-navy-50 pb-3">
            <Compass className="w-5 h-5 text-purple-600" />
            Personalized Wellness Coach
          </h3>
          <p className="text-[10px] text-navy-400 mt-1 mb-4">
            Input details about your diet, workouts, and work environments to generate a custom wellness lifestyle plan.
          </p>

          {/* Wellness Plan Output Screen */}
          <div className="flex-1 overflow-y-auto p-4 rounded-xl border border-navy-100 bg-navy-50 bg-opacity-25 text-xs text-navy-800 leading-relaxed max-h-[300px] whitespace-pre-wrap">
            {wellLoading ? (
              <Loader size="sm" />
            ) : wellnessPlan ? (
              <div className="prose text-[11px] font-sans">{wellnessPlan}</div>
            ) : (
              <p className="text-center text-navy-400 py-24 italic">Submit your lifestyle profile below to generate coach advice.</p>
            )}
          </div>

          {/* Wellness Form Input */}
          <form onSubmit={handleGetWellness} className="mt-4 space-y-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Desk job, exercises 2x/wk, wants to improve core and limit sugar."
                value={lifestyle}
                onChange={(e) => setLifestyle(e.target.value)}
                required
                className="flex-grow px-3 py-2.5 border border-navy-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
              />
              <button 
                type="submit" 
                disabled={wellLoading}
                className="bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-4 rounded-xl text-xs transition disabled:bg-navy-200 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Coach</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;
