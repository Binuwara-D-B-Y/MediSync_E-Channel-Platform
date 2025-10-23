// import React, { useState, useMemo } from 'react';
// import DashboardWrapper from '../components/DashboardWrapper';
// import WelcomeCard from '../components/WelcomeCard';
// import QuickStats from '../components/QuickStats';
// import FindDoctors from '../components/FindDoctors';
// import Header from '../components/Header';

// export default function PatientDashboard() {
//   // 🔹 State (UNCHANGED)
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
//   const [doctors, setDoctors] = useState([]);
//   const [doctorsByName, setDoctorsByName] = useState([]);
//   const [doctorsBySpec, setDoctorsBySpec] = useState([]);
//   const [loadingDoctors, setLoadingDoctors] = useState(false);
//   const [searchMessage, setSearchMessage] = useState('');
//   const [displayMode, setDisplayMode] = useState('default');

//   // 🔹 ADD THIS LINE (same as your original)
//   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//   // Fetch doctors with custom rules
//   React.useEffect(() => {
//     async function fetchWithRules() {
//       setLoadingDoctors(true);
//       setSearchMessage('');
//       setDisplayMode('default');
//       setDoctorsByName([]);
//       setDoctorsBySpec([]);

//       const hasName = !!searchTerm.trim();
//       const hasSpec = !!selectedSpecialization && selectedSpecialization !== 'All Specializations';

//       try {
//         if (hasName && hasSpec) {
//           const [nameRes, specRes] = await Promise.all([
//             // ✅ FIXED: Add ${API_BASE_URL}
//             fetch(`${API_BASE_URL}/api/doctors?name=${encodeURIComponent(searchTerm)}`),
//             fetch(`${API_BASE_URL}/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`)
//           ]);
          
//           if (!nameRes.ok || !specRes.ok) {
//             throw new Error('Failed to fetch doctors');
//           }
          
//           const [nameData, specData] = await Promise.all([nameRes.json(), specRes.json()]);
//           setDoctorsByName(nameData);
//           setDoctorsBySpec(specData);

//           // ... ALL YOUR RULES LOGIC UNCHANGED ...
//           if ((!nameData || nameData.length === 0) && (specData && specData.length > 0)) {
//             setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
//             setDoctors(specData);
//             setDisplayMode('specOnly');
//           } else {
//             const nameMatchesSelectedSpec = (nameData || []).some(d => (d.specialization || '').toLowerCase() === selectedSpecialization.toLowerCase());
//             if (!nameMatchesSelectedSpec && nameData && nameData.length > 0) {
//               setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
//               const map = new Map();
//               [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
//               setDoctors([...map.values()]);
//               setDisplayMode('both');
//             } else {
//               const map = new Map();
//               [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
//               setDoctors([...map.values()]);
//               setDisplayMode('default');
//             }
//           }
//         } else if (hasName) {
//           let res = await fetch(`${API_BASE_URL}/api/doctors?name=${encodeURIComponent(searchTerm)}`);
//           if (!res.ok) throw new Error('Failed to fetch doctors by name');
          
//           let data = await res.json();
//           if (!data || data.length === 0) {
//             res = await fetch(`${API_BASE_URL}/api/doctors`);
//             if (!res.ok) throw new Error('Failed to fetch all doctors');
//             const all = await res.json();
//             const q = searchTerm.toLowerCase();
//             data = (all || []).filter(d => (d.fullName || d.name || '').toLowerCase().includes(q));
//           }
//           setDoctors(data || []);
//           setDisplayMode('nameOnly');
//         } else if (hasSpec) {
//           const res = await fetch(`${API_BASE_URL}/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`);
//           if (!res.ok) throw new Error('Failed to fetch doctors by specialization');
//           const data = await res.json();
//           setDoctorsBySpec(data || []);
//           setDoctors(data || []);
//           setDisplayMode('specOnly');
//         } else {
//           const res = await fetch(`${API_BASE_URL}/api/doctors`);
//           if (!res.ok) throw new Error('Failed to fetch all doctors');
//           const data = await res.json();
//           setDoctors(data || []);
//           setDisplayMode('default');
//         }
//       } catch (err) {
//         console.error('Search failed', err);  // ✅ Changed to error
//         setSearchMessage('Error fetching doctors. Please try again.');
//         setDoctors([]);
//       } finally {
//         setLoadingDoctors(false);
//       }
//     }
//     fetchWithRules();
//   }, [searchTerm, selectedSpecialization, API_BASE_URL]);  // ✅ Add dependency

