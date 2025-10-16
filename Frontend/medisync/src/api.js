// Auto-detect backend port
let API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE;
const BACKEND_PORTS = [5001, 5000, 5002, 5003];

// Function to detect available backend port
async function detectBackendPort() {
	if (API_BASE) return API_BASE;
	
	for (const port of BACKEND_PORTS) {
		try {
			const testUrl = `http://localhost:${port}/api/test/users`;
			const response = await fetch(testUrl, { method: 'GET' });
			if (response.status !== 0) {
				API_BASE = `http://localhost:${port}`;
				console.log(`Backend detected on port ${port}`);
				return API_BASE;
			}
		} catch (error) {
			// Continue to next port
		}
	}
	
	// Fallback to default
	API_BASE = 'http://localhost:5001';
	return API_BASE;
}

export async function apiRequest(path, options = {}) {
	if (!API_BASE) {
		API_BASE = await detectBackendPort();
	}
	
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
