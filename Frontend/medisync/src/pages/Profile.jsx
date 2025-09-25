"use client"

import { useEffect, useState } from "react"
import { apiRequest, authHeaders } from "../api"

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [edit, setEdit] = useState({ phone: "", address: "", nic: "", newPassword: "" })
  const [msg, setMsg] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  async function load() {
    setErr("")
    try {
      const res = await apiRequest("/api/patient/me", { headers: authHeaders() })
      setProfile(res.data)
      setEdit({
        phone: res.data.phone || "",
        address: res.data.address || "",
        nic: res.data.nic || "",
        newPassword: "",
      })
    } catch (e) {
      setErr(e.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function save(e) {
    e.preventDefault()
    setMsg("")
    setErr("")
    setLoading(true)

    try {
      const res = await apiRequest("/api/patient/me", {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(edit),
      })
      setMsg(res.message || "Profile updated successfully")
      setProfile(res.data)
      setEdit((prev) => ({ ...prev, newPassword: "" }))
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function removeAccount() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return

    try {
      await apiRequest("/api/patient/me", {
        method: "DELETE",
        headers: authHeaders(),
        body: JSON.stringify({ confirm: true }),
      })
      localStorage.removeItem("token")
      location.href = "/login"
    } catch (e) {
      setErr(e.message)
    }
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">{err ? `Error: ${err}` : "Loading your profile..."}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="auth-header">
          <h2>My Profile</h2>
          <p>Manage your personal information and account settings</p>
        </div>

        <div className="profile-grid">
          <div className="profile-item">
            <strong>Full Name</strong>
            <span>{profile.name}</span>
          </div>
          <div className="profile-item">
            <strong>Email Address</strong>
            <span>{profile.email}</span>
          </div>
        </div>

        <form onSubmit={save} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Phone Number</label>
              <input
                value={edit.phone}
                onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>NIC Number</label>
              <input
                value={edit.nic}
                onChange={(e) => setEdit({ ...edit, nic: e.target.value })}
                placeholder="Enter your NIC number"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              value={edit.address}
              onChange={(e) => setEdit({ ...edit, address: e.target.value })}
              placeholder="Enter your address"
            />
          </div>

          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={edit.newPassword}
              onChange={(e) => setEdit({ ...edit, newPassword: e.target.value })}
              placeholder="Enter new password"
              minLength={6}
            />
          </div>

          {msg && <div className="success">✅ {msg}</div>}
          {err && <div className="error">⚠️ {err}</div>}

          <div className="button-row">
            <button className="btn primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn danger" onClick={removeAccount}>
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
