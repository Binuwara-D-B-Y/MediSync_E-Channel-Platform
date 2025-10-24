"use client"

import { useState, useEffect } from "react"
import { userAPI } from "../api.js"
import "../styles/UserAccount.css"

// Complete user account management page with profile editing and transaction history
export default function UserAccount() {
  // Load Materialize CSS just for this page to avoid conflicts
  function loadMaterializeCSS() {
    const id = "materialize-css-dynamic"
    if (!document.getElementById(id)) {
      const link = document.createElement("link")
      link.id = id
      link.rel = "stylesheet"
      link.href = "/node_modules/materialize-css/dist/css/materialize.min.css"
      document.head.appendChild(link)
    }
  }

  function unloadMaterializeCSS() {
    const link = document.getElementById("materialize-css-dynamic")
    if (link) {
      document.head.removeChild(link)
    }
  }

  useEffect(() => {
    loadMaterializeCSS()
    return () => unloadMaterializeCSS()
  }, [])

  // Main profile data and editing state
  const [profile, setProfile] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [transactions, setTransactions] = useState([])

  // UI state management
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  // Load user data when page opens
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")

        // Get user profile info
        const profileData = await userAPI.getProfile()
        setProfile(profileData)
        setEditedProfile(profileData)

        // Get payment history
        const transactionsData = await userAPI.getTransactions()
        setTransactions(transactionsData)
      } catch (err) {
        console.error("[v0] Error fetching data:", err)
        setError(err.message || "Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedProfile({ ...editedProfile, [name]: value })
  }

  // Handle profile image upload with size validation
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const MAX_FILE_SIZE = 1024 * 1024 // 1MB limit
    if (file.size > MAX_FILE_SIZE) {
      setError("Image size exceeds 1MB limit. Please choose a smaller image.")
      return
    }

    // Convert image to base64 for sending to server
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
      setEditedProfile({ ...editedProfile, imageBase64: reader.result })
      setError("")
    }
    reader.onerror = () => {
      setError("Failed to read image file")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setEditedProfile({ ...editedProfile, imageBase64: null })
  }

  // Save profile changes to server
  const handleSave = async () => {
    try {
      setSaving(true)
      setError("")
      setSuccessMessage("")

      const updatedProfile = await userAPI.updateProfile({
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        imageBase64: editedProfile.imageBase64,
      })

      setProfile(updatedProfile)
      setEditedProfile(updatedProfile)
      setEditMode(false)
      setImagePreview(null)
      setSuccessMessage("Profile updated successfully!")

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("[v0] Error updating profile:", err)
      setError(err.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Permanently delete account with confirmation
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      setSaving(true)
      setError("")

      await userAPI.deleteAccount()

      // Clean up and redirect after successful deletion
      setSuccessMessage("Account deleted successfully. Redirecting...")
      setTimeout(() => {
        localStorage.removeItem("authToken")
        window.location.href = "/login"
      }, 2000)
    } catch (err) {
      console.error("[v0] Error deleting account:", err)
      setError(err.message || "Failed to delete account")
      setSaving(false)
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({ ...passwordForm, [name]: value })
    setPasswordError("")
  }

  // Handle password change with validation
  const handlePasswordSave = async (e) => {
    e.preventDefault()

    // Check password requirements before sending to server
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match.")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.")
      return
    }

    try {
      setSaving(true)
      setPasswordError("")

      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      })

      setSuccessMessage("Password changed successfully!")
      setShowPasswordModal(false)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" })

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      console.error("[v0] Error changing password:", err)
      setPasswordError(err.message || "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="wrpbox">
        <div className="account-wrapper">
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="wrpbox">
        <div className="account-wrapper">
          <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
            <p>Failed to load profile. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wrpbox">
      <div className="account-wrapper">
        <div className="card-tabs" style={{ marginBottom: "2rem" }}>
          <h3>Account Management</h3>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              padding: "1rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {successMessage}
          </div>
        )}

        <div
          className="tab-nav"
          style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "1.5rem" }}
        >
          <button
            className={activeTab === "profile" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "transactions" ? "tab-btn active" : "tab-btn"}
            onClick={() => setActiveTab("transactions")}
          >
            Transaction History
          </button>
        </div>

        <div className="card-content">
          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="profile-image">
                <div className="image-circle">
                  {imagePreview || profile.imageBase64 ? (
                    <img src={imagePreview || profile.imageBase64} alt="Profile" />
                  ) : (
                    <span>Add Image</span>
                  )}
                </div>
                {editMode && (
                  <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    <p style={{ fontSize: "0.85rem", color: "#666" }}>Max size: 1MB</p>
                  </div>
                )}
                {imagePreview && editMode && (
                  <button
                    onClick={handleRemoveImage}
                    style={{ marginTop: "10px", display: "block", marginLeft: "auto", marginRight: "auto" }}
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {!editMode ? (
                <div className="profile-view">
                  <div className="profile-details">
                    <div className="row">
                      <div className="col s6">
                        <label className="labels">Name</label>
                        <p>{profile.name}</p>
                      </div>
                      <div className="col s6">
                        <label className="labels">Email</label>
                        <p>{profile.email}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s6">
                        <label className="labels">Contact Number</label>
                        <p>{profile.phone || "Not provided"}</p>
                      </div>
                      <div className="col s6">
                        <label className="labels">Password</label>
                        <p>••••••••</p>
                      </div>
                    </div>
                  </div>
                  <div className="button-group">
                    <button
                      onClick={() => {
                        setEditMode(true)
                        setImagePreview(profile.imageBase64 || null)
                      }}
                    >
                      Edit Profile
                    </button>
                    <button className="delete-btn" onClick={handleDelete} disabled={saving}>
                      {saving ? "Deleting..." : "Delete Profile"}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                  }}
                >
                  <div className="profile-details">
                    <div className="row">
                      <div className="col s6">
                        <label className="labels">Name</label>
                        <input type="text" name="name" value={editedProfile.name} onChange={handleChange} required />
                      </div>
                      <div className="col s6">
                        <label className="labels">Email</label>
                        <input type="email" name="email" value={editedProfile.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s6">
                        <label className="labels">Contact Number</label>
                        <input type="tel" name="phone" value={editedProfile.phone} onChange={handleChange} />
                      </div>
                      <div className="col s6">
                        <label className="labels">Password</label>
                        <button type="button" onClick={() => setShowPasswordModal(true)} style={{ marginTop: "10px" }}>
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="button-group">
                    <button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false)
                        setEditedProfile(profile)
                        setImagePreview(null)
                      }}
                    >
                      Cancel
                    </button>
                    <button className="delete-btn" onClick={handleDelete} disabled={saving}>
                      {saving ? "Deleting..." : "Delete Profile"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "transactions" && (
            <div className="transactions-section">
              {transactions.length === 0 ? (
                <div style={{ textAlign: "center", color: "#888", fontSize: "1.1rem", padding: "2rem" }}>
                  No transactions found.
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-card">
                    <p>
                      <strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${transaction.amount.toFixed(2)}
                    </p>
                    <p>
                      <strong>Description:</strong> {transaction.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Password Edit Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h5 style={{ marginTop: 0 }}>Change Password</h5>
            {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
            <form onSubmit={handlePasswordSave}>
              <div className="row">
                <div className="col s12">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={passwordForm.confirmNewPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
                    setPasswordError("")
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
