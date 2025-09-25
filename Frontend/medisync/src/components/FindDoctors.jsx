import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  MenuItem,
  InputAdornment,
  alpha,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function FindDoctors({
  searchTerm,
  setSearchTerm,
  selectedSpecialization,
  setSelectedSpecialization,
  doctors,
  loading,
  displayMode,
  doctorsByName = [],
  doctorsBySpec = [],
  searchMessage = ''
}) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localSpecialization, setLocalSpecialization] = useState(selectedSpecialization);
  const [specializations, setSpecializations] = useState([]);

  // Fetch specializations from backend
  useEffect(() => {
    async function fetchSpecs() {
      try {
        const res = await fetch('/api/specializations');
        const response = await res.json();
        const data = response.data || [];
        setSpecializations(['All Specializations', ...data.map(spec => spec.name)]);
      } catch {
        setSpecializations(['All Specializations']);
      }
    }
    fetchSpecs();
  }, []);

  // Handler to trigger backend fetch with all filters
  const handleSearch = () => {
    setSearchTerm(localSearchTerm);
    setSelectedSpecialization(localSpecialization);
    // Optionally: pass appointmentDate to parent and use in backend fetch
  };

  // Filter doctors for dropdown (from backend data)
  const filteredDropdown = localSearchTerm
    ? doctors.filter((doctor) =>
        (doctor.fullName || doctor.name)?.toLowerCase().includes(localSearchTerm.toLowerCase())
      )
    : [];

  return (
    <Box>
      {/* Search and Filter Section */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0'
      }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search doctors by name..."
              value={localSearchTerm}
              onChange={(e) => {
                setLocalSearchTerm(e.target.value);
                setShowDropdown(!!e.target.value);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              onFocus={() => setShowDropdown(!!localSearchTerm)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  }
                }
              }}
            />
            {/* Dropdown for search suggestions */}
            {showDropdown && filteredDropdown.length > 0 && (
              <Paper sx={{
                position: 'absolute',
                zIndex: 1000,
                mt: 1,
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid #e2e8f0',
                maxHeight: 200,
                overflow: 'auto'
              }}>
                {filteredDropdown.map((doctor) => (
                  <Box
                    key={doctor.userId || doctor.id}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.02) 100%)',
                      }
                    }}
                    onMouseDown={() => {
                      setLocalSearchTerm(doctor.fullName || doctor.name);
                      setShowDropdown(false);
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {doctor.fullName || doctor.name}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Specialization"
              value={localSpecialization}
              onChange={(e) => setLocalSpecialization(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#fff'
                }
              }}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>{spec}</MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: '#fff'
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                }
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: '#667eea' }} />
        </Box>
      )}

      {/* Search Message */}
      {searchMessage && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#dc2626', fontWeight: 600 }}>
            {searchMessage}
          </Typography>
        </Box>
      )}

      {/* Doctors Grid */}
      {!loading && (
        <Grid container spacing={3}>
          {doctors.map((doctor) => {
            const name = doctor.fullName || doctor.name || 'Unknown Doctor';
            const specialization = doctor.specializationName || doctor.specialization || 'General Practitioner';
            const image = doctor.profileImage || '/images/unnamed.png';
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={doctor.doctorId || doctor.id}>
                <Card sx={{
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(102, 126, 234, 0.15)',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }
                }}>
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    {/* Doctor Avatar */}
                    <Avatar sx={{
                      width: 100,
                      height: 100,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2rem',
                      fontWeight: 700,
                      border: '4px solid #fff',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                    }}>
                      {image !== '/images/unnamed.png' ? (
                        <img 
                          src={image} 
                          alt={name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
                        />
                      ) : (
                        <LocalHospitalIcon sx={{ fontSize: 40, color: '#fff' }} />
                      )}
                    </Avatar>

                    {/* Doctor Name */}
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: '#1e293b',
                      mb: 1,
                      fontSize: '1.1rem'
                    }}>
                      {name}
                    </Typography>

                    {/* Specialization Chip */}
                    <Chip
                      label={specialization}
                      sx={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        color: '#667eea',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mb: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)'
                      }}
                    />

                    {/* Additional Info */}
                    {doctor.experienceYears && (
                      <Typography variant="caption" sx={{ 
                        color: '#64748b', 
                        display: 'block',
                        mb: 1
                      }}>
                        {doctor.experienceYears} years experience
                      </Typography>
                    )}

                    {doctor.hospitalName && (
                      <Typography variant="caption" sx={{ 
                        color: '#64748b', 
                        display: 'block',
                        mb: 2
                      }}>
                        📍 {doctor.hospitalName}
                      </Typography>
                    )}

                    {/* Book Now Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/book/${doctor.doctorId || doctor.id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600,
                        py: 1.2,
                        mt: 1,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* No Results */}
      {!loading && doctors.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6,
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
          borderRadius: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <LocalHospitalIcon sx={{ fontSize: 64, color: '#94a3b8', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
            No doctors found
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Try adjusting your search criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
}
