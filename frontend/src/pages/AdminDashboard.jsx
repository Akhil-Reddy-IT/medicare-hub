import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { 
  Users, 
  BriefcaseMedical, 
  CalendarCheck, 
  TrendingUp, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.stats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loader />;

  // Prepare chart data for Recharts
  const statusData = [
    { name: 'Pending', value: stats?.statusCounts?.pending || 0, color: '#f59e0b' },
    { name: 'Confirmed', value: stats?.statusCounts?.confirmed || 0, color: '#10b981' },
    { name: 'Completed', value: stats?.statusCounts?.completed || 0, color: '#0d9488' },
    { name: 'Cancelled', value: stats?.statusCounts?.cancelled || 0, color: '#ef4444' }
  ].filter(item => item.value > 0); // Hide empty slices

  const specializationData = stats?.specializations?.map(item => ({
    name: item._id || 'General',
    count: item.count
  })) || [];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Administrator Console</h2>
        <p className="text-xs text-navy-400 mt-1">Platform analytics and utilization summaries</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-navy-100 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Total Patients</h4>
            <p className="text-2xl font-bold text-navy-800 mt-1">{stats?.totalPatients || 0}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-navy-100 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <BriefcaseMedical className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Active Doctors</h4>
            <p className="text-2xl font-bold text-navy-800 mt-1">{stats?.totalDoctors || 0}</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-navy-100 rounded-2xl shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Total Appointments</h4>
            <p className="text-2xl font-bold text-navy-800 mt-1">{stats?.totalAppointments || 0}</p>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Status Pie Chart */}
        <div className="p-6 bg-white border border-navy-100 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-hospital-500" />
            Bookings Distribution
          </h3>
          <div className="h-64 flex justify-center items-center">
            {statusData.length === 0 ? (
              <p className="text-xs text-navy-400 italic">No bookings recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Specialization Bar Chart */}
        <div className="p-6 bg-white border border-navy-100 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
            <BriefcaseMedical className="w-4 h-4 text-hospital-500" />
            Doctors per Specialty
          </h3>
          <div className="h-64">
            {specializationData.length === 0 ? (
              <p className="text-xs text-navy-400 italic">No doctors registered yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={specializationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip formatter={(value) => [`${value} doctors`, 'Count']} />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
