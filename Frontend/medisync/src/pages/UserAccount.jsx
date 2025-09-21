

import React, { useState, useEffect } from 'react';
import { mockUserProfile } from '../data/mockData.js';
import '../styles/UserAccount.css';

export default function UserAccount() {
  // Dynamically load/unload Materialize CSS only for this page
  function loadMaterializeCSS() {
    const id = 'materialize-css-dynamic';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = '/node_modules/materialize-css/dist/css/materialize.min.css';
      document.head.appendChild(link);
    }
  }

  function unloadMaterializeCSS() {
    const link = document.getElementById('materialize-css-dynamic');
    if (link) {
      document.head.removeChild(link);
    }
  }

  useEffect(() => {
    loadMaterializeCSS();
    return () => unloadMaterializeCSS();
  }, []);

  const [profile, setProfile] = useState({
    ...mockUserProfile,
    password: 'password123',
    image: null
  });
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

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
    <div className='wrpbox'>
    <div className="account-wrapper">
      <div className="card-tabs" style={{marginBottom: '2rem'}}>
        <h3>Account Management</h3>
      </div>
      <div className="tab-nav" style={{display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.5rem'}}>
        <button
          className={activeTab === 'profile' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('profile')}
        >Profile</button>
        <button
          className={activeTab === 'transactions' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('transactions')}
        >Transaction History</button>
      </div>
      <div className="card-content">
        {activeTab === 'profile' && (
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
        )}
        {activeTab === 'transactions' && (
          <div className="transactions-section">
            {transactions.length === 0 ? (
              <div style={{textAlign:'center', color:'#888', fontSize:'1.1rem', padding:'2rem'}}>No transactions found.</div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="transaction-card">
                  <p><strong>Date:</strong> {transaction.date}</p>
                  <p><strong>Amount:</strong> ${transaction.amount}</p>
                  <p><strong>Description:</strong> {transaction.description}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
