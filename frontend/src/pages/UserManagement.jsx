import React, { useEffect, useState } from 'react';
import { adminService } from '../services/api';
import Loader from '../components/Loader';
import { Trash2, ShieldAlert, CheckCircle, AlertCircle, Filter, Mail, Phone, Calendar } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });

  const fetchUsers = async () => {
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const res = await adminService.usersList(params);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}" and all associated records?`)) return;
    
    try {
      const res = await adminService.deleteUser(id);
      if (res.data.success) {
        setStatusMsg({ type: 'success', msg: `User "${name}" deleted successfully!` });
        fetchUsers();
      }
    } catch (error) {
      setStatusMsg({ type: 'error', msg: 'Failed to delete user.' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'doctor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">User Management</h2>
          <p className="text-xs text-navy-400 mt-1">Review accounts, assign permissions, or delete profiles</p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-navy-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="patient">Patients Only</option>
            <option value="doctor">Doctors Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {statusMsg.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 max-w-md ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.msg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm">
        {users.length === 0 ? (
          <p className="text-center py-12 text-navy-400 text-xs">No users registered under this role.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-navy-100 text-navy-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-2">Account Name</th>
                  <th className="py-3 px-2">Contact details</th>
                  <th className="py-3 px-2">Role badge</th>
                  <th className="py-3 px-2">Joined Date</th>
                  <th className="py-3 px-2 text-right">Delete Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-50">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-navy-50 hover:bg-opacity-50 transition">
                    <td className="py-4 px-2">
                      <div className="font-bold text-navy-900">{item.name}</div>
                      <div className="text-[10px] text-navy-400">
                        {item.gender || 'N/A'}, {item.age ? `${item.age} yrs` : 'N/A'}
                      </div>
                    </td>
                    <td className="py-4 px-2 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-navy-600">
                        <Mail className="w-3.5 h-3.5 text-navy-400" />
                        <span>{item.email}</span>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1.5 text-navy-600">
                          <Phone className="w-3.5 h-3.5 text-navy-400" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getRoleColor(item.role)}`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-navy-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-navy-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      {item.role !== 'admin' ? (
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-navy-300 italic">Protected</span>
                      )}
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

export default UserManagement;
