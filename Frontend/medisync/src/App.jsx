import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clienthomepage from './pages/Clienthomepage';

import Header from './components/Header';
// import AdminDashboard from './pages/AdminDashboard'; 
import './App.css'

function App() {
  return (
    <div className="App">
      <Header title="MediSync" />
    <Router>
      <Routes>
        
        {/* Dashboards */}
        <Route path="/patient" element={<Clienthomepage />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

      </Routes>
    </Router>
    </div>
  );
}

export default App;

