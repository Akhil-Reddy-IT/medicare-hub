import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Stethoscope, 
  BrainCircuit, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-navy-50 min-h-screen">
      {/* Top Navbar header */}
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-hospital-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <span className="text-xl font-bold text-navy-900">MediCare Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-navy-600 hover:text-hospital-600 px-3 py-2 transition">
            Login
          </Link>
          <Link to="/register" className="text-sm font-semibold bg-hospital-500 text-white hover:bg-hospital-600 px-4 py-2 rounded-lg transition shadow-sm">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hospital-50 border border-hospital-100 text-hospital-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Empowered by Google Gemini AI
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-navy-900 leading-tight">
            Next-Gen Smart <br />
            <span className="bg-gradient-to-r from-hospital-500 to-navy-700 bg-clip-text text-transparent">
              Healthcare Platform
            </span>
          </h1>
          <p className="mt-6 text-navy-600 text-md lg:text-lg leading-relaxed max-w-lg">
            MediCare Hub seamlessly connects patients, doctors, and administrators with secure records, instant slot bookings, and intelligent health insights powered by Gemini.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="flex items-center justify-center gap-2 bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-6 py-3.5 rounded-xl transition shadow-md hover:shadow-lg">
              Get Started Now
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="flex items-center justify-center bg-white hover:bg-navy-50 text-navy-700 border border-navy-200 font-bold px-6 py-3.5 rounded-xl transition">
              Portal Login
            </Link>
          </div>
        </div>
        
        {/* Hero Image Showcase / Graphic */}
        <div className="relative flex justify-center">
          <div className="w-full max-w-md h-96 bg-gradient-to-br from-hospital-400 to-navy-800 rounded-3xl overflow-hidden shadow-2xl relative flex items-center justify-center p-8 text-white">
            <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[2px]"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-6">
                <BrainCircuit className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Gemini AI Assistant</h3>
              <p className="text-sm text-hospital-50 opacity-90 max-w-xs mx-auto">
                Get symptom breakdowns, check possible conditions, understand medical reports, and receive diet recommendations instantly.
              </p>
              <div className="mt-6 inline-block bg-white text-hospital-700 text-xs font-bold px-4 py-2 rounded-full shadow">
                Try AI Symptom Checker
              </div>
            </div>
            
            {/* Float badges */}
            <div className="absolute top-8 left-8 bg-white text-navy-900 rounded-xl p-3 shadow-md flex items-center gap-2.5 transform -rotate-3 hover:rotate-0 transition duration-300">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="text-xs font-bold">100% Patient Centric</span>
            </div>
            <div className="absolute bottom-8 right-8 bg-white text-navy-900 rounded-xl p-3 shadow-md flex items-center gap-2.5 transform rotate-3 hover:rotate-0 transition duration-300">
              <ShieldCheck className="w-5 h-5 text-hospital-500" />
              <span className="text-xs font-bold">Secure HIPAA Vault</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-16 lg:py-24 border-t border-navy-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-navy-900">Comprehensive Healthcare Modules</h2>
            <p className="mt-4 text-navy-600">
              We provide digital capabilities to unify clinics, schedule consultations, and explain reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-navy-100 hover:border-hospital-200 hover:shadow-lg transition bg-navy-50 bg-opacity-20">
              <div className="w-12 h-12 rounded-xl bg-hospital-100 flex items-center justify-center text-hospital-600 mb-6">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Unified Appointment Booking</h3>
              <p className="mt-3 text-sm text-navy-600 leading-relaxed">
                Patients search doctors by specialty, filter by fee, and select active time slots. Doctors manage their schedule utility seamlessly.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-navy-100 hover:border-hospital-200 hover:shadow-lg transition bg-navy-50 bg-opacity-20">
              <div className="w-12 h-12 rounded-xl bg-hospital-100 flex items-center justify-center text-hospital-600 mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Gemini AI Symptom Analysis</h3>
              <p className="mt-3 text-sm text-navy-600 leading-relaxed">
                Enter your symptoms to understand probable conditions, suggested precautions, and safety alerts. Read clear layman summaries of blood panel PDFs.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-navy-100 hover:border-hospital-200 hover:shadow-lg transition bg-navy-50 bg-opacity-20">
              <div className="w-12 h-12 rounded-xl bg-hospital-100 flex items-center justify-center text-hospital-600 mb-6">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-navy-900">Role-Based Dashboard Portals</h3>
              <p className="mt-3 text-sm text-navy-600 leading-relaxed">
                Interactive control centers for Patients (records & slots), Doctors (appointments & patient notes), and Administrators (system analytics).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-navy-300">© 2026 MediCare Hub. All Rights Reserved. Powered by Gemini AI.</p>
          <p className="text-xs text-navy-500 mt-2">Disclaimer: AI suggestions are for educational purposes and do not replace formal clinical assessment.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
