import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Drawer, 
  List, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 280;

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = [
    { to: '/admin', label: 'Dashboard', icon: <DashboardIcon />, color: '#667eea' },
    { to: '/admin/doctors', label: 'Doctors', icon: <LocalHospitalIcon />, color: '#f093fb' },
    { to: '/admin/specializations', label: 'Specializations', icon: <CategoryIcon />, color: '#4facfe' },
    { to: '/admin/schedules', label: 'Schedules', icon: <ScheduleIcon />, color: '#43e97b' },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getCurrentPageTitle = () => {
    const currentItem = menu.find(item => item.to === location.pathname);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        borderBottom: `1px solid ${alpha('#fff', 0.1)}`
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <LocalHospitalIcon sx={{ color: '#667eea', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
            MediSync
          </Typography>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), fontSize: '0.75rem' }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ p: 2, mt: 4 }}>
        <List sx={{ p: 0 }}>
          {menu.map((item, index) => {
            const isSelected = location.pathname === item.to;
            return (
              <ListItemButton 
                key={item.to} 
                component={Link} 
                to={item.to}
                sx={{
                  mb: 1,
                  borderRadius: '16px',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                    : 'transparent',
                  backdropFilter: isSelected ? 'blur(10px)' : 'none',
                  border: isSelected ? `1px solid ${alpha('#fff', 0.2)}` : '1px solid transparent',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    transform: 'translateX(4px)',
                  },
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  '& .MuiSvgIcon-root': {
                    color: '#fff',
                    filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' : 'none'
                  }
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.9rem'
                  }}
                />
                {isSelected && (
                  <Box sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: '0 0 8px rgba(255,255,255,0.5)'
                  }} />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        p: 2,
        borderTop: `1px solid ${alpha('#fff', 0.1)}`
      }}>
        <Box sx={{
          p: 2,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.1)}`
        }}>
          <Typography variant="caption" sx={{ color: alpha('#fff', 0.8), display: 'block', mb: 0.5 }}>
            System Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#43e97b',
              boxShadow: '0 0 8px rgba(67, 233, 123, 0.5)'
            }} />
            <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
              All Systems Online
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Modern AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha('#e2e8f0', 0.5)}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          color: '#1e293b'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                {getCurrentPageTitle()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Welcome back, Admin
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                A
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth, 
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: { xs: 2, md: 4 },
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          minHeight: '100vh',
          pt: { xs: 10, md: 12 } // Moderate top padding for main content
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Outlet />
        </Box>
      </Box>

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
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/'); }}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
