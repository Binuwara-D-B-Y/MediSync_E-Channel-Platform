import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Clienthomepage from './pages/Clienthomepage';
import Header from './components/Header';
import UserAccount from './pages/UserAccount';
import BookAppointment from './pages/BookAppointment';
// import AdminDashboard from './pages/AdminDashboard'; 
import './App.css';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const location = useLocation();

  // Decide header buttons depending on route
  let headerActions = [];
  if (location.pathname.startsWith("/account")) {
    headerActions = [
      { label: "Home", path: "/patient", className: "settings-button" },
      { label: "Logout", path: "/logout", className: "logout-button" },
    ];
  } else {
    headerActions = [
      { label: "Profile", path: "/account", className: "settings-button" },
      { label: "Logout", path: "/logout", className: "logout-button" },
    ];
  }

  return (
    <div className="App">
      <Header title="MEDISYNC" actions={headerActions} />
      
      <Routes>
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/book/:doctorId" element={<BookAppointment />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
