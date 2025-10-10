const ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'medisync-api.com'];
const DEFAULT_API_BASE = 'http://localhost:5090';

export const API_BASE = (() => {
	const envBase = import.meta.env.VITE_API_BASE || window.__API_BASE || DEFAULT_API_BASE;
	try {
		const url = new URL(envBase);
		if (!ALLOWED_HOSTS.includes(url.hostname)) {
			console.warn('Invalid API host, using default');
			return DEFAULT_API_BASE;
		}
		return envBase;
	} catch {
		return DEFAULT_API_BASE;
	}
})();

export async function apiRequest(path, options = {}) {
	try {
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
	} catch (error) {
		console.error('API request failed:', error);
		throw error;
	}
}

export function authHeaders() {
	const token = localStorage.getItem('token');
	return token ? { Authorization: `Bearer ${token}` } : {};
}
