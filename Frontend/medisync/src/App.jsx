// "use client"

// import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
// import { useEffect, useState } from "react"
// import "./index.css"
// import "./App.css"

// // Auth pages
// import Login from "./pages/Login-signup/Login"
// import Register from "./pages/Login-signup/Register"
// import Forgot from "./pages/Login-signup/Forgot"
// import Reset from "./pages/Login-signup/Reset"

// // Patient pages
// import Clienthomepage from "./pages/Clienthomepage"
// import UserAccount from "./pages/UserAccount"
// import BookAppointment from "./pages/BookAppointment"
// import AppointmentsDone from "./pages/AppointmentsDone"
// import FavoriteDoctors from "./pages/FavoriteDoctors"
// // import AdminDashboard from "./pages/AdminDashboard";

// // Shared components
// import Header from "./components/Header"

// // ---------------- Private Route ----------------
// function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token")
//   return token ? children : <Navigate to="/login" replace />
// }

// // ---------------- Main App ----------------
// function App() {
//   const location = useLocation()
//   const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem("token"))

//   useEffect(() => {
//     const onStorage = () => setIsAuthed(!!localStorage.getItem("token"))
//     window.addEventListener("storage", onStorage)
//     return () => window.removeEventListener("storage", onStorage)
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem("token")
//     setIsAuthed(false)
//   }

//   // Header actions depending on route + auth
//   let headerActions = []
  
//   // No buttons on login/register pages
//   if (location.pathname === "/login" || location.pathname === "/register") {
//     headerActions = []
//   } else if (isAuthed) {
//     if (location.pathname.startsWith("/account")) {
//       headerActions = [
//         { label: "Home", path: "/patient", className: "settings-button" },
//         { label: "Favorites", path: "/favorites", className: "settings-button" },
//         { label: "Logout", action: handleLogout, className: "logout-button" },
//       ]
//     } else if (location.pathname === "/patient") {
//       headerActions = [
//         { label: "Profile", path: "/account", className: "settings-button" },
//         { label: "Logout", action: handleLogout, className: "logout-button" },
//       ]
//     } else if (location.pathname === "/favorites") {
//       headerActions = [
//         { label: "Home", path: "/patient", className: "settings-button" },
//         { label: "Profile", path: "/account", className: "settings-button" },
//         { label: "Logout", action: handleLogout, className: "logout-button" },
//       ]
//     } else {
//       headerActions = [
//         { label: "Home", path: "/patient", className: "settings-button" },
//         { label: "Profile", path: "/account", className: "settings-button" },
//         { label: "Logout", action: handleLogout, className: "logout-button" },
//       ]
//     }
//   }

//   return (
//     <div className="App">
//       <Header title="MEDISYNC" actions={headerActions} />

//       <Routes>
//         {/* Auth protected routes */}
//         <Route path="/patient" element={<Clienthomepage />} />
//         <Route path="/account" element={<UserAccount />} />
//         <Route path="/book/:doctorId" element={<BookAppointment />} />
//         <Route path="/appointments" element={<AppointmentsDone />} />
//         <Route path="/favorites" element={<FavoriteDoctors />} />

//         {/* Public routes */}
//         <Route path="/" element={isAuthed ? <Navigate to="/patient" replace /> : <Navigate to="/login" replace />} />
//         <Route path="/login" element={<Login onAuthed={() => setIsAuthed(true)} />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/forgot" element={<Forgot />} />
//         <Route path="/reset" element={<Reset />} />
//       </Routes>
//     </div>
//   )
// }

// // ---------------- Wrapper ----------------
// export default function AppWrapper() {
//   return (
//     <Router>
//       <App />
//     </Router>
//   )
// }



export const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || 'https://backendmedisync-cua0dmdgh3aacrb0.eastasia-01.azurewebsites.net';

export async function apiRequest(path, options = {}) {
	const url = `${API_BASE}${path}`;
	const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
	const res = await fetch(url, { ...options, headers });
	const contentType = res.headers.get('content-type') || '';
	let data = null;
	if (contentType.includes('application/json')) {
		data = await res.json();
	}
	if (!res.ok) {
		throw new Error((data && (data.message || data.Message)) || `Request failed: ${res.status}`);
	}
	return data;
}

export function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}


export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest("/api/User/profile", {  // Updated path
      method: "GET",
      headers: authHeaders(),
    })
  },

  // Update user profile
  updateProfile: async (data) => {
    return apiRequest("/api/User/profile", {  // Updated path
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  },

  // Change password
  changePassword: async (data) => {
    return apiRequest("/api/User/change-password", {  // Updated path
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    })
  },

  // Delete account
  deleteAccount: async () => {
    return apiRequest("/api/User", {  // Updated path
      method: "DELETE",
      headers: authHeaders(),
    })
  },

  // Get user transactions
  getTransactions: async () => {
    return apiRequest("/api/User/transactions", {  // Updated path
      method: "GET",
      headers: authHeaders(),
    })
  },
}

export const favoritesAPI = {
  // Get user favorites
  getFavorites: async () => {
    return apiRequest("/api/Favorites", {
      method: "GET",
      headers: authHeaders(),
    })
  },

  // Add doctor to favorites
  addFavorite: async (doctorId) => {
    return apiRequest(`/api/Favorites/${doctorId}`, {
      method: "POST",
      headers: authHeaders(),
    })
  },

  // Remove doctor from favorites
  removeFavorite: async (doctorId) => {
    return apiRequest(`/api/Favorites/${doctorId}`, {
      method: "DELETE",
      headers: authHeaders(),
    })
  },

  // Check if doctor is favorite
  checkFavorite: async (doctorId) => {
    return apiRequest(`/api/Favorites/check/${doctorId}`, {
      method: "GET",
      headers: authHeaders(),
    })
  },
}
//.
