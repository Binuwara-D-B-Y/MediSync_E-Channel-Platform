"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { apiRequest } from "../../api"

export default function Reset() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setMessage("")
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    const token = searchParams.get('token')

    try {
      const res = await apiRequest("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })
      setMessage(res.message || "Password reset successful! You can now sign in with your new password.")
    } catch (e) {
      setError(e.message || "Password reset failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth-left {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .auth-right {
          flex: 1;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          backdrop-filter: blur(10px);
        }

        .card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h2 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .form-group input {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-group input::placeholder {
          color: #9ca3af;
        }

        .success {
          padding: 1rem;
          background: #dcfce7;
          color: #166534;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
          font-size: 0.875rem;
        }

        .error {
          padding: 1rem;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 8px;
          border: 1px solid #fecaca;
          font-size: 0.875rem;
        }

        .btn {
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn.primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .auth-footer p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .auth-footer a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-footer a:hover {
          text-decoration: underline;
        }

        .auth-right-content {
          text-align: center;
          color: white;
        }

        .medical-icon {
          width: 200px;
          height: 200px;
          margin: 0 auto 2.5rem auto;
          display: block;
          filter: drop-shadow(0 12px 40px rgba(0, 0, 0, 0.4));
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.95;
          border-radius: 20px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
        }

        .medical-icon:hover {
          transform: translateY(-8px) scale(1.05);
          filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.5));
          opacity: 1;
        }

        .auth-right-content h3 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .auth-right-content p {
          font-size: 1.2rem;
          opacity: 0.9;
          line-height: 1.6;
          max-width: 400px;
        }

        @media (max-width: 768px) {
          .auth-container {
            flex-direction: column;
          }

          .auth-right {
            display: none;
          }

          .card {
            padding: 2rem;
          }
        }
      `}</style>

      <div className="auth-container">
        <div className="auth-left">
          <div className="card">
            <div className="auth-header">
              <h2>Reset Password</h2>
              <p>Enter your reset token and new password</p>
            </div>

            <form onSubmit={submit} className="form">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
              </div>

              {message && <div className="success">✅ {message}</div>}
              {error && <div className="error">⚠️ {error}</div>}

              <button className="btn primary" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                <Link to="/login">Back to Sign In</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-right-content">
            <img
              src="\src\assets\oop.jpg"
              alt="Healthcare Medical Icon"
              className="medical-icon"
            />
            <h3>Almost There</h3>
            <p>
              Create a new secure password to regain access to your account.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

