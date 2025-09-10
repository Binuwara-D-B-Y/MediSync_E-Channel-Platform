import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/FindDoctors.css';

export default function FindDoctors({
  searchTerm,
  setSearchTerm,
  selectedSpecialization,
  setSelectedSpecialization,
  doctors,
  handleBookAppointment,
  loading
}) {
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
    </div>
  );
}
