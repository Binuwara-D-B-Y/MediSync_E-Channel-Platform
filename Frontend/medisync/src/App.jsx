import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Clienthomepage from './pages/Clienthomepage';
import BookAppointment from './pages/BookAppointment';

import Header from './components/Header';
import UserAccount from './pages/UserAccount';

// import AdminDashboard from './pages/AdminDashboard'; 
import './App.css'
import { Bold } from 'lucide-react';

function App() {
  return (
    <div className="App">
      
    <Router>
    <Header title="MediSync" />
      <Routes>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/patient" replace />} />
        <Route path="/account" element={<UserAccount />} />
        {/* Dashboards */}
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

        {/* Booking */}
        <Route path="/book/:doctorId" element={<BookAppointment />} />

      </Routes>
    </Router>
    </div>
  );
}

export default App;

