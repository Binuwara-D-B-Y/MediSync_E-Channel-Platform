import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/FindDoctors.css';

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
        if (!res.ok) {
          throw new Error(`Specializations API error: ${res.status}`);
        }
        const resText = await res.text();
        const response = resText ? JSON.parse(resText) : { data: [] };
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
  };

  // Filter doctors for dropdown (from backend data)
  const filteredDropdown = localSearchTerm
    ? doctors.filter((doctor) =>
        (doctor.fullName || doctor.name)?.toLowerCase().includes(localSearchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="find-doctors">
      <h2 className="find-doctors-title">Find Doctors</h2>
      <div className="find-doctors-filters">
        <div className="search-box" style={{ position: 'relative' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={localSearchTerm}
            onChange={(e) => {
              setLocalSearchTerm(e.target.value);
              setShowDropdown(!!e.target.value);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => setShowDropdown(!!localSearchTerm)}
            autoComplete="off"
          />
          {showDropdown && filteredDropdown.length > 0 && (
            <ul className="doctor-dropdown">
              {filteredDropdown.map((doctor) => (
                <li
                  key={doctor.userId || doctor.id}
                  onMouseDown={() => {
                    setLocalSearchTerm(doctor.fullName || doctor.name);
                    setShowDropdown(false);
                  }}
                >
                  {doctor.fullName || doctor.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="filter-box">
          <Filter size={18} />
          <select
            value={localSpecialization}
            onChange={(e) => setLocalSpecialization(e.target.value)}
          >
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
            const specialization = doctor.specializationName || doctor.specialization || 'General Practitioner';
            const image = doctor.profileImage || '/images/unnamed.png';
            return (
              <div className="doctor-card" key={doctor.doctorId || doctor.id}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem'}}>
                  <div style={{width:120, height:120, borderRadius:12, overflow:'hidden', background:'#f3f4f6', border:'1px solid #e5e7eb'}}>
                    <img src={image} alt={name} style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>{e.currentTarget.src='/vite.svg'}} />
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
  );
}