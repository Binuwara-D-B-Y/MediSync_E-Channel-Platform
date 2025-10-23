import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import FavoriteButton from './FavoriteButton';
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
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
        const data = await res.json();
        setSpecializations(['All Specializations', ...data]);
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
                    // Auto-select specialization if available
                    // if (doctor.specialization) {
                    //   setLocalSpecialization(doctor.specialization);
                    //   setSelectedSpecialization(doctor.specialization);
                    // }
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
            const specialization = doctor.specialization || 'General Practitioner';
            // Prefer backend image, fallback to default
            const image = doctor.profileImage || '/assets/unnamed.png';
            return (
              <div className="doctor-card" key={doctor.doctorId || doctor.id}>
<<<<<<< HEAD
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
=======
>>>>>>> e3f9d7c471bef687e3cfe49d18c5cc1252e5b0ee
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
  );
}
