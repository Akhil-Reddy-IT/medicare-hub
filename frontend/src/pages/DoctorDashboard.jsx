import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/api';
import Loader from '../components/Loader';
import { Calendar, User, Clock, FileEdit, AlertCircle, CheckCircle, Search } from 'lucide-react';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Selected appointment for consulting
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [status, setStatus] = useState('completed');
  const [notes, setNotes] = useState('');
  
  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.list();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenConsultation = (app) => {
    setActiveConsultation(app);
    setPrescription(app.prescription || '');
    setNotes(app.notes || '');
    setStatus(app.status || 'completed');
    setStatusMsg({ type: '', msg: '' });
  };

  const handleSaveConsultation = async (e) => {
    e.preventDefault();
    if (!activeConsultation) return;

    setSaving(true);
    setStatusMsg({ type: '', msg: '' });
    try {
      const res = await appointmentService.update(activeConsultation._id, {
        status,
        prescription,
        notes
      });

      if (res.data.success) {
        setStatusMsg({ type: 'success', msg: 'Consultation record updated successfully!' });
        fetchAppointments();
        // Keep selected but update contents
        setActiveConsultation(res.data.appointment);
      }
    } catch (error) {
      setStatusMsg({ type: 'error', msg: 'Failed to update consultation.' });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-navy-50 text-navy-800 border-navy-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Doctor Consultation Desk</h2>
        <p className="text-xs text-navy-400 mt-1">Review booked patients and submit prescriptions/notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bookings list (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-navy-950 mb-4">Patient Consultations</h3>
            
            {appointments.length === 0 ? (
              <p className="text-center py-12 text-navy-400 text-xs">No slot bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Patient Details</th>
                      <th className="py-3 px-2">Date/Time Slot</th>
                      <th className="py-3 px-2">Current Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-50">
                    {appointments.map((app) => (
                      <tr 
                        key={app._id} 
                        className={`hover:bg-navy-50 hover:bg-opacity-50 transition cursor-pointer ${
                          activeConsultation?._id === app._id ? 'bg-hospital-50 bg-opacity-20' : ''
                        }`}
                        onClick={() => handleOpenConsultation(app)}
                      >
                        <td className="py-4 px-2">
                          <div className="font-bold text-navy-800">{app.patientId?.name || 'Guest Patient'}</div>
                          <div className="text-[10px] text-navy-400">
                            Age: {app.patientId?.age || 'N/A'} • {app.patientId?.gender || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 px-2 text-navy-600">
                          <div>{new Date(app.appointmentDate).toLocaleDateString()}</div>
                          <div className="text-[10px] text-navy-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {app.appointmentTime}
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenConsultation(app);
                            }}
                            className="bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] shadow-sm transition"
                          >
                            Diagnose
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Diagnosis & Consultation Card Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-bold text-navy-950 flex items-center gap-2 border-b border-navy-50 pb-3">
              <FileEdit className="w-4 h-4 text-hospital-600" />
              Prescription & Diagnosis
            </h3>

            {statusMsg.msg && (
              <div className={`p-3 rounded-lg text-xs border flex items-center gap-2 ${
                statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{statusMsg.msg}</span>
              </div>
            )}

            {activeConsultation ? (
              <form onSubmit={handleSaveConsultation} className="space-y-4">
                <div className="p-3 bg-navy-50 bg-opacity-40 rounded-xl border border-navy-50 text-xs">
                  <p className="text-[10px] text-navy-400 font-bold uppercase">Diagnosing Patient</p>
                  <p className="font-bold text-navy-800">{activeConsultation.patientId?.name}</p>
                  {activeConsultation.notes && (
                    <p className="mt-2 text-navy-500 italic">"Symptom notes: {activeConsultation.notes}"</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Consultation Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Clinical Notes</label>
                  <textarea 
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Physical findings, symptoms observed..."
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Prescription Details</label>
                  <textarea 
                    rows="4"
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                    placeholder="e.g. Paracetamol 500mg - 1-0-1 after food for 3 days."
                    className="w-full px-3 py-2 border border-navy-200 font-mono text-[11px] rounded-lg focus:outline-none focus:ring-1 focus:ring-hospital-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-hospital-500 hover:bg-hospital-600 text-white font-bold py-2.5 rounded-lg text-xs shadow-sm transition"
                >
                  {saving ? 'Updating records...' : 'Submit Consultation Record'}
                </button>
              </form>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-navy-100 rounded-xl text-navy-400 text-xs">
                Select a patient booking from the list on the left to begin consultation recording.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
