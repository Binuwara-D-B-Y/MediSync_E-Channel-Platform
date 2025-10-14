import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api.js';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus({ type: 'error', message: 'Reset token is missing from the URL.' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (password !== confirm) {
      setStatus({ type: 'error', message: "Passwords don't match" });
      return;
    }
    if (password.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/api/PasswordReset/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password })
      });
      setStatus({ type: 'success', message: res.message || 'Password reset successfully' });
      // After short delay navigate to login
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrpbox">
      <div style={{ maxWidth: 520, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8 }}>
        <h3>Reset Password</h3>
        {!token ? (
          <div style={{ color: 'crimson' }}>Missing token in URL. Use the link provided by the server.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
            </div>
          </form>
        )}

        {status && (
          <div style={{ marginTop: 12, color: status.type === 'error' ? 'crimson' : 'green' }}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
