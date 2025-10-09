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
import FavoriteDoctors from "./pages/FavoriteDoctors"
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
  
  // No buttons on login/register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    headerActions = []
  } else if (isAuthed) {
    if (location.pathname.startsWith("/account")) {
      headerActions = [
        { label: "Home", path: "/patient", className: "settings-button" },
        { label: "Favorites", path: "/favorites", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    } else if (location.pathname === "/patient") {
      headerActions = [
        { label: "Profile", path: "/account", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    } else if (location.pathname === "/favorites") {
      headerActions = [
        { label: "Home", path: "/patient", className: "settings-button" },
        { label: "Profile", path: "/account", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    } else {
      headerActions = [
        { label: "Home", path: "/patient", className: "settings-button" },
        { label: "Profile", path: "/account", className: "settings-button" },
        { label: "Logout", action: handleLogout, className: "logout-button" },
      ]
    }
  }

  return (
    <div className="App">
      <Header title="MEDISYNC" actions={headerActions} />

      <Routes>
        {/* Auth protected routes */}
        <Route path="/patient" element={<Clienthomepage />} />
        <Route path="/account" element={<UserAccount />} />
        <Route path="/book/:doctorId" element={<BookAppointment />} />
        <Route path="/appointments" element={<AppointmentsDone />} />
        <Route path="/favorites" element={<FavoriteDoctors />} />

        {/* Public routes */}
        <Route path="/" element={isAuthed ? <Navigate to="/patient" replace /> : <Navigate to="/login" replace />} />
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
// Test dep 2