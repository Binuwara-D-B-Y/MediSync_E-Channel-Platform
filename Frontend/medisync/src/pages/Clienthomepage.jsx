import React, { useState, useMemo } from 'react';
import DashboardWrapper from '../components/DashboardWrapper';
import WelcomeCard from '../components/WelcomeCard';
import QuickStats from '../components/QuickStats';
import FindDoctors from '../components/FindDoctors';
import Header from '../components/Header';

export default function PatientDashboard() {
  // 🔹 State (UNCHANGED)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [doctors, setDoctors] = useState([]);
  const [doctorsByName, setDoctorsByName] = useState([]);
  const [doctorsBySpec, setDoctorsBySpec] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [displayMode, setDisplayMode] = useState('default');

  // 🔹 ADD THIS LINE (same as your original)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
            // ✅ FIXED: Add ${API_BASE_URL}
            fetch(`${API_BASE_URL}/api/doctors?name=${encodeURIComponent(searchTerm)}`),
            fetch(`${API_BASE_URL}/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`)
          ]);
          
          if (!nameRes.ok || !specRes.ok) {
            throw new Error('Failed to fetch doctors');
          }
          
          const [nameData, specData] = await Promise.all([nameRes.json(), specRes.json()]);
          setDoctorsByName(nameData);
          setDoctorsBySpec(specData);

          // ... ALL YOUR RULES LOGIC UNCHANGED ...
          if ((!nameData || nameData.length === 0) && (specData && specData.length > 0)) {
            setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
            setDoctors(specData);
            setDisplayMode('specOnly');
          } else {
            const nameMatchesSelectedSpec = (nameData || []).some(d => (d.specialization || '').toLowerCase() === selectedSpecialization.toLowerCase());
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
          let res = await fetch(`${API_BASE_URL}/api/doctors?name=${encodeURIComponent(searchTerm)}`);
          if (!res.ok) throw new Error('Failed to fetch doctors by name');
          
          let data = await res.json();
          if (!data || data.length === 0) {
            res = await fetch(`${API_BASE_URL}/api/doctors`);
            if (!res.ok) throw new Error('Failed to fetch all doctors');
            const all = await res.json();
            const q = searchTerm.toLowerCase();
            data = (all || []).filter(d => (d.fullName || d.name || '').toLowerCase().includes(q));
          }
          setDoctors(data || []);
          setDisplayMode('nameOnly');
        } else if (hasSpec) {
          const res = await fetch(`${API_BASE_URL}/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`);
          if (!res.ok) throw new Error('Failed to fetch doctors by specialization');
          const data = await res.json();
          setDoctorsBySpec(data || []);
          setDoctors(data || []);
          setDisplayMode('specOnly');
        } else {
          const res = await fetch(`${API_BASE_URL}/api/doctors`);
          if (!res.ok) throw new Error('Failed to fetch all doctors');
          const data = await res.json();
          setDoctors(data || []);
          setDisplayMode('default');
        }
      } catch (err) {
        console.error('Search failed', err);  // ✅ Changed to error
        setSearchMessage('Error fetching doctors. Please try again.');
        setDoctors([]);
      } finally {
        setLoadingDoctors(false);
      }
    }
    fetchWithRules();
  }, [searchTerm, selectedSpecialization, API_BASE_URL]);  // ✅ Add dependency

  // 🔹 RETURN UNCHANGED
  return (
    <DashboardWrapper>
      <WelcomeCard name={'User'} />
      <QuickStats />
      <div className="quick-stats-grid" style={{margin:'2rem 0'}}>
        <div className="quick-stat-card">
          <div className="quick-stat-icon blue"><span role="img" aria-label="calendar">📅</span></div>
          <div>
            <p className="quick-stat-label">Next Appointment</p>
            <p className="quick-stat-value">No upcoming appointments</p>
          </div>
        </div>
      </div>
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
    </DashboardWrapper>
  );
}


