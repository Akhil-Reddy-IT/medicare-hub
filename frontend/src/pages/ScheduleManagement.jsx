import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/api';
import Loader from '../components/Loader';
import { CalendarRange, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const ScheduleManagement = () => {
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newSlot, setNewSlot] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await doctorService.getByUserId(user._id);
        if (res.data.success) {
          setDoctorProfile(res.data.doctor);
          setSlots(res.data.doctor.availableSlots || []);
        }
      } catch (error) {
        console.error('Error fetching doctor schedule details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [user]);

  const handleAddSlot = (e) => {
    e.preventDefault();
    if (!newSlot) return;

    // Check if slot already exists
    if (slots.includes(newSlot)) {
      setStatusMsg({ type: 'error', msg: 'Slot already exists' });
      return;
    }

    const updatedSlots = [...slots, newSlot].sort();
    setSlots(updatedSlots);
    setNewSlot('');
    saveSchedule(updatedSlots);
  };

  const handleDeleteSlot = (slotToRemove) => {
    const updatedSlots = slots.filter(slot => slot !== slotToRemove);
    setSlots(updatedSlots);
    saveSchedule(updatedSlots);
  };

  const saveSchedule = async (updatedSlots) => {
    if (!doctorProfile) return;

    setUpdating(true);
    setStatusMsg({ type: '', msg: '' });
    try {
      const res = await doctorService.update(doctorProfile._id, {
        availableSlots: updatedSlots
      });
      if (res.data.success) {
        setStatusMsg({ type: 'success', msg: 'Schedule updated successfully!' });
      }
    } catch (error) {
      setStatusMsg({ type: 'error', msg: 'Failed to save schedule slots.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Manage Consultation Schedule</h2>
        <p className="text-xs text-navy-400 mt-1">Configure your daily time slots for patient booking</p>
      </div>

      {statusMsg.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.msg}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-navy-950 text-sm flex items-center gap-2">
          <CalendarRange className="w-5 h-5 text-hospital-500" />
          Hourly Availability Slots
        </h3>

        {/* Add new slot form */}
        <form onSubmit={handleAddSlot} className="flex gap-2 items-end">
          <div className="flex-grow">
            <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1">Add Time Slot</label>
            <input 
              type="text" 
              placeholder="e.g. 11:30 AM or 05:00 PM"
              required
              value={newSlot}
              onChange={(e) => setNewSlot(e.target.value)}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
            />
          </div>
          <button
            type="submit"
            disabled={updating}
            className="bg-hospital-500 hover:bg-hospital-600 disabled:bg-navy-200 text-white font-bold p-2.5 rounded-lg text-xs flex items-center gap-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </form>

        {/* List active slots */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider">Active Slots ({slots.length})</h4>
          
          {slots.length === 0 ? (
            <p className="text-center py-6 text-navy-400 text-xs italic">No availability slots registered. Patients cannot book you.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {slots.map((slot) => (
                <div 
                  key={slot} 
                  className="p-3 rounded-xl border border-navy-50 bg-navy-50 bg-opacity-30 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-navy-800">{slot}</span>
                  <button
                    onClick={() => handleDeleteSlot(slot)}
                    disabled={updating}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Remove slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
