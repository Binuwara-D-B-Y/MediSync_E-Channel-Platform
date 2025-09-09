import { useState } from 'react';
import { apiRequest } from '../api';

export default function Reset() {
	const [token, setToken] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function submit(e) {
		e.preventDefault();
		setMessage(''); setError(''); setLoading(true);
		try {
			const res = await apiRequest('/api/auth/reset', { method: 'POST', body: JSON.stringify({ token, newPassword: password }) });
			setMessage(res.message || 'Password reset successful.');
		} catch (e) { setError(e.message); }
		finally { setLoading(false); }
	}

	return (
		<div className="card">
			<h2>Reset Password</h2>
			<form onSubmit={submit} className="form">
				<label>Token<input value={token} onChange={e => setToken(e.target.value)} required /></label>
				<label>New Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></label>
				{message && <div className="success">{message}</div>}
				{error && <div className="error">{error}</div>}
				<button className="btn primary" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
			</form>
		</div>
	);
}
