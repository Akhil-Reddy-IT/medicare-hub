import React, { useEffect, useState } from 'react';
import { doctorService, appointmentService } from '../services/api';
import Loader from '../components/Loader';
import { Search, Calendar, DollarSign, Stethoscope, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [specialization, setSpecialization] = useState('');
  const [search, setSearch] = useState('');
  const [feeMax, setFeeMax] = useState('');

  // Booking states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (specialization) params.specialization = specialization;
      if (search) params.search = search;
      if (feeMax) params.feeMax = feeMax;

      const res = await doctorService.list(params);
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, feeMax]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      setBookingStatus({ type: 'error', msg: 'Please select a date and time slot' });
      return;
    }

    setIsSubmitting(true);
    setBookingStatus({ type: '', msg: '' });
    try {
      const res = await appointmentService.create({
        doctorId: selectedDoctor._id,
        appointmentDate,
        appointmentTime,
        notes
      });

      if (res.data.success) {
        setBookingStatus({ type: 'success', msg: 'Appointment booked successfully!' });
        setTimeout(() => {
          navigate('/appointment-history');
        }, 1500);
      }
    } catch (error) {
      setBookingStatus({ 
        type: 'error', 
        msg: error.response?.data?.message || 'Double booking error. Try another slot.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Book Doctor Consultations</h2>
        <p className="text-xs text-navy-400 mt-1">Search medical professionals and secure slots instantly</p>
      </div>

      {/* Search & Filter Header bar */}
      <form onSubmit={handleSearchSubmit} className="p-4 rounded-xl bg-white border border-navy-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1.5 w-full">
          <label className="text-[10px] uppercase font-bold text-navy-400">Search Doctor Name</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              placeholder="e.g. Smith"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-navy-400">Specialty</label>
          <select 
            value={specialization} 
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="">All Specialties</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Neurologist">Neurologist</option>
          </select>
        </div>

        <div className="w-full md:w-36 space-y-1.5">
          <label className="text-[10px] uppercase font-bold text-navy-400">Max Fee (INR)</label>
          <input 
            type="number" 
            placeholder="e.g. 800"
            value={feeMax}
            onChange={(e) => setFeeMax(e.target.value)}
            className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
          />
        </div>

        <button 
          type="submit"
          className="w-full md:w-auto bg-hospital-500 hover:bg-hospital-600 text-white font-bold px-5 py-2.5 rounded-lg text-xs shadow-sm transition"
        >
          Apply Filter
        </button>
      </form>

      {/* Main split display: Doctor list vs Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor lists */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <Loader />
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center bg-white border border-navy-100 rounded-xl text-navy-400 text-sm">
              No doctors found matching your criteria. Try adjusting filters.
            </div>
          ) : (
            doctors.map((doc) => (
              <div 
                key={doc._id} 
                className={`p-5 rounded-2xl border transition bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:border-hospital-300 ${
                  selectedDoctor?._id === doc._id ? 'border-2 border-hospital-500 bg-hospital-50 bg-opacity-10' : 'border-navy-100'
                }`}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setAppointmentTime(''); // Reset selected time slot on doctor change
                }}
              >
                <div>
                  <h3 className="font-bold text-navy-950 flex items-center gap-2">
                    Dr. {doc.userId?.name || 'Medical Specialist'}
                  </h3>
                  <p className="text-xs text-hospital-600 font-semibold mt-0.5">{doc.specialization}</p>
                  
                  <div className="mt-3 space-y-1.5 text-xs text-navy-500">
                    <p className="flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-navy-400" />
                      {doc.experience} Years Experience • {doc.hospital}
                    </p>
                    <p className="flex items-center gap-1.5 font-semibold text-navy-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      Consultation Fee: {doc.consultationFee} INR
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoctor(doc);
                    setAppointmentTime('');
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${
                    selectedDoctor?._id === doc._id 
                      ? 'bg-hospital-500 text-white border-hospital-500' 
                      : 'border-navy-200 text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {selectedDoctor?._id === doc._id ? 'Selected' : 'Select Doctor'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Booking Form pane */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-2xl bg-white border border-navy-100 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-bold text-navy-900">Secure Consultation Slot</h3>
            
            {bookingStatus.msg && (
              <div className={`p-3 rounded-xl flex items-center gap-2 text-xs border ${
                bookingStatus.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {bookingStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{bookingStatus.msg}</span>
              </div>
            )}

            {selectedDoctor ? (
              <form onSubmit={handleBook} className="space-y-4">
                <div className="p-3 bg-navy-50 bg-opacity-40 rounded-xl border border-navy-50">
                  <p className="text-[10px] text-navy-400 font-bold uppercase">Booking With</p>
                  <p className="text-sm font-bold text-navy-800">Dr. {selectedDoctor.userId?.name}</p>
                  <p className="text-xs text-hospital-600 font-semibold">{selectedDoctor.specialization}</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1.5">
                    Appointment Date
                  </label>
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1.5">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDoctor.availableSlots?.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppointmentTime(slot)}
                        className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                          appointmentTime === slot 
                            ? 'bg-hospital-500 border-hospital-500 text-white' 
                            : 'border-navy-200 text-navy-700 hover:bg-navy-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-navy-400 uppercase mb-1.5">
                    Notes for Doctor (Optional)
                  </label>
                  <textarea 
                    placeholder="Brief description of consultation reason..."
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !appointmentTime}
                  className="w-full bg-hospital-500 hover:bg-hospital-600 disabled:bg-navy-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-xs shadow-sm transition"
                >
                  {isSubmitting ? 'Securing Slot...' : 'Confirm Appointment Booking'}
                </button>
              </form>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-navy-100 rounded-xl text-navy-400 text-xs">
                Select a doctor from the list to display slot booking options.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
