<<<<<<< HEAD
import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Button,
  TextField,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  alpha,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ModernLayout from '../components/ModernLayout';
import { mockUserProfile } from '../data/mockData.js';

export default function UserAccount() {
  const [profile, setProfile] = useState({
    ...mockUserProfile,
    password: 'password123',
    image: null
  });
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedProfile({ ...editedProfile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setEditMode(false);
    console.log('Profile updated:', editedProfile);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted:', profile.email);
    }
  };

  const transactions = [
    { id: 1, date: '2025-09-01', amount: 50, description: 'Consultation with Dr. Lakshan Pathirana', type: 'Cardiology' },
    { id: 2, date: '2025-08-20', amount: 60, description: 'Neurology Checkup with Dr. Mahima Bashitha', type: 'Neurology' },
    { id: 3, date: '2025-08-15', amount: 45, description: 'Dermatology Session with Dr. Nadeesha Perera', type: 'Dermatology' },
  ];

  return (
    <ModernLayout title="My Account" subtitle="Manage your profile and settings">
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 800, 
          color: '#1e293b',
          mb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Account Settings 👤
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Manage your personal information and view your transaction history.
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        mb: 3
      }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid #e2e8f0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#64748b',
              '&.Mui-selected': {
                color: '#667eea',
              }
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              height: 3,
              borderRadius: '2px'
            }
          }}
        >
          <Tab icon={<AccountCircleIcon />} label="Profile Information" />
          <Tab icon={<PaymentIcon />} label="Transaction History" />
        </Tabs>
      </Card>

      {/* Profile Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            {/* Profile Image Card */}
            <Card sx={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              overflow: 'hidden',
              position: 'relative',
              height: 'fit-content'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto',
                    background: imagePreview || profile.image ? 'transparent' : alpha('#fff', 0.2),
                    fontSize: '3rem'
                  }}>
                    {imagePreview || profile.image ? (
                      <img 
                        src={imagePreview || profile.image} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      profile.name?.charAt(0) || 'U'
                    )}
                  </Avatar>
                  {editMode && (
                    <IconButton
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: '#fff',
                        color: '#667eea',
                        width: 40,
                        height: 40,
                        '&:hover': { background: '#f8fafc' }
                      }}
                    >
                      <PhotoCameraIcon />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </IconButton>
                  )}
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {profile.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                  {profile.email}
                </Typography>
                <Chip 
                  label="Active Patient" 
                  sx={{ 
                    background: alpha('#fff', 0.2),
                    color: '#fff',
                    fontWeight: 600
                  }} 
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Profile Details Card */}
            <Card sx={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                    Personal Information
                  </Typography>
                  {!editMode ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditMode(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: '#fff',
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          }
                        }}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditMode(false);
                          setEditedProfile({ ...profile });
                          setImagePreview(null);
                        }}
                        sx={{
                          color: '#64748b',
                          borderRadius: '12px',
                          textTransform: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={editMode ? editedProfile.name : profile.name}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={editMode ? editedProfile.email : profile.email}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={editMode ? editedProfile.phone : profile.phone}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type="password"
                      value={editMode ? editedProfile.password : '••••••••'}
                      onChange={handleChange}
                      disabled={!editMode}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  </Grid>
                </Grid>

                {!editMode && (
                  <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e2e8f0' }}>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      sx={{
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#fff',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Transactions Tab */}
      {activeTab === 1 && (
        <Card sx={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 4, borderBottom: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Transaction History
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                View your payment history and appointment charges
              </Typography>
            </Box>
            
            {transactions.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <PaymentIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  No transactions found
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Your payment history will appear here
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {transactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem sx={{ py: 3, px: 4 }}>
                      <ListItemAvatar>
                        <Avatar sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          width: 48,
                          height: 48
                        }}>
                          <LocalHospitalIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {transaction.description}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                              {transaction.date} • {transaction.type}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: '#10b981',
                          mb: 0.5
                        }}>
                          ${transaction.amount}
                        </Typography>
                        <Chip 
                          label="Completed" 
                          size="small" 
                          sx={{ 
                            background: alpha('#10b981', 0.1),
                            color: '#10b981',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </Box>
                    </ListItem>
                    {index < transactions.length - 1 && <Divider sx={{ mx: 4 }} />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </ModernLayout>
  );
}
=======
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
>>>>>>> wishlist
