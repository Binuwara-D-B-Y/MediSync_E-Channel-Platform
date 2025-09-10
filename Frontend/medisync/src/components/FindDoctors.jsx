import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import '../styles/FindDoctors.css';

export default function FindDoctors({
  searchTerm,
  setSearchTerm,
  selectedSpecialization,
  setSelectedSpecialization,
  specializations,
  doctors,
  handleBookAppointment
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');

  // Filter doctors for dropdown
  const filteredDropdown = searchTerm
    ? doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="find-doctors">
      <h2 className="find-doctors-title">Find Doctors</h2>

      {/* Search + Filter */}
      <div className="find-doctors-filters">
        <div className="search-box" style={{ position: 'relative' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(!!e.target.value);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            onFocus={() => setShowDropdown(!!searchTerm)}
            autoComplete="off"
          />
          {showDropdown && filteredDropdown.length > 0 && (
            <ul className="doctor-dropdown">
              {filteredDropdown.map((doctor) => (
                <li
                  key={doctor.id}
                  onMouseDown={() => {
                    setSearchTerm(doctor.name);
                    setShowDropdown(false);
                  }}
                >
                  {doctor.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="filter-box">
          <Filter size={18} />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointment Date + Search Button */}
      <div className="find-doctors-extra">
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          className="appointment-date-input"
        />
        <button className="doctor-search-btn">Search</button>
      </div>
    </div>
  );
}
