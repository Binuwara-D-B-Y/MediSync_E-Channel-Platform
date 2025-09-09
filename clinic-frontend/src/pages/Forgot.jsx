import { useState } from 'react';
import { apiRequest } from '../api';

export default function Forgot() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function submit(e) {
		e.preventDefault();
		setMessage(''); setError(''); setLoading(true);
		try {
			const res = await apiRequest('/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email }) });
			setMessage(res.data || res.message || 'If the email exists, a reset link has been sent.');
		} catch (e) { setError(e.message); }
		finally { setLoading(false); }
	}

	return (
		<div className="card">
			<h2>Forgot Password</h2>
			<form onSubmit={submit} className="form">
				<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
				{message && <div className="success">{message}</div>}
				{error && <div className="error">{error}</div>}
				<button className="btn primary" disabled={loading}>{loading ? 'Sending...' : 'Send Reset'}</button>
			</form>
		</div>
	);
}
