
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import './App.css';

// Auth pages
import Login from './pages/Login-signup/Login';
import Register from './pages/Login-signup/Register';
import Forgot from './pages/Login-signup/Forgot';
import Reset from './pages/Login-signup/Reset';

// Patient pages
import Clienthomepage from './pages/Clienthomepage';
import UserAccount from './pages/UserAccount';
import BookAppointment from './pages/BookAppointment';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminSpecializations from './pages/admin/AdminSpecializations';
import AdminSchedules from './pages/admin/AdminSchedules';

// Shared components
import Header from './components/Header';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthed(false);
  };

  let headerActions = [];
  if (isAuthed) {
    if (location.pathname.startsWith('/account')) {
      headerActions = [
        { label: 'Home', path: '/patient', className: 'settings-button' },
        { label: 'Logout', action: handleLogout, className: 'logout-button' },
      ];
    } else {
      headerActions = [
        { label: 'Profile', path: '/account', className: 'settings-button' },
        { label: 'Logout', action: handleLogout, className: 'logout-button' },
      ];
    }
  } else {
    headerActions = [
      { label: 'Login', path: '/login', className: 'btn outline' },
      { label: 'Register', path: '/register', className: 'btn secondary' },
    ];
  }

  return (
    <div className="App">
      <Header title="MediSync" actions={headerActions} />
      <Routes>
        <Route path="/" element={<Navigate to="/patient" replace />} />
        
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
        
        {/* Patient routes */}
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="specializations" element={<AdminSpecializations />} />
          <Route path="schedules" element={<AdminSchedules />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