//   // 🔹 RETURN UNCHANGED
//   return (
//     <DashboardWrapper>
//       <WelcomeCard name={'User'} />
//       <QuickStats />
//       <div className="quick-stats-grid" style={{margin:'2rem 0'}}>
//         <div className="quick-stat-card">
//           <div className="quick-stat-icon blue"><span role="img" aria-label="calendar">📅</span></div>
//           <div>
//             <p className="quick-stat-label">Next Appointment</p>
//             <p className="quick-stat-value">No upcoming appointments</p>
//           </div>
//         </div>
//       </div>
//       <FindDoctors
//         searchTerm={searchTerm}
//         setSearchTerm={setSearchTerm}
//         selectedSpecialization={selectedSpecialization}
//         setSelectedSpecialization={setSelectedSpecialization}
//         doctors={doctors}
//         loading={loadingDoctors}
//         displayMode={displayMode}
//         doctorsByName={doctorsByName}
//         doctorsBySpec={doctorsBySpec}
//         searchMessage={searchMessage}
//       />
//     </DashboardWrapper>
//   );
// }



import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/AppointmentsDone.css';
import { apiRequest, authHeaders } from '../api'; // ✅ use API helper

export default function AppointmentsDone() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest('/api/booking/user', {
        method: 'GET',
        headers: { ...authHeaders() },
      });
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      if (error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const sortAppointments = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);

    const sorted = [...appointments].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return newOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setAppointments(sorted);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          <ArrowLeft size={16} /> Back
        </button>
        <h1>My Appointments</h1>
        <button onClick={sortAppointments} className="btn-sort">
          Sort by Date ({sortOrder === 'desc' ? 'Newest First' : 'Oldest First'})
        </button>
      </div>

      <div className="appointments-container">
        {appointments.length === 0 ? (
          <div className="no-appointments">
            <Calendar size={48} />
            <h3>No Appointments Found</h3>
            <p>You haven't made any appointments yet.</p>
            <button onClick={() => navigate('/patient')} className="btn-primary">
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map((appointment) => (
              <div key={appointment.appointmentId} className="appointment-card">
                <div className="appointment-header">
                  <div className="doctor-info">
                    <h3>{appointment.doctor}</h3>
                    <p className="specialization">{appointment.specialization}</p>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${appointment.status === 0 ? 'booked' : 'cancelled'}`}>
                      {appointment.status === 0 ? 'Booked' : 'Cancelled'}
                    </span>
                  </div>
                </div>
                
                <div className="appointment-details">
                  <div className="detail-row">
                    <Calendar size={16} />
                    <span>{formatDate(appointment.date)}</span>
                  </div>
                  <div className="detail-row">
                    <Clock size={16} />
                    <span>{formatTime(appointment.time)}</span>
                  </div>
                  <div className="detail-row">
                    <MapPin size={16} />
                    <span>Ward {appointment.ward} - Slot {appointment.slot}</span>
                  </div>
                  <div className="detail-row">
                    <User size={16} />
                    <span>Patient ID: {appointment.appointmentId}</span>
                  </div>
                  <div className="detail-row price">
                    <DollarSign size={16} />
                    <span>Rs. {appointment.price.toFixed(2)}</span>
                  </div>
                </div>

                <div className="appointment-footer">
                  <small>Payment ID: {appointment.paymentId}</small>
                  <small>Booked on: {formatDate(appointment.paymentDate)}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
