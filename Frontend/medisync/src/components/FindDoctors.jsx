import React from 'react';
import { Search, Filter, Clock, DollarSign, MapPin } from 'lucide-react';
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
  return (
    <div className="find-doctors">
      <h2 className="find-doctors-title">Find Doctors</h2>

      {/* Search + Filter */}
      <div className="find-doctors-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      {/* Doctors list */}
      <div className="doctors-grid">
        {doctors.length === 0 ? (
          <p className="no-doctors">No doctors found.</p>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-spec">{doctor.specialization}</p>
              <p className="doctor-qual">{doctor.qualification}</p>

              <div className="doctor-info">
                <span><Clock size={14} /> {doctor.experience} yrs</span>
                <span><DollarSign size={14} /> ${doctor.consultationFee}</span>
                <span><MapPin size={14} /> Ward {doctor.wardRoom}</span>
              </div>

              <div className={`doctor-status ${doctor.isAvailable ? 'available' : 'unavailable'}`}>
                {doctor.isAvailable ? 'Available' : 'Unavailable'}
              </div>

              <button
                className="doctor-book-btn"
                onClick={() => handleBookAppointment(doctor)}
                disabled={!doctor.isAvailable}
              >
                Book Appointment
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
