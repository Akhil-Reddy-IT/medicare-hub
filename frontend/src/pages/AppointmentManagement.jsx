import React, { useEffect, useState } from 'react';
import { appointmentService } from '../services/api';
import Loader from '../components/Loader';
import { Clock, Calendar, CheckCircle2, AlertCircle, Trash2, ShieldAlert } from 'lucide-react';

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [notification, setNotification] = useState({ type: '', msg: '' });

  const fetchAppointments = async () => {
    try {
      const res = await appointmentService.list();
      if (res.data.success) {
        let list = res.data.appointments;
        if (statusFilter) {
          list = list.filter(app => app.status === statusFilter);
        }
        setAppointments(list);
      }
    } catch (error) {
      console.error('Error fetching admin appointment list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await appointmentService.update(id, { status: newStatus });
      if (res.data.success) {
        setNotification({ type: 'success', msg: 'Appointment status updated!' });
        fetchAppointments();
      }
    } catch (error) {
      setNotification({ type: 'error', msg: 'Failed to update status.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete/cancel this appointment record?')) return;

    try {
      const res = await appointmentService.delete(id);
      if (res.data.success) {
        setNotification({ type: 'success', msg: 'Appointment deleted successfully!' });
        fetchAppointments();
      }
    } catch (error) {
      setNotification({ type: 'error', msg: 'Failed to delete appointment.' });
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Appointment Ledger</h2>
          <p className="text-xs text-navy-400 mt-1">Audit active slot bookings, complete visits, or delete records</p>
        </div>

        {/* Filter Selection */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {notification.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 max-w-md ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm">
        {appointments.length === 0 ? (
          <p className="text-center py-12 text-navy-400 text-xs">No slot bookings recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Patient</th>
                  <th className="py-3 px-2">Practitioner</th>
                  <th className="py-3 px-2">Date/Time Slot</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Modify Status</th>
                  <th className="py-3 px-2 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {appointments.map((app) => (
                  <tr key={app._id} className="hover:bg-navy-50 hover:bg-opacity-50 transition">
                    <td className="py-4 px-2">
                      <div className="font-bold text-navy-900">{app.patientId?.name || 'Guest User'}</div>
                      <div className="text-[10px] text-navy-400">{app.patientId?.email}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-bold text-navy-900">
                        Dr. {app.doctorId?.userId?.name || 'Medical Specialist'}
                      </div>
                      <div className="text-[10px] text-hospital-600 font-semibold">{app.doctorId?.specialization}</div>
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
                    <td className="py-4 px-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                        className="px-2 py-1 border border-navy-200 bg-white rounded text-[10px] focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};

export default AppointmentManagement;
