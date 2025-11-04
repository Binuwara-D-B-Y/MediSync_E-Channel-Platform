import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { API_BASE } from '../api';


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
        const res = await fetch(`${API_BASE}/api/specializations`);
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
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-gray-800">Find Doctors</h2>
      </div>
      
      <div className="card-body">
        {/* Search Filters */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1" style={{ position: 'relative' }}>
            <div className="flex items-center form-input" style={{ padding: 'var(--space-2) var(--space-3)' }}>
              <Search size={18} style={{ color: 'var(--gray-400)', marginRight: 'var(--space-2)' }} />
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
                style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent' }}
              />
            </div>
            {showDropdown && filteredDropdown.length > 0 && (
              <ul style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                background: 'white',
                border: '1px solid var(--gray-200)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '2px'
              }}>
                {filteredDropdown.map((doctor) => (
                  <li
                    key={doctor.userId || doctor.id}
                    onMouseDown={() => {
                      setLocalSearchTerm(doctor.fullName || doctor.name);
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: 'var(--space-3)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--gray-100)'
                    }}
                  >
                    {doctor.fullName || doctor.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="flex items-center form-select" style={{ padding: 'var(--space-2) var(--space-3)', minWidth: '200px' }}>
            <Filter size={18} style={{ color: 'var(--gray-400)', marginRight: 'var(--space-2)' }} />
            <select
              value={localSpecialization}
              onChange={(e) => setLocalSpecialization(e.target.value)}
              style={{ border: 'none', outline: 'none', flex: 1, background: 'transparent' }}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Date and Search */}
        <div className="flex gap-4 mb-6">
          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="form-input flex-1"
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="loading-spinner"></div>
            <span className="ml-2 text-gray-600">Loading doctors...</span>
          </div>
        )}
        
        {/* Search Message */}
        {searchMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium text-center">{searchMessage}</p>
          </div>
        )}
        
        {/* Doctors Grid */}
        {!loading && (
          <div className="grid grid-cols-4 gap-6">
            {doctors.map((doctor) => {
              const name = doctor.fullName || doctor.name || 'Unknown Doctor';
              const specialization = doctor.specialization || 'General Practitioner';
              const image = doctor.profileImage || '/assets/unnamed.png';
              return (
                <div className="card" key={doctor.doctorId || doctor.id} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 'var(--space-3)', right: 'var(--space-3)', zIndex: 1 }}>
                    <FavoriteButton
                      doctorId={doctor.doctorId || doctor.id}
                      initialIsFavorite={doctor.isFavorite || false}
                      onToggle={(isFav, msg) => {
                        const toast = document.createElement('div');
                        toast.textContent = msg;
                        toast.style.cssText = 'position:fixed;top:20px;right:20px;background:var(--success-500);color:white;padding:12px 16px;border-radius:6px;z-index:1000;font-size:14px';
                        document.body.appendChild(toast);
                        setTimeout(() => document.body.removeChild(toast), 3000);
                      }}
                    />
                  </div>
                  
                  <div className="card-body text-center">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden',
                      background: 'var(--gray-100)',
                      border: '1px solid var(--gray-200)',
                      margin: '0 auto var(--space-4) auto'
                    }}>
                      <img 
                        src={image} 
                        alt={name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => { e.currentTarget.src = 'src/assets/Elogo.png' }} 
                      />
                    </div>
                    
                    <h3 className="font-semibold text-gray-800 mb-1">{name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{specialization}</p>
                    
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%' }}
                      onClick={() => navigate(`/book/${doctor.doctorId || doctor.id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* No Results */}
        {!loading && doctors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No doctors found.
          </div>
        )}
      </div>
    </div>
  );
}
