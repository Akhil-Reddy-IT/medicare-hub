import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone, UserCheck, AlertCircle, Sparkles } from 'lucide-react';

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      role: 'patient',
      gender: 'Male'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const res = await registerAuth(data);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (error) {
      setErrorMsg('Server connection failure. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-50 min-h-screen flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-navy-100 shadow-xl overflow-hidden">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-hospital-500 to-navy-800 p-8 text-white text-center relative">
          <div className="absolute top-4 right-4 text-hospital-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-sm text-hospital-100 mt-1">Join the MediCare Hub smart platform</p>
        </div>

        <div className="p-8">
          {errorMsg && (
            <div className="mb-6 flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Top row: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[11px] mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Enter a valid email'
                      }
                    })}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Row 2: Password & Role Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Select Role
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-navy-400">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                    {...register('role')}
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Age, Gender & Phone */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="25"
                  className="w-full px-3 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                  {...register('age', { required: 'Required' })}
                />
                {errors.age && <p className="text-red-500 text-[11px] mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                  {...register('gender')}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-600 mb-1.5 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  className="w-full px-3 py-2.5 rounded-xl border bg-navy-50 bg-opacity-20 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-500 focus:bg-white transition border-navy-200"
                  {...register('phone')}
                />
              </div>
            </div>

            {/* Conditional Fields: If role is doctor */}
            {selectedRole === 'doctor' && (
              <div className="p-4 rounded-xl bg-hospital-50 bg-opacity-50 border border-hospital-100 space-y-4 animate-fadeIn">
                <h4 className="text-xs font-bold text-hospital-700 uppercase tracking-wider">Doctor Information</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1">Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Cardiologist"
                      className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      {...register('specialization', { required: 'Required for Doctors' })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1">Years of Exp.</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      {...register('experience', { required: 'Required' })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1">Affiliated Hospital</label>
                    <input
                      type="text"
                      placeholder="e.g. City General Hospital"
                      className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      {...register('hospital', { required: 'Required' })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy-600 mb-1">Consult Fee (INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 600"
                      className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
                      {...register('consultationFee', { required: 'Required' })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy-600 mb-1">Short Biography</label>
                  <textarea
                    placeholder="Tell patients about your medical background..."
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-navy-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hospital-500"
                    {...register('biography')}
                  ></textarea>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-hospital-500 hover:bg-hospital-600 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/login" className="text-hospital-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
