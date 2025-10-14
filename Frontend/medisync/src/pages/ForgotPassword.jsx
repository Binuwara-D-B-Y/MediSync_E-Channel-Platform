import React, { useState } from 'react';
import { apiRequest } from '../api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      const res = await apiRequest('/api/PasswordReset/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setStatus({ type: 'success', message: res.message || 'If that email exists we sent a reset link.' });
      // Server prints link to console, but we also show it when in dev (res.resetUrl)
      if (res.resetUrl) {
        console.log('Reset URL (dev):', res.resetUrl);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrpbox">
      <div style={{ maxWidth: 520, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 8 }}>
        <h3>Forgot Password</h3>
        <p>Enter your account email. If it exists we'll print a reset link to the server console.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        {status && (
          <div style={{ marginTop: 12, color: status.type === 'error' ? 'crimson' : 'green' }}>
            {status.message}
            {status.type === 'success' && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#444' }}>
                Note: check server console for the printed reset link during local development.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
