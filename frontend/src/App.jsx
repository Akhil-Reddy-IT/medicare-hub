import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Shared protected pages
import Profile from './pages/Profile';

// Patient pages
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';
import AppointmentHistory from './pages/AppointmentHistory';
import MedicalRecords from './pages/MedicalRecords';
import SymptomChecker from './pages/SymptomChecker';
import HealthInsights from './pages/HealthInsights';

// Doctor pages
import DoctorDashboard from './pages/DoctorDashboard';
import PatientRecords from './pages/PatientRecords';
import ScheduleManagement from './pages/ScheduleManagement';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import DoctorManagement from './pages/DoctorManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import Analytics from './pages/Analytics';

// Dynamic Router to resolve dashboard based on active role session
const DashboardSelector = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'doctor') return <DoctorDashboard />;
  return <PatientDashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Portal Layout Routing */}
          <Route element={<ProtectedRoute allowedRoles={['patient', 'doctor', 'admin']} />}>
            <Route element={<Layout />}>
              {/* Dynamic dashboard routing resolver */}
              <Route path="/dashboard" element={<DashboardSelector />} />
              <Route path="/profile" element={<Profile />} />

              {/* Patient Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/appointment-history" element={<AppointmentHistory />} />
                <Route path="/medical-records" element={<MedicalRecords />} />
                <Route path="/symptom-checker" element={<SymptomChecker />} />
                <Route path="/health-insights" element={<HealthInsights />} />
              </Route>

              {/* Doctor Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
                <Route path="/patient-records" element={<PatientRecords />} />
                <Route path="/appointments" element={<DoctorDashboard />} />
                <Route path="/schedule" element={<ScheduleManagement />} />
              </Route>

              {/* Admin Only Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/doctor-management" element={<DoctorManagement />} />
                <Route path="/appointment-management" element={<AppointmentManagement />} />
                <Route path="/analytics" element={<Analytics />} />
              </Route>
            </Route>
          </Route>

          {/* Fallback Catch-All redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
