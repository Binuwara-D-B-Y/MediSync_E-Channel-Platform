import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography 
} from '@mui/material';
import ModernLayout from '../components/ModernLayout';
import FindDoctors from '../components/FindDoctors';

export default function PatientDashboard() {
  // 🔹 State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [doctors, setDoctors] = useState([]);
  const [doctorsByName, setDoctorsByName] = useState([]);
  const [doctorsBySpec, setDoctorsBySpec] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [displayMode, setDisplayMode] = useState('default');

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
          const [nameRes, specRes] = await Promise.all([
            fetch(`/api/doctors/search?query=${encodeURIComponent(searchTerm)}`),
            fetch(`/api/doctors/specialization/${encodeURIComponent(selectedSpecialization)}`)
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
          const res = await fetch(`/api/doctors/specialization/${encodeURIComponent(selectedSpecialization)}`);
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
