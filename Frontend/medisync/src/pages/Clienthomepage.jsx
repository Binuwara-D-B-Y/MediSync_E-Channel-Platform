import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Chip,
  LinearProgress,
  alpha,
  Paper
} from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CategoryIcon from '@mui/icons-material/Category';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ModernLayout from '../components/ModernLayout';
import FindDoctors from '../components/FindDoctors';

function ModernStatCard({ icon, label, value, subtitle, color }) {
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

export default function PatientDashboard() {
  // 🔹 State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [doctors, setDoctors] = useState([]);
  const [doctorsByName, setDoctorsByName] = useState([]);
  const [doctorsBySpec, setDoctorsBySpec] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [displayMode, setDisplayMode] = useState('default'); // kept for clarity, but we render one grid

  // Fetch doctors with custom rules
  React.useEffect(() => {
    async function fetchWithRules() {
      setLoadingDoctors(true);
      setSearchMessage('');
      setDisplayMode('default');
      setDoctorsByName([]);
      setDoctorsBySpec([]);

      const hasName = !!searchTerm.trim();
      const hasSpec = !!selectedSpecialization && selectedSpecialization !== 'All Specializations';

      try {
        if (hasName && hasSpec) {
          // Find specialization ID first
          const specsRes = await fetch('/api/specializations');
          if (!specsRes.ok) {
            throw new Error(`Specializations API error: ${specsRes.status}`);
          }
          const specsText = await specsRes.text();
          const specsResponse = specsText ? JSON.parse(specsText) : { data: [] };
          const specializations = specsResponse.data || [];
          const selectedSpec = specializations.find(s => s.name === selectedSpecialization);
          
          const [nameRes, specRes] = await Promise.all([
            fetch(`/api/doctors/search?query=${encodeURIComponent(searchTerm)}`),
            selectedSpec ? fetch(`/api/doctors/specialization/${selectedSpec.specializationId}`) : Promise.resolve({ ok: true, text: () => Promise.resolve('{}') })
          ]);
          
          if (!nameRes.ok) {
            throw new Error(`Doctors search API error: ${nameRes.status}`);
          }
          if (!specRes.ok) {
            throw new Error(`Doctors specialization API error: ${specRes.status}`);
          }
          
          const nameText = await nameRes.text();
          const specText = await specRes.text();
          const nameResponse = nameText ? JSON.parse(nameText) : { data: [] };
          const specResponse = specText ? JSON.parse(specText) : { data: [] };
          const nameData = nameResponse.data || [];
          const specData = specResponse.data || [];
          
          setDoctorsByName(nameData);
          setDoctorsBySpec(specData);

          // Rule 1: wrong name + correct specialization → show message + specialization doctors
          if ((!nameData || nameData.length === 0) && (specData && specData.length > 0)) {
            setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
            setDoctors(specData);
            setDisplayMode('specOnly');
          } else {
            // Rule 3: correct name + unmatched specialization → message + combine name + specialization (no split grids)
            const nameMatchesSelectedSpec = (nameData || []).some(d => (d.specializationName || '').toLowerCase() === selectedSpecialization.toLowerCase());
            if (!nameMatchesSelectedSpec && nameData && nameData.length > 0) {
              setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
              const map = new Map();
              [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
              setDoctors([...map.values()]);
              setDisplayMode('both');
            } else {
              // overlap or same spec → merge and show
              const map = new Map();
              [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
              setDoctors([...map.values()]);
              setDisplayMode('default');
            }
          }
        } else if (hasName) {
          const res = await fetch(`/api/doctors/search?query=${encodeURIComponent(searchTerm)}`);
          if (!res.ok) {
            throw new Error(`Doctors search API error: ${res.status}`);
          }
          const resText = await res.text();
          let response = resText ? JSON.parse(resText) : { data: [] };
          let data = response.data || [];
          if (!data || data.length === 0) {
            const allRes = await fetch('/api/doctors');
            if (!allRes.ok) {
              throw new Error(`Doctors API error: ${allRes.status}`);
            }
            const allText = await allRes.text();
            const allResponse = allText ? JSON.parse(allText) : { data: [] };
            const all = allResponse.data || [];
            const q = searchTerm.toLowerCase();
            data = all.filter(d => (d.fullName || d.name || '').toLowerCase().includes(q));
          }
          // Rule 4: name only
          setDoctors(data || []);
          setDisplayMode('nameOnly');
        } else if (hasSpec) {
          // Find specialization ID first
          const specsRes = await fetch('/api/specializations');
          if (!specsRes.ok) {
            throw new Error(`Specializations API error: ${specsRes.status}`);
          }
          const specsText = await specsRes.text();
          const specsResponse = specsText ? JSON.parse(specsText) : { data: [] };
          const specializations = specsResponse.data || [];
          const selectedSpec = specializations.find(s => s.name === selectedSpecialization);
          
          if (selectedSpec) {
            const res = await fetch(`/api/doctors/specialization/${selectedSpec.specializationId}`);
            if (!res.ok) {
              throw new Error(`Doctors specialization API error: ${res.status}`);
            }
            const resText = await res.text();
            const response = resText ? JSON.parse(resText) : { data: [] };
            const data = response.data || [];
            // Rule 2: just specialization
            setDoctorsBySpec(data);
            setDoctors(data);
            setDisplayMode('specOnly');
          } else {
            setDoctors([]);
            setDisplayMode('specOnly');
          }
        } else {
          const res = await fetch('/api/doctors');
          if (!res.ok) {
            throw new Error(`Doctors API error: ${res.status}`);
          }
          const resText = await res.text();
          const response = resText ? JSON.parse(resText) : { data: [] };
          const data = response.data || [];
          setDoctors(data);
          setDisplayMode('default');
        }
      } catch (err) {
        console.log('Search failed', err);
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchWithRules();
  }, [searchTerm, selectedSpecialization]);


  return (
    <ModernLayout title="Find Your Doctor" subtitle="Search and book appointments">
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
          Find Your Doctor 🔍
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Search and book appointments with our qualified medical professionals.
        </Typography>
      </Box>

      {/* Find Doctors Section */}
      <Card sx={{
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          <FindDoctors
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            doctors={doctors}
            loading={loadingDoctors}
            displayMode={displayMode}
            doctorsByName={doctorsByName}
            doctorsBySpec={doctorsBySpec}
            searchMessage={searchMessage}
          />
        </CardContent>
      </Card>
    </ModernLayout>
  );
}
