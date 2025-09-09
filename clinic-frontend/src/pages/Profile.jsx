import { useEffect, useState } from 'react';
import { apiRequest, authHeaders } from '../api';

export default function Profile() {
	const [profile, setProfile] = useState(null);
	const [edit, setEdit] = useState({ phone: '', address: '', nic: '', newPassword: '' });
	const [msg, setMsg] = useState('');
	const [err, setErr] = useState('');

	async function load() {
		setErr('');
		try {
			const res = await apiRequest('/api/patient/me', { headers: authHeaders() });
			setProfile(res.data);
			setEdit({ phone: res.data.phone || '', address: res.data.address || '', nic: res.data.nic || '', newPassword: '' });
		} catch (e) { setErr(e.message); }
	}

	useEffect(() => { load(); }, []);

	async function save(e) {
		e.preventDefault();
		setMsg(''); setErr('');
		try {
			const res = await apiRequest('/api/patient/me', {
				method: 'PUT',
				headers: authHeaders(),
				body: JSON.stringify(edit)
			});
			setMsg(res.message || 'Profile updated');
			setProfile(res.data);
		} catch (e) { setErr(e.message); }
	}

	async function removeAccount() {
		if (!confirm('Are you sure?')) return;
		try {
			await apiRequest('/api/patient/me', {
				method: 'DELETE',
				headers: authHeaders(),
				body: JSON.stringify({ confirm: true })
			});
			localStorage.removeItem('token');
			location.href = '/login';
		} catch (e) { setErr(e.message); }
	}

	if (!profile) return <div className="card"><div>Loading...</div>{err && <div className="error">{err}</div>}</div>;

	return (
		<div className="card">
			<h2>My Profile</h2>
			<div className="grid">
				<div><strong>Name:</strong> {profile.name}</div>
				<div><strong>Email:</strong> {profile.email}</div>
			</div>
			<form onSubmit={save} className="form">
				<label>Phone<input value={edit.phone} onChange={e => setEdit({ ...edit, phone: e.target.value })} /></label>
				<label>Address<input value={edit.address} onChange={e => setEdit({ ...edit, address: e.target.value })} /></label>
				<label>NIC<input value={edit.nic} onChange={e => setEdit({ ...edit, nic: e.target.value })} /></label>
				<label>New Password<input type="password" value={edit.newPassword} onChange={e => setEdit({ ...edit, newPassword: e.target.value })} /></label>
				{msg && <div className="success">{msg}</div>}
				{err && <div className="error">{err}</div>}
				<div className="row">
					<button className="btn primary">Save</button>
					<button type="button" className="btn danger" onClick={removeAccount}>Delete Account</button>
				</div>
			</form>
		</div>
	);
}
