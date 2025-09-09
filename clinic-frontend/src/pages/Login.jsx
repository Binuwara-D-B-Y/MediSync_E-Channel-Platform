import { useState } from 'react';
import { apiRequest } from '../api';

export default function Login({ onAuthed }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const res = await apiRequest('/api/auth/login', {
				method: 'POST',
				body: JSON.stringify({ email, password })
			});
			localStorage.setItem('token', res.data.token || res.data.Token || res.Token || res.token);
			onAuthed?.();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="card">
			<h2>Login</h2>
			<form onSubmit={handleSubmit} className="form">
				<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
				<label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>
				{error && <div className="error">{error}</div>}
				<button className="btn primary" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
			</form>
			<div style={{ marginTop: 12 }}>
				<a className="btn" href="/forgot">Forgot password?</a>
			</div>
		</div>
	);
}
