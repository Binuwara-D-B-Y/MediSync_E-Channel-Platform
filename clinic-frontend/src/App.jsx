"use client"

import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./index.css"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Forgot from "./pages/Forgot"
import Reset from "./pages/Reset"

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
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

  return (
    <BrowserRouter>
      <nav className="nav">
        <Link to="/" className="brand">
          HealthCare Clinic
        </Link>
        <div className="nav-links">
          {isAuthed ? (
            <button className="btn outline" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="btn outline" to="/login">
                Login
              </Link>
              <Link className="btn secondary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login onAuthed={() => setIsAuthed(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>
    </BrowserRouter>
  )
}
