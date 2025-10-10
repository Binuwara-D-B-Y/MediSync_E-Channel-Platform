import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Button,
  alpha,
  Container
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';

export default function ModernLayout({ children, title = "MediSync", subtitle = "Patient Portal" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/patient', icon: <DashboardIcon /> },
    { label: 'My Account', path: '/account', icon: <PersonIcon /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Modern AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#e2e8f0', 0.5)}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          color: '#1e293b'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo */}
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
            }}>
              <LocalHospitalIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>

          {/* Navigation & Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Navigation Buttons */}
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                startIcon={item.icon}
                onClick={() => navigate(item.path)}
                sx={{
                  color: location.pathname === item.path ? '#667eea' : '#64748b',
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  background: location.pathname === item.path 
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)'
                    : 'transparent',
                  borderRadius: '12px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.03) 100%)',
                  }
                }}
              >
                {item.label}
              </Button>
            ))}

            <IconButton sx={{ color: '#64748b' }}>
              <NotificationsIcon />
            </IconButton>
            
            <Chip 
              label="Online" 
              size="small" 
              sx={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.75rem'
              }} 
            />
            
            <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
              <Avatar sx={{ 
                width: 36, 
                height: 36,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}>
                P
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          pt: 12, // Account for fixed AppBar
          pb: 4,
          minHeight: '100vh'
        }}
      >
        {children}
      </Container>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${alpha('#e2e8f0', 0.5)}`,
            minWidth: 200
          }
        }}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/account'); }}>
          <AccountCircleIcon sx={{ mr: 2, fontSize: 20 }} />
          My Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
