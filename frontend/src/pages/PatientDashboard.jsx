import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentService, recordService, aiService } from '../services/api';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import { Calendar, FileText, BrainCircuit, Activity, ChevronRight, MessageSquare } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [aiHistory, setAiHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, recRes, aiRes] = await Promise.all([
          appointmentService.list(),
          recordService.list(),
          aiService.history()
        ]);
        
        if (appRes.data.success) {
          // Filter only upcoming (pending or confirmed)
          const active = appRes.data.appointments.filter(
            app => app.status === 'pending' || app.status === 'confirmed'
          );
          setAppointments(active.slice(0, 3));
        }

        if (recRes.data.success) {
          setRecords(recRes.data.records.slice(0, 3));
        }

        if (aiRes.data.success) {
          setAiHistory(aiRes.data.history.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Top Banner Welcome */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-hospital-500 to-navy-800 text-white shadow">
        <h2 className="text-2xl font-bold">Hello, {user.name}!</h2>
        <p className="text-sm text-hospital-100 mt-1">
          Welcome to your personalized healthcare dashboard. Manage your records, appointments, and query Gemini AI helper.
        </p>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Appointments Card */}
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Upcoming Bookings</h3>
            <p className="text-2xl font-bold text-navy-800 mt-1">{appointments.length}</p>
            <Link to="/appointment-history" className="text-xs font-semibold text-hospital-600 hover:text-hospital-700 flex items-center gap-1 mt-2.5">
              View History
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Medical Vault Card */}
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Medical Records</h3>
            <p className="text-2xl font-bold text-navy-800 mt-1">{records.length}</p>
            <Link to="/medical-records" className="text-xs font-semibold text-hospital-600 hover:text-hospital-700 flex items-center gap-1 mt-2.5">
              Upload / View Vault
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* AI Inquiries */}
        <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">AI Assessments</h3>
            <p className="text-2xl font-bold text-navy-800 mt-1">{aiHistory.length}</p>
            <Link to="/symptom-checker" className="text-xs font-semibold text-hospital-600 hover:text-hospital-700 flex items-center gap-1 mt-2.5">
              Check Symptoms
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Content: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left main pane: Appointments & Reports (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Bookings List */}
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">Upcoming Appointments</h3>
              <Link to="/book-appointment" className="text-xs font-bold text-hospital-600 hover:underline">
                Book New Slot +
              </Link>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-8 text-navy-400 text-sm">
                No active bookings found. Select a doctor to secure a slot.
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((app) => (
                  <div key={app._id} className="p-4 rounded-xl bg-navy-50 bg-opacity-40 border border-navy-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        Dr. {app.doctorId?.userId?.name || 'General Doctor'}
                      </h4>
                      <p className="text-xs text-hospital-600 font-semibold">
                        {app.doctorId?.specialization || 'Consultation'}
                      </p>
                      <p className="text-xs text-navy-400 mt-1">
                        {new Date(app.appointmentDate).toLocaleDateString()} at {app.appointmentTime}
                      </p>
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                        app.status === 'confirmed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Records list */}
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-navy-900">Recent Medical Documents</h3>
              <Link to="/medical-records" className="text-xs font-bold text-hospital-600 hover:underline">
                Manage Vault
              </Link>
            </div>

            {records.length === 0 ? (
              <div className="text-center py-8 text-navy-400 text-sm">
                No documents uploaded. Securely host blood tests or recipes here.
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((rec) => (
                  <div key={rec._id} className="p-3 rounded-lg border border-navy-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-navy-800">{rec.reportName}</h4>
                        <p className="text-[10px] text-navy-400 uppercase font-bold tracking-wider">{rec.reportType}</p>
                      </div>
                    </div>
                    <a 
                      href={`http://localhost:5000${rec.fileUrl}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-hospital-600 font-bold hover:underline"
                    >
                      Open File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side panel: AI Insights & Quick Action links */}
        <div className="space-y-6">
          {/* Gemini quick tip panel */}
          <div className="p-6 rounded-2xl bg-purple-50 bg-opacity-60 border border-purple-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-purple-100 rounded-full bg-opacity-50 blur-xl"></div>
            <h3 className="font-bold text-purple-900 flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-purple-600 animate-pulse" />
              Latest AI Tip
            </h3>
            
            <div className="text-xs text-purple-950 leading-relaxed space-y-2">
              <p className="font-semibold bg-white bg-opacity-70 p-3 rounded-xl border border-purple-200">
                "Staying hydrated boosts cardiovascular elasticity and helps kidneys flush urea. Target 2.5 liters of mineral water daily."
              </p>
              <p className="text-[10px] text-purple-600 mt-2">
                Tips are lifestyle predictions only. Consult doctors before structural routine adjustments.
              </p>
            </div>
            
            <Link to="/health-insights" className="mt-4 flex items-center justify-center gap-1 bg-purple-600 text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-purple-700 transition">
              <MessageSquare className="w-3.5 h-3.5" />
              Ask Health Assistant
            </Link>
          </div>

          {/* Quick Access List */}
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm">
            <h3 className="font-bold text-navy-900 mb-4">Quick Health Services</h3>
            <div className="space-y-2">
              <Link to="/symptom-checker" className="flex items-center justify-between p-3 rounded-xl hover:bg-navy-50 border border-transparent hover:border-navy-100 transition">
                <span className="text-xs font-semibold text-navy-700">Check active symptoms</span>
                <ChevronRight className="w-4 h-4 text-navy-400" />
              </Link>
              <Link to="/medical-records" className="flex items-center justify-between p-3 rounded-xl hover:bg-navy-50 border border-transparent hover:border-navy-100 transition">
                <span className="text-xs font-semibold text-navy-700">Get Report Explained</span>
                <ChevronRight className="w-4 h-4 text-navy-400" />
              </Link>
              <Link to="/profile" className="flex items-center justify-between p-3 rounded-xl hover:bg-navy-50 border border-transparent hover:border-navy-100 transition">
                <span className="text-xs font-semibold text-navy-700">Update Profile Variables</span>
                <ChevronRight className="w-4 h-4 text-navy-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
