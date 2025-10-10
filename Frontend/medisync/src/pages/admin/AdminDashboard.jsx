import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress, 
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  alpha,
  useTheme
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DoctorsApi } from '../../api/admin/doctors';
import { SpecializationsApi } from '../../api/admin/specializations';
import { SchedulesApi } from '../../api/admin/schedules';

function ModernStatCard({ icon, label, value, trend, color, subtitle }) {
  const theme = useTheme();
  
  return (
    <Card sx={{
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      border: `1px solid ${alpha(color, 0.1)}`,
      borderRadius: '20px',
      overflow: 'hidden',
      position: 'relative',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 40px ${alpha(color, 0.15)}`,
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${alpha(color, 0.3)}`
          }}>
            {React.cloneElement(icon, { sx: { color: '#fff', fontSize: 28 } })}
          </Box>
          {trend && (
            <Chip 
              icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
              label={trend}
              size="small"
              sx={{
                background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>
        
        <Typography variant="h3" sx={{ 
          fontWeight: 800, 
          color: '#1e293b',
          mb: 0.5,
          background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.7)} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {value}
        </Typography>
        
        <Typography variant="h6" sx={{ 
          color: '#64748b', 
          fontWeight: 600,
          mb: 0.5
        }}>
          {label}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" sx={{ 
            color: '#94a3b8',
            fontSize: '0.8rem'
          }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
      
      {/* Decorative gradient overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: 100,
        background: `radial-gradient(circle, ${alpha(color, 0.1)} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
    </Card>
  );
}

function QuickStatsCard() {
  return (
    <Card sx={{
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          System Overview
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Active Doctors</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>100%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={100} 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha('#fff', 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#fff',
                borderRadius: 3
              }
            }}
          />
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Available Schedules</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>85%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={85} 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha('#fff', 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#43e97b',
                borderRadius: 3
              }
            }}
          />
        </Box>
        
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">System Health</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>98%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={98} 
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha('#fff', 0.2),
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#f093fb',
                borderRadius: 3
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

function RecentActivityCard() {
  const activities = [
    { icon: <LocalHospitalIcon />, title: 'New Doctor Added', subtitle: 'Dr. Mahima Bashitha joined', time: '2 hours ago', color: '#667eea' },
    { icon: <ScheduleIcon />, title: 'Schedule Updated', subtitle: '31 new time slots available', time: '4 hours ago', color: '#43e97b' },
    { icon: <CategoryIcon />, title: 'Specialization Added', subtitle: 'ENT department expanded', time: '1 day ago', color: '#f093fb' },
    { icon: <PeopleIcon />, title: 'System Maintenance', subtitle: 'Database optimization completed', time: '2 days ago', color: '#4facfe' },
  ];

  return (
    <Card sx={{
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Recent Activity
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Latest system updates and changes
          </Typography>
        </Box>
        
        <List sx={{ p: 0 }}>
          {activities.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ 
                py: 2, 
                px: 3,
                '&:hover': {
                  backgroundColor: alpha(activity.color, 0.05)
                }
              }}>
                <ListItemAvatar>
                  <Avatar sx={{
                    background: `linear-gradient(135deg, ${activity.color} 0%, ${alpha(activity.color, 0.8)} 100%)`,
                    width: 40,
                    height: 40
                  }}>
                    {React.cloneElement(activity.icon, { sx: { fontSize: 20 } })}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.title}
                  secondary={
                    <>
                      <Typography component="span" variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                        {activity.subtitle}
                      </Typography>
                      <Typography component="span" variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                        {activity.time}
                      </Typography>
                    </>
                  }
                  primaryTypographyProps={{
                    variant: 'body2',
                    sx: { fontWeight: 600, color: '#1e293b' }
                  }}
                />
              </ListItem>
              {index < activities.length - 1 && <Divider sx={{ mx: 3 }} />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ doctors: 0, schedules: 0 });

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [docStats, schedList] = await Promise.all([
          DoctorsApi.list(),
          SchedulesApi.list({ pageSize: 1 }),
        ]);
        if (!mounted) return;
        setStats({
          doctors: docStats?.data?.length || 0,
          schedules: schedList?.pagination?.totalCount || 0,
        });
      } catch (e) {
        console.error('Failed to load stats:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2
      }}>
        <CircularProgress size={48} sx={{ color: '#667eea' }} />
        <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
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
          Welcome back, Admin! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Here's what's happening with your medical center today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard 
            icon={<LocalHospitalIcon />}
            label="Total Doctors"
            value={stats.doctors}
            trend="+12%"
            color="#667eea"
            subtitle="Active medical professionals"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard 
            icon={<ScheduleIcon />}
            label="Schedules"
            value={stats.schedules}
            trend="+18%"
            color="#43e97b"
            subtitle="Available time slots"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={4}>
          <ModernStatCard 
            icon={<EventIcon />}
            label="Today's Appointments"
            value="24"
            trend="+8%"
            color="#4facfe"
            subtitle="Scheduled for today"
          />
        </Grid>
      </Grid>

      {/* Secondary Stats and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <QuickStatsCard />
        </Grid>
        <Grid item xs={12} lg={8}>
          <RecentActivityCard />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[
            { label: 'Add New Doctor', color: '#667eea', icon: <LocalHospitalIcon /> },
            { label: 'Create Schedule', color: '#43e97b', icon: <ScheduleIcon /> },
            { label: 'Manage Specializations', color: '#f093fb', icon: <CategoryIcon /> },
            { label: 'View Reports', color: '#4facfe', icon: <TrendingUpIcon /> },
          ].map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                p: 2,
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${action.color}10 0%, ${action.color}05 100%)`,
                border: `1px solid ${alpha(action.color, 0.1)}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(action.color, 0.15)}`,
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{
                    background: `linear-gradient(135deg, ${action.color} 0%, ${alpha(action.color, 0.8)} 100%)`,
                    width: 40,
                    height: 40
                  }}>
                    {React.cloneElement(action.icon, { sx: { fontSize: 20 } })}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {action.label}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
