import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Clienthomepage from './pages/Clienthomepage';
import Header from './components/Header';
import UserAccount from './pages/UserAccount';

// import AdminDashboard from './pages/AdminDashboard'; 
import './App.css'
import { Bold } from 'lucide-react';

function App() {
  return (
    <div className="App">
      <Header title="MEDISYNC" />
    <Router>
      <Routes>
        
        {/* Dashboards */}
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

      </Routes>
    </Router>
    </div>
  );
}

export default App;

