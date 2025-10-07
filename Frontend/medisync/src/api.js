export const API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE || 'http://localhost:5000';

export async function apiRequest(path, options = {}) {
	const url = `${API_BASE}${path}`;
	const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
	const res = await fetch(url, { ...options, headers });
	const contentType = res.headers.get('content-type') || '';
	let data = null;
	if (contentType.includes('application/json')) {
		data = await res.json();
	} else {
		// try to capture plain text error bodies (DB exceptions etc.)
		const text = await res.text();
		if (text) data = { message: text };
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
