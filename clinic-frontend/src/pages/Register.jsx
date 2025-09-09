import { useState } from 'react';
import { apiRequest } from '../api';

export default function Register() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [nic, setNic] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError('');
		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}
		setMessage('');
		setLoading(true);
		try {
			const res = await apiRequest('/api/auth/register', {
				method: 'POST',
				body: JSON.stringify({ name, email, phone, nic, password })
			});
			setMessage(res.message || 'Registration successful.');
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="card">
			<h2>Register</h2>
			<form onSubmit={handleSubmit} className="form">
				<label>Name<input value={name} onChange={e => setName(e.target.value)} required /></label>
				<label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label>
				<label>Phone<input value={phone} onChange={e => setPhone(e.target.value)} required /></label>
				<label>NIC<input value={nic} onChange={e => setNic(e.target.value)} required /></label>
				<label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} /></label>
				<label>Confirm Password<input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} /></label>
				{message && <div className="success">{message}</div>}
				{error && <div className="error">{error}</div>}
				<button className="btn primary" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
			</form>
		</div>
	);
}
