import React, { useState, useEffect } from 'react';
import { mockUserProfile } from '../data/mockData.js';
import 'materialize-css/dist/css/materialize.min.css';
import '../styles/UserAccount.css';

export default function UserAccount() {
  const [profile, setProfile] = useState({
    ...mockUserProfile,
    password: 'password123',
    image: null
  });
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const tabs = document.querySelectorAll('.tabs');
    if (tabs.length) {
      window.M.Tabs.init(tabs, {});
    }
  }, []);

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

  const handleRemoveImage = () => {
    setImagePreview(null);
    setEditedProfile({ ...editedProfile, image: null });
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setEditMode(false);
    console.log('Profile updated:', editedProfile);
    alert('Profile updated successfully!');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted:', profile.email);
      alert('Account deleted successfully!');
    }
  };

  const transactions = [
    { id: 1, date: '2025-09-01', amount: 50, description: 'Consultation with Dr. Alice Johnson' },
    { id: 2, date: '2025-08-20', amount: 60, description: 'Neurology Checkup with Dr. Brian Smith' },
  ];

  return (
    <div className="account-wrapper">
      <div className="card-tabs">
        <div className="row mb-0">
          <div className="col s12 m8 offset-m2">
            <h3>Account Management</h3>
          </div>
        </div>
        <div className="row mb-0">
          <div className="col s12 m6 offset-m3">
            <ul className="tabs blue">
              <li className="tab col s6"><a href="#profile">Profile</a></li>
              <li className="tab col s6"><a href="#transactions">Transaction History</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="card-content">
        <div id="profile" className="col s12">
          <div className="profile-section">
            <div className="profile-image">
              <div className="image-circle">
                {imagePreview || profile.image ? (
                  <img src={imagePreview || profile.image} alt="Profile" />
                ) : (
                  <span>Add Image</span>
                )}
              </div>
              {editMode && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              )}
              {imagePreview && editMode && (
                <button onClick={handleRemoveImage} style={{ marginTop: '10px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}>
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
                      <p>{profile.phone}</p>
                    </div>
                    <div className="col s6">
                      <label className="labels">Password</label>
                      <p>••••••••</p>
                    </div>
                  </div>
                </div>
                <div className="button-group">
                  <button onClick={() => setEditMode(true)}>Edit Profile</button>
                  <button className="delete-btn" onClick={handleDelete}>Delete Profile</button>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <div className="profile-details">
                  <div className="row">
                    <div className="col s6">
                      <label className="labels">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editedProfile.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col s6">
                      <label className="labels">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s6">
                      <label className="labels">Contact Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedProfile.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col s6">
                      <label className="labels">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={editedProfile.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="button-group">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                  <button className="delete-btn" onClick={handleDelete}>Delete Profile</button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div id="transactions" className="col s12">
          <div className="transactions-section">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="transaction-card">
                <p><strong>Date:</strong> {transaction.date}</p>
                <p><strong>Amount:</strong> ${transaction.amount}</p>
                <p><strong>Description:</strong> {transaction.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}