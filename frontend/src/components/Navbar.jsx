import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'doctor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-navy-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg text-navy-600 hover:bg-navy-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xl font-bold bg-gradient-to-r from-hospital-500 to-navy-800 bg-clip-text text-transparent">
          MediCare Hub
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <button className="p-2 text-navy-400 hover:text-hospital-500 rounded-full hover:bg-navy-50 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-navy-100"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-navy-800">{user.name}</p>
              <p className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border inline-block ${getRoleBadge(user.role)}`}>
                {user.role}
              </p>
            </div>

            <div className="w-10 h-10 rounded-full bg-hospital-100 border border-hospital-200 flex items-center justify-center text-hospital-700 font-bold overflow-hidden cursor-pointer" onClick={() => navigate('/profile')}>
              {user.profileImage ? (
                <img src={`http://localhost:5000${user.profileImage}`} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5 text-hospital-600" />
              )}
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
