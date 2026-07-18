import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/api';
import Loader from '../components/Loader';
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, AlertTriangle, Pill } from 'lucide-react';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rescheduleData, setRescheduleData] = useState({ id: '', date: '', time: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.list();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const res = await appointmentService.update(id, { status: 'cancelled' });
      if (res.data.success) {
        setStatusMsg({ type: 'success', msg: 'Appointment cancelled successfully!' });
        fetchAppointments();
      }
    } catch (error) {
      setStatusMsg({ type: 'error', msg: 'Failed to cancel appointment.' });
    }
  };

  const handleRescheduleSubmit = async (e, id) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.time) return;

    try {
      const res = await appointmentService.update(id, {
        appointmentDate: rescheduleData.date,
        appointmentTime: rescheduleData.time,
        status: 'pending' // Reverts back to pending for doctor review
      });
      if (res.data.success) {
        setStatusMsg({ type: 'success', msg: 'Rescheduled successfully! Awaiting confirmation.' });
        setRescheduleData({ id: '', date: '', time: '' });
        fetchAppointments();
      }
    } catch (error) {
      setStatusMsg({ type: 'error', msg: error.response?.data?.message || 'Reschedule failed.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-navy-50 text-navy-800 border-navy-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'; // pending
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Your Appointment History</h2>
          <p className="text-xs text-navy-400 mt-1">Review active and completed doctor visits</p>
        </div>
      </div>

      {statusMsg.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 max-w-md ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.msg}</span>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-navy-100 rounded-2xl text-navy-400 text-sm">
          No appointments found. Start booking medical visits now.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {appointments.map((app) => (
            <div key={app._id} className="p-6 rounded-2xl border border-navy-100 bg-white shadow-sm flex flex-col lg:flex-row gap-6 justify-between">
              {/* Left Column: Doctor Profile & Appointment info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-hospital-100 text-hospital-700 font-bold flex items-center justify-center text-lg overflow-hidden border border-hospital-200">
                    {app.doctorId?.userId?.profileImage ? (
                      <img src={`http://localhost:5000${app.doctorId.userId.profileImage}`} alt="doc" className="w-full h-full object-cover" />
                    ) : (
                      <span>D</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-950">Dr. {app.doctorId?.userId?.name || 'Medical Specialist'}</h3>
                    <p className="text-xs text-hospital-600 font-semibold">{app.doctorId?.specialization || 'Consultation'}</p>
                    <p className="text-xs text-navy-400 mt-0.5">{app.doctorId?.hospital}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2 text-navy-700">
                    <Calendar className="w-4 h-4 text-navy-400" />
                    <span>Date: {new Date(app.appointmentDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-navy-700">
                    <Clock className="w-4 h-4 text-navy-400" />
                    <span>Time Slot: {app.appointmentTime}</span>
                  </div>
                </div>

                {app.notes && (
                  <div className="p-3 bg-navy-50 bg-opacity-30 rounded-xl text-xs text-navy-600">
                    <p className="font-semibold text-[10px] uppercase text-navy-400 tracking-wider">Your Symptom notes</p>
                    <p className="mt-1">"{app.notes}"</p>
                  </div>
                )}
              </div>

              {/* Right Column: Status & Prescription (if completed) */}
              <div className="lg:w-80 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-navy-100 pt-4 lg:pt-0 lg:pl-6 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-navy-400">Appointment Status</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  {app.status === 'completed' && app.prescription && (
                    <div className="p-3 rounded-xl bg-hospital-50 border border-hospital-100 text-xs text-hospital-950">
                      <div className="flex items-center gap-1.5 font-bold text-hospital-700 mb-1">
                        <Pill className="w-4 h-4" />
                        <span>Prescription & Advice</span>
                      </div>
                      <p className="whitespace-pre-line text-navy-800 leading-relaxed font-mono text-[11px]">
                        {app.prescription}
                      </p>
                    </div>
                  )}

                  {app.status === 'completed' && !app.prescription && (
                    <p className="text-[11px] text-navy-400 italic">No prescription was filed by the physician.</p>
                  )}
                </div>

                {/* Patient Reschedule Form or Cancel buttons */}
                {rescheduleData.id === app._id ? (
                  <form onSubmit={(e) => handleRescheduleSubmit(e, app._id)} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={rescheduleData.date}
                        onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                        className="px-2 py-1.5 border border-navy-200 rounded-lg text-[10px] focus:outline-none bg-white"
                      />
                      <select
                        required
                        value={rescheduleData.time}
                        onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                        className="px-2 py-1.5 border border-navy-200 rounded-lg text-[10px] bg-white focus:outline-none"
                      >
                        <option value="">Time Slot</option>
                        <option value="09:00 AM">09:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="03:00 PM">03:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-hospital-500 hover:bg-hospital-600 text-white font-bold py-1.5 rounded-lg text-[10px] transition">
                        Confirm
                      </button>
                      <button type="button" onClick={() => setRescheduleData({ id: '', date: '', time: '' })} className="flex-1 bg-navy-100 hover:bg-navy-200 text-navy-700 py-1.5 rounded-lg text-[10px] transition">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  (app.status === 'pending' || app.status === 'confirmed') && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setRescheduleData({ id: app._id, date: '', time: '' })}
                        className="flex-1 bg-white hover:bg-navy-50 text-navy-700 border border-navy-200 font-bold py-2 rounded-lg text-[10px] transition"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => handleCancel(app._id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-bold py-2 rounded-lg text-[10px] transition"
                      >
                        Cancel Visit
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
