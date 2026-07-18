import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, ShieldAlert, Award } from 'lucide-react';

const Analytics = () => {
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

  // Specialization Bar Chart
  const specData = stats?.specializations?.map(item => ({
    name: item._id || 'General',
    count: item.count
  })) || [];

  // Appointments Status Bar Chart
  const statusData = [
    { name: 'Pending', count: stats?.statusCounts?.pending || 0 },
    { name: 'Confirmed', count: stats?.statusCounts?.confirmed || 0 },
    { name: 'Completed', count: stats?.statusCounts?.completed || 0 },
    { name: 'Cancelled', count: stats?.statusCounts?.cancelled || 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">System Analytics Dashboard</h2>
        <p className="text-xs text-navy-400 mt-1">Platform-wide activity trends and diagnostics data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialization Distribution */}
        <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
            <Award className="w-4 h-4 text-hospital-500" />
            Active Specialties
          </h3>
          <p className="text-[10px] text-navy-400">Total doctor counts categorized by area of expertise</p>
          <div className="h-64">
            {specData.length === 0 ? (
              <p className="text-xs text-navy-400 italic text-center py-24">No specialty details available.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={specData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Appointment Status Counts */}
        <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-navy-950 text-sm flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-hospital-500" />
            Appointment Status Logs
          </h3>
          <p className="text-[10px] text-navy-400">Aggregated status categories of clinical bookings</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
