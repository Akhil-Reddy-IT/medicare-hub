import React, { useEffect, useState } from 'react';
import { doctorService } from '../services/api';
import Loader from '../components/Loader';
import { Search, Briefcase, Award, Hospital, DollarSign } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (specialtyFilter) params.specialization = specialtyFilter;
      if (search) params.search = search;
      
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
  }, [specialtyFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Doctor Profile Directory</h2>
          <p className="text-xs text-navy-400 mt-1">Review specialists credentials, experiences, and hospital networks</p>
        </div>

        {/* Filter Selection */}
        <div className="flex items-center gap-2">
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
          >
            <option value="">All Specialties</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="General Physician">General Physician</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Neurologist">Neurologist</option>
          </select>
        </div>
      </div>

      {/* Search Header */}
      <form onSubmit={handleSearchSubmit} className="p-4 rounded-xl bg-white border border-navy-100 shadow-sm flex gap-3 max-w-md">
        <input 
          type="text" 
          placeholder="Search doctor by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
        />
        <button type="submit" className="bg-hospital-500 hover:bg-hospital-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition">
          Search
        </button>
      </form>

      {/* Doctors Grid */}
      {doctors.length === 0 ? (
        <p className="text-center py-12 bg-white border border-navy-100 rounded-xl text-navy-400 text-xs">No doctors registered.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc._id} className="p-6 rounded-2xl border border-navy-100 bg-white shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-hospital-500 text-white rounded-full flex items-center justify-center font-bold text-sm uppercase">
                    {doc.userId?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-950 text-sm">Dr. {doc.userId?.name}</h3>
                    <p className="text-xs text-hospital-600 font-semibold">{doc.specialization}</p>
                  </div>
                </div>

                <div className="border-t border-navy-50 pt-3 space-y-2 text-xs text-navy-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-navy-400" />
                    <span>{doc.experience} Years of Practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-navy-400" />
                    <span>{doc.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-navy-800">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    <span>Fee: {doc.consultationFee} INR</span>
                  </div>
                </div>
              </div>

              {/* Biography snippet */}
              {doc.biography && (
                <div className="text-[11px] text-navy-400 leading-relaxed italic bg-navy-50 bg-opacity-40 p-2.5 rounded-lg border border-navy-50">
                  "{doc.biography.slice(0, 100)}{doc.biography.length > 100 ? '...' : ''}"
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
