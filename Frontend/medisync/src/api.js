export const API_BASE = import.meta.env.VITE_API_BASE || window.__API_BASE || 'http://localhost:5000';

function joinPath(base, path) {
	if (!path) return base;
	// ensure single slash between base and path
	return base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}

export async function apiRequest(path, options = {}) {
	const url = joinPath(API_BASE, path);
	console.log('Making request to:', url); // Helpful for debugging
	const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
	const res = await fetch(url, { ...options, headers });  
	console.log('Response status:', res.status); // Helpful for debugging
	const contentType = res.headers.get('content-type') || '';
	let data = null;
	let textBody = null;
	if (contentType.includes('application/json')) {
		try {
			data = await res.json();
		} catch (e) {
			// fallback to text if json parsing fails
			textBody = await res.text();
		}
	} else {
		textBody = await res.text();
	}
	if (!res.ok) {
		const serverMessage = (data && (data.message || data.Message)) || textBody;
		throw new Error(serverMessage ? `${serverMessage} (status ${res.status})` : `Request failed: ${res.status}`);
	}
	return data;
}

export function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}
