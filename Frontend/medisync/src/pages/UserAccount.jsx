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
