
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
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminSchedules from './pages/admin/AdminSchedules';


// function App() {
//   const location = useLocation();

//   // Decide header buttons depending on route
//   let headerActions = [];
//   if (location.pathname.startsWith("/account")) {
//     headerActions = [
//       { label: "Home", path: "/patient", className: "settings-button" },
//       { label: "Logout", path: "/logout", className: "logout-button" },
//     ];
//   } else {
//     headerActions = [
//       { label: "Profile", path: "/account", className: "settings-button" },
//       { label: "Logout", path: "/logout", className: "logout-button" },
//     ];
//   }

//   return (
//     <div className="App">
//       <Header title="MEDISYNC" actions={headerActions} />
      
//       <Routes>
//         <Route path="/patient" element={<Clienthomepage />} />
//         <Route path="/account" element={<UserAccount />} />
//         {/* <Route path="/admin" element={<AdminDashboard />} /> */}
//         <Route path="/book/:doctorId" element={<BookAppointment />} />
//       </Routes>
//     </div>
//   );
// }

// export default AppWrapper;


"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import "./index.css"
import "./App.css"

// Auth pages
import Login from "./pages/Login-signup/Login"
import Register from "./pages/Login-signup/Register"
import Forgot from "./pages/Login-signup/Forgot"
import Reset from "./pages/Login-signup/Reset"

// Patient pages
import Clienthomepage from "./pages/Clienthomepage"
import UserAccount from "./pages/UserAccount"
import BookAppointment from "./pages/BookAppointment"
// import AdminDashboard from "./pages/AdminDashboard";

// Shared components
import Header from "./components/Header"

// ---------------- Private Route ----------------
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

// ---------------- Main App ----------------
function App() {
  const location = useLocation()
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("token"))

  useEffect(() => {
    const onStorage = () => setIsAuthed(!!localStorage.getItem("token"))
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsAuthed(false)
  }

  // Header actions depending on route + auth
  let headerActions = []
  if (isAuthed) {
    if (location.pathname.startsWith("/account")) {
      headerActions = [
        { label: "Home", path: "/patient", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    } else {
      headerActions = [
        { label: "Profile", path: "/account", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    }
  } else {
    headerActions = [
      { label: "Login", path: "/login", className: "btn outline" },
      { label: "Register", path: "/register", className: "btn secondary" },
    ]
  }

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

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="schedules" element={<AdminSchedules />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App;

