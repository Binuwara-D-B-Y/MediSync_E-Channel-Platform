// export const API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE || 'http://localhost:5000';

// export async function apiRequest(path, options = {}) {
// 	const url = `${API_BASE}${path}`;
// 	const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
// 	const res = await fetch(url, { ...options, headers });
// 	const contentType = res.headers.get('content-type') || '';
// 	let data = null;
// 	if (contentType.includes('application/json')) {
// 		data = await res.json();
// 	}
// 	if (!res.ok) {
// 		throw new Error((data && (data.message || data.Message)) || `Request failed: ${res.status}`);
// 	}
// 	return data;
// }

// export function authHeaders() {
// 	const token = localStorage.getItem('token');
// 	return token ? { Authorization: `Bearer ${token}` } : {};
// }


// export const userAPI = {
//   // Get user profile
//   getProfile: async () => {
//     return apiRequest("/api/User/profile", {  // Updated path
//       method: "GET",
//       headers: authHeaders(),
//     })
//   },

//   // Update user profile
//   updateProfile: async (data) => {
//     return apiRequest("/api/User/profile", {  // Updated path
//       method: "PUT",
//       headers: authHeaders(),
//       body: JSON.stringify(data),
//     })
//   },

//   // Change password
//   changePassword: async (data) => {
//     return apiRequest("/api/User/change-password", {  // Updated path
//       method: "POST",
//       headers: authHeaders(),
//       body: JSON.stringify(data),
//     })
//   },

//   // Delete account
//   deleteAccount: async () => {
//     return apiRequest("/api/User", {  // Updated path
//       method: "DELETE",
//       headers: authHeaders(),
//     })
//   },

//   // Get user transactions
//   getTransactions: async () => {
//     return apiRequest("/api/User/transactions", {  // Updated path
//       method: "GET",
//       headers: authHeaders(),
//     })
//   },
// }

// export const favoritesAPI = {
//   // Get user favorites
//   getFavorites: async () => {
//     return apiRequest("/api/Favorites", {
//       method: "GET",
//       headers: authHeaders(),
//     })
//   },

//   // Add doctor to favorites
//   addFavorite: async (doctorId) => {
//     return apiRequest(`/api/Favorites/${doctorId}`, {
//       method: "POST",
//       headers: authHeaders(),
//     })
//   },

//   // Remove doctor from favorites
//   removeFavorite: async (doctorId) => {
//     return apiRequest(`/api/Favorites/${doctorId}`, {
//       method: "DELETE",
//       headers: authHeaders(),
//     })
//   },

//   // Check if doctor is favorite
//   checkFavorite: async (doctorId) => {
//     return apiRequest(`/api/Favorites/check/${doctorId}`, {
//       method: "GET",
//       headers: authHeaders(),
//     })
//   },
// }



export const API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE || 'http://localhost:5000';

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
  getProfile: async () => apiRequest("/api/User/profile", { method: "GET", headers: authHeaders() }),
  updateProfile: async (data) => apiRequest("/api/User/profile", { method: "PUT", headers: authHeaders(), body: JSON.stringify(data) }),
  changePassword: async (data) => apiRequest("/api/User/change-password", { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }),
  deleteAccount: async () => apiRequest("/api/User", { method: "DELETE", headers: authHeaders() }),
  getTransactions: async () => apiRequest("/api/User/transactions", { method: "GET", headers: authHeaders() }),
}

export const favoritesAPI = {
  getFavorites: async () => apiRequest("/api/Favorites", { method: "GET", headers: authHeaders() }),
  addFavorite: async (doctorId) => apiRequest(`/api/Favorites/${doctorId}`, { method: "POST", headers: authHeaders() }),
  removeFavorite: async (doctorId) => apiRequest(`/api/Favorites/${doctorId}`, { method: "DELETE", headers: authHeaders() }),
  checkFavorite: async (doctorId) => apiRequest(`/api/Favorites/check/${doctorId}`, { method: "GET", headers: authHeaders() }),
}

export const authAPI = {
  login: async (email, password) => apiRequest("/api/Auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: async (data) => apiRequest("/api/Auth/register", { method: "POST", body: JSON.stringify(data) }),
  forgot: async (email) => apiRequest("/api/Auth/forgot", { method: "POST", body: JSON.stringify({ email }) }),
  reset: async (token, newPassword) => apiRequest("/api/auth/reset", { method: "POST", body: JSON.stringify({ token, newPassword }) })
}

export const bookingAPI = {
  getAppointments: () => apiRequest("/api/booking/user", { method: "GET", headers: authHeaders() }),
  createBooking: (bookingData) => apiRequest("/api/booking", { method: "POST", headers: authHeaders(), body: JSON.stringify(bookingData) })
}

export const doctorsAPI = {
  getAll: () => apiRequest("/api/doctors", { method: "GET" }),
  getByName: (name) => apiRequest(`/api/doctors?name=${encodeURIComponent(name)}`, { method: "GET" }),
  getBySpecialization: (specialization) => apiRequest(`/api/doctors?specialization=${encodeURIComponent(specialization)}`, { method: "GET" })
}
