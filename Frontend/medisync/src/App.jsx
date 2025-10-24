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
import AppointmentsDone from "./pages/AppointmentsDone"

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminDoctors from "./pages/admin/AdminDoctors"
import AdminSchedules from "./pages/admin/AdminSchedules"
import AdminTransactions from "./pages/admin/AdminTransactions"

// Shared components
import Header from "./components/Header"

// ---------------- Private Route ----------------
function PrivateRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={userRole === "Admin" ? "/admin/dashboard" : "/patient"} replace />
  }
  
  return children
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
    localStorage.removeItem("userRole")
    setIsAuthed(false)
    window.location.href = "/login"
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
      <Header title="MEDISYNC" actions={headerActions} />

      <Routes>
        {/* Patient routes */}
        {/* <Route path="/patient" element={<PrivateRoute requiredRole="Patient"><Clienthomepage /></PrivateRoute>} /> */}
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/appointments" element={<AppointmentsDone />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {<Route path="dashboard" element={<AdminDashboard />} />}
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="transactions" element={<AdminTransactions />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onAuthed={() => setIsAuthed(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </div>
  )
}

// ---------------- Wrapper ----------------
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  )
}
