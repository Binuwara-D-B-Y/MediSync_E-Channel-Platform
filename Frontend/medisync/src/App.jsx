import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clienthomepage from './pages/Clienthomepage';
// import AdminDashboard from './pages/AdminDashboard'; 
//import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Dashboards */}
        <Route path="/patient" element={<Clienthomepage />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

      </Routes>
    </Router>
  );
}

export default App;

