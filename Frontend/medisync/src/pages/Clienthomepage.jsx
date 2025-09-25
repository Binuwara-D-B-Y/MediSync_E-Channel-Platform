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

  // 🔹 Fetch doctors with rules
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
          // ✅ Specialization ID lookup
          const specsRes = await fetch('/api/specializations');
          const specsResponse = await specsRes.json();
          const specializations = specsResponse.data || [];
          const selectedSpec = specializations.find(s => s.name === selectedSpecialization);

          const [nameRes, specRes] = await Promise.all([
            fetch(`/api/doctors/search?query=${encodeURIComponent(searchTerm)}`),
            selectedSpec ? fetch(`/api/doctors/specialization/${selectedSpec.specializationId}`) : Promise.resolve({ json: () => ({ data: [] }) })
          ]);

          const [nameResponse, specResponse] = await Promise.all([nameRes.json(), specRes.json()]);
          const nameData = nameResponse.data || [];
          const specData = specResponse.data || [];

          setDoctorsByName(nameData);
          setDoctorsBySpec(specData);

          if ((!nameData || nameData.length === 0) && (specData && specData.length > 0)) {
            setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
            setDoctors(specData);
            setDisplayMode('specOnly');
          } else {
            const nameMatchesSelectedSpec = (nameData || []).some(
              d => (d.specializationName || '').toLowerCase() === selectedSpecialization.toLowerCase()
            );
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
          let response = await res.json();
          let data = response.data || [];
          if (!data || data.length === 0) {
            const allRes = await fetch('/api/doctors');
            const allResponse = await allRes.json();
            const all = allResponse.data || [];
            const q = searchTerm.toLowerCase();
            data = all.filter(d => (d.fullName || d.name || '').toLowerCase().includes(q));
          }
          setDoctors(data || []);
          setDisplayMode('nameOnly');
        } else if (hasSpec) {
          const specsRes = await fetch('/api/specializations');
          const specsResponse = await specsRes.json();
          const specializations = specsResponse.data || [];
          const selectedSpec = specializations.find(s => s.name === selectedSpecialization);

          if (selectedSpec) {
            const res = await fetch(`/api/doctors/specialization/${selectedSpec.specializationId}`);
            const response = await res.json();
            const data = response.data || [];
            setDoctorsBySpec(data);
            setDoctors(data);
            setDisplayMode('specOnly');
          } else {
            setDoctors([]);
            setDisplayMode('specOnly');
          }
        } else {
          const res = await fetch('/api/doctors');
          const response = await res.json();
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
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#1e293b',
            mb: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Find Your Doctor 🔍
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1.1rem' }}>
          Search and book appointments with our qualified medical professionals.
        </Typography>
      </Box>

      {/* Find Doctors Section */}
      <Card
        sx={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}
      >
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
