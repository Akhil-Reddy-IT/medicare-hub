import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  ClipboardList, 
  FolderHeart, 
  Stethoscope, 
  BrainCircuit, 
  UserSquare2, 
  Users, 
  Activity,
  CalendarRange,
  BriefcaseMedical,
  Clock
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Define sidebar links based on roles
  const linksByRole = {
    patient: [
      { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { path: '/book-appointment', name: 'Book Appointment', icon: CalendarDays },
      { path: '/appointment-history', name: 'Appointment History', icon: ClipboardList },
      { path: '/medical-records', name: 'Medical Records', icon: FolderHeart },
      { path: '/symptom-checker', name: 'Symptom Checker', icon: Stethoscope },
      { path: '/health-insights', name: 'AI Health Insights', icon: BrainCircuit },
      { path: '/profile', name: 'My Profile', icon: UserSquare2 }
    ],
    doctor: [
      { path: '/dashboard', name: 'Doctor Dashboard', icon: LayoutDashboard },
      { path: '/patient-records', name: 'Patient Records', icon: FolderHeart },
      { path: '/appointments', name: 'Appointments', icon: Clock },
      { path: '/schedule', name: 'Schedule Manager', icon: CalendarRange },
      { path: '/profile', name: 'Doctor Profile', icon: UserSquare2 }
    ],
    admin: [
      { path: '/dashboard', name: 'Admin Dashboard', icon: LayoutDashboard },
      { path: '/user-management', name: 'User Management', icon: Users },
      { path: '/doctor-management', name: 'Doctor Management', icon: BriefcaseMedical },
      { path: '/appointment-management', name: 'Appointment List', icon: ClipboardList },
      { path: '/analytics', name: 'Analytics', icon: Activity }
    ]
  };

  const currentLinks = linksByRole[user.role] || [];

  const activeStyle = "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl bg-hospital-50 text-hospital-700 border-l-4 border-hospital-600 shadow-sm transition-all";
  const normalStyle = "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-navy-600 hover:text-hospital-600 hover:bg-navy-50 transition-all";

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-navy-100 w-64 shadow-sm">
      {/* Branding Header */}
      <div className="h-16 flex items-center px-6 border-b border-navy-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-hospital-500 flex items-center justify-center text-white font-bold text-lg">
            H
          </div>
          <div>
            <h1 className="text-md font-bold text-navy-900 leading-tight">Medicare Hub</h1>
            <p className="text-[10px] text-navy-400 font-medium">Smart Platform</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {currentLinks.map((link) => {
          const IconComponent = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              className={({ isActive }) => (isActive ? activeStyle : normalStyle)}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile footer in sidebar */}
      <div className="p-4 border-t border-navy-50 bg-navy-50 bg-opacity-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-hospital-500 text-white flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-navy-900 truncate">{user.name}</h4>
            <p className="text-[10px] text-navy-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div 
            onClick={toggleSidebar}
            className="fixed inset-0 bg-navy-900 bg-opacity-40 backdrop-blur-sm transition-opacity"
          ></div>
          
          {/* Drawer container */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition-transform duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
