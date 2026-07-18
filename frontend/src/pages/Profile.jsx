import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API, doctorService } from '../services/api';
import Loader from '../components/Loader';
import { User, Shield, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Input states
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  
  // Doctor inputs
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [hospital, setHospital] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [biography, setBiography] = useState('');

  const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      setName(user.name || '');
      setAge(user.age || '');
      setGender(user.gender || 'Male');
      setPhone(user.phone || '');

      if (user.role === 'doctor') {
        try {
          const res = await doctorService.getByUserId(user._id);
          if (res.data.success) {
            setDoctorProfile(res.data.doctor);
            setSpecialization(res.data.doctor.specialization || '');
            setExperience(res.data.doctor.experience || '');
            setHospital(res.data.doctor.hospital || '');
            setConsultationFee(res.data.doctor.consultationFee || '');
            setBiography(res.data.doctor.biography || '');
          }
        } catch (error) {
          console.error('Error fetching doctor profile details:', error);
        }
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', msg: '' });

    try {
      // 1. Update basic user details
      const userRes = await API.put(`/admin/users/${user._id}`, {
        name, age: Number(age), gender, phone
      });

      // Update auth context state
      if (userRes.data.success) {
        setUser({ ...user, name, age: Number(age), gender, phone });
      }

      // 2. If doctor, update doctor details
      if (user.role === 'doctor' && doctorProfile) {
        await doctorService.update(doctorProfile._id, {
          specialization,
          experience: Number(experience),
          hospital,
          consultationFee: Number(consultationFee),
          biography
        });
      }

      setStatusMsg({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (error) {
      setStatusMsg({ type: 'error', msg: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">Manage Your Profile</h2>
        <p className="text-xs text-navy-400 mt-1">Review demographics and professional doctor properties</p>
      </div>

      {statusMsg.msg && (
        <div className={`p-4 rounded-xl text-xs border flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.msg}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleUpdate} className="bg-white border border-navy-100 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-navy-50 pb-5">
          <div className="w-14 h-14 bg-hospital-500 text-white rounded-full flex items-center justify-center font-bold text-xl uppercase">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-navy-950 text-base">{name || 'Guest User'}</h3>
            <p className="text-xs text-navy-400 mt-0.5 capitalize">{user.role} Account Profile</p>
          </div>
        </div>

        {/* Basic Demographics */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider">Demographic Information</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Phone Number</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Age</label>
              <input 
                type="number" 
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 rounded-lg text-xs bg-white focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctor Information (Only show if logged in user is a Doctor) */}
        {user.role === 'doctor' && doctorProfile && (
          <div className="p-4 rounded-xl bg-hospital-50 bg-opacity-50 border border-hospital-100 space-y-4">
            <h4 className="text-xs font-bold text-hospital-700 uppercase tracking-wider">Doctor Professional Profile</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1">Specialization</label>
                <input 
                  type="text" 
                  required
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1">Years of Experience</label>
                <input 
                  type="number" 
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1">Affiliated Hospital</label>
                <input 
                  type="text" 
                  required
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1">Consultation Fee (INR)</label>
                <input 
                  type="number" 
                  required
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full px-3 py-2 border border-navy-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-600 mb-1">Biography / Summary</label>
              <textarea 
                rows="3" 
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                className="w-full px-3 py-2 border border-navy-200 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-hospital-500"
                placeholder="Explain your medical backgrounds and clinical services..."
              ></textarea>
            </div>
          </div>
        )}

        <button 
          type="submit"
          disabled={saving}
          className="bg-hospital-500 hover:bg-hospital-600 disabled:bg-navy-200 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition shadow-sm"
        >
          {saving ? 'Saving changes...' : 'Save Profile Settings'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
