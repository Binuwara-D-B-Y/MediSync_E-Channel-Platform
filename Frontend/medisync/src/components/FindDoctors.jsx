<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
} from "@mui/material";
import { Search, CalendarToday } from "@mui/icons-material";
=======
import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import '../styles/FindDoctors.css';
>>>>>>> wishlist

const FindDoctors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Mock doctor data
    const mockDoctors = [
      { id: 1, name: "Dr. Amal Perera", specialization: "Cardiologist", experience: 12 },
      { id: 2, name: "Dr. Nimal Silva", specialization: "Dermatologist", experience: 8 },
      { id: 3, name: "Dr. Ruwan Jayasuriya", specialization: "Neurologist", experience: 15 },
      { id: 4, name: "Dr. Chamodi Fernando", specialization: "Dentist", experience: 5 },
    ];
    setDoctors(mockDoctors);
    setFilteredDoctors(mockDoctors);
  }, []);

  useEffect(() => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (specialization) {
      filtered = filtered.filter((doc) => doc.specialization === specialization);
    }

    if (appointmentDate) {
      // Normally filter based on availability
      console.log("Filtering for date:", appointmentDate);
    }

    setFilteredDoctors(filtered);
  }, [searchTerm, specialization, appointmentDate, doctors]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const matched = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        background: "linear-gradient(135deg, #f0f4f8, #e0eafc)",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
        Find a Doctor
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by doctor name"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "gray" }} />,
            }}
          />
          {suggestions.length > 0 && (
            <Box
              sx={{
                border: "1px solid #ccc",
                borderRadius: "4px",
                mt: 1,
                bgcolor: "white",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {suggestions.map((s) => (
                <Box
                  key={s.id}
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => {
                    setSearchTerm(s.name);
                    setSuggestions([]);
                  }}
                >
                  {s.name}
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>Specialization</InputLabel>
            <Select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              label="Specialization"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Cardiologist">Cardiologist</MenuItem>
              <MenuItem value="Dermatologist">Dermatologist</MenuItem>
              <MenuItem value="Neurologist">Neurologist</MenuItem>
              <MenuItem value="Dentist">Dentist</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            type="date"
            label="Appointment Date"
            InputLabelProps={{ shrink: true }}
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            InputProps={{
              startAdornment: <CalendarToday sx={{ mr: 1, color: "gray" }} />,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              height: "100%",
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#115293" },
            }}
          >
<<<<<<< HEAD
            Search
          </Button>
        </Grid>
      </Grid>

      {/* Doctor Cards */}
      <Grid container spacing={3}>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  boxShadow: 3,
                  borderRadius: 3,
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
                }}
              >
                <Avatar sx={{ width: 64, height: 64, mr: 2, bgcolor: "#1976d2" }}>
                  {doctor.name.charAt(0)}
                </Avatar>
                <CardContent>
                  <Typography variant="h6">{doctor.name}</Typography>
                  <Typography color="text.secondary">
                    {doctor.specialization}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.experience} years of experience
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1, borderRadius: 2 }}
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ mt: 4, textAlign: "center", width: "100%" }}>
            No doctors found.
          </Typography>
        )}
      </Grid>
    </Box>
=======
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="find-doctors-extra">
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="appointment-date-input"
        />
        <button className="doctor-search-btn" onClick={handleSearch}>Search</button>
      </div>
      {loading && <div style={{padding:'1rem 1.5rem', color:'#888'}}>Loading doctors...</div>}
      {/* Single unified grid per rules */}
      {!loading && (
        <div className="doctors-grid">
          {searchMessage && (
            <div className="no-results-content" style={{gridColumn:'1/-1', marginBottom:'0.5rem'}}>
              <p style={{color:'#b91c1c', fontWeight:600, textAlign:'center'}}>{searchMessage}</p>
            </div>
          )}
          {doctors.map((doctor) => {
            const name = doctor.fullName || doctor.name || 'Unknown Doctor';
            const specialization = doctor.specialization || 'General Practitioner';
            // Prefer backend image, fallback to default
            const image = doctor.profileImage || '/assets/unnamed.png';
            return (
              <div className="doctor-card" key={doctor.doctorId || doctor.id}>
                <div className="doctor-card-header">
                  <FavoriteButton
                    doctorId={doctor.doctorId || doctor.id}
                    initialIsFavorite={doctor.isFavorite || false}
                    onToggle={(isFav, msg) => {
                      // Show toast message
                      const toast = document.createElement('div');
                      toast.textContent = msg;
                      toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:12px 16px;border-radius:6px;z-index:1000;font-size:14px';
                      document.body.appendChild(toast);
                      setTimeout(() => document.body.removeChild(toast), 3000);
                    }}
                  />
                </div>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
                  <div style={{width:120, height:120, borderRadius:12, overflow:'hidden', background:'#f3f4f6', border:'1px solid #e5e7eb'}}>
                    <img src={image} alt={name} style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='src/assets/Elogo.png'}} />
                  </div>
                  <div className="doctor-name" style={{margin:0, textAlign:'center'}}>{name}</div>
                  <div className="doctor-spec" style={{textAlign:'center'}}>{specialization}</div>
                </div>
                  <button className="doctor-book-btn" style={{marginTop:'0.75rem'}} onClick={() => navigate(`/book/${doctor.doctorId || doctor.id}`)}>Book Now</button>
              </div>
            );
          })}
        </div>
      )}
      {!loading && doctors.length === 0 && (
        <div style={{padding:'1rem 1.5rem', color:'#6b7280'}}>No doctors found.</div>
      )}
    </div>
>>>>>>> wishlist
  );
};

export default FindDoctors;
