import React, { useState, useMemo } from 'react';
import DashboardWrapper from '../components/DashboardWrapper';
import WelcomeCard from '../components/WelcomeCard';
import QuickStats from '../components/QuickStats';
import FindDoctors from '../components/FindDoctors';
import BookingModal from '../components/BookingModal';
import Header from '../components/Header';

export default function PatientDashboard() {
  // 🔹 State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorsByName, setDoctorsByName] = useState([]);
  const [doctorsBySpec, setDoctorsBySpec] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [displayMode, setDisplayMode] = useState('default'); // kept for clarity, but we render one grid

  // Booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

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
            fetch(`/api/doctors?name=${encodeURIComponent(searchTerm)}`),
            fetch(`/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`)
          ]);
          const [nameData, specData] = await Promise.all([nameRes.json(), specRes.json()]);
          setDoctorsByName(nameData);
          setDoctorsBySpec(specData);

          // Rule 1: wrong name + correct specialization → show message + specialization doctors
          if ((!nameData || nameData.length === 0) && (specData && specData.length > 0)) {
            setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
            setDoctors(specData);
            setDisplayMode('specOnly');
          } else {
            // Rule 3: correct name + unmatched specialization → message + combine name + specialization (no split grids)
            const nameMatchesSelectedSpec = (nameData || []).some(d => (d.specialization || '').toLowerCase() === selectedSpecialization.toLowerCase());
            if (!nameMatchesSelectedSpec && nameData && nameData.length > 0) {
              setSearchMessage('Sorry! We could not find results for your search query. You can try one of the below suggestions!');
              const map = new Map();
              [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
              setDoctors([...map.values()]);
              setDisplayMode('both');
            } else {
              // overlap or same spec → merge and show
              const map = new Map();
              [...(nameData || []), ...(specData || [])].forEach(d => map.set(d.doctorId || d.id, d));
              setDoctors([...map.values()]);
              setDisplayMode('default');
            }
          }
        } else if (hasName) {
          const res = await fetch(`/api/doctors?name=${encodeURIComponent(searchTerm)}`);
          let data = await res.json();
          if (!data || data.length === 0) {
            const allRes = await fetch('/api/doctors');
            const all = await allRes.json();
            const q = searchTerm.toLowerCase();
            data = (all || []).filter(d => (d.fullName || d.name || '').toLowerCase().includes(q));
          }
          // Rule 4: name only
          setDoctors(data || []);
          setDisplayMode('nameOnly');
        } else if (hasSpec) {
          const res = await fetch(`/api/doctors?specialization=${encodeURIComponent(selectedSpecialization)}`);
          const data = await res.json();
          // Rule 2: just specialization
          setDoctorsBySpec(data || []);
          setDoctors(data || []);
          setDisplayMode('specOnly');
        } else {
          const res = await fetch('/api/doctors');
          const data = await res.json();
          setDoctors(data || []);
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

  // Patient appointments
  // Booking
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      setIsBooking(true);
      // TODO: call backend to create appointment
      await new Promise((resolve) => setTimeout(resolve, 800));
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        setBookingDate('');
        setBookingTime('');
        setBookingNotes('');
      }, 900);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <DashboardWrapper>
      {/* Welcome */}
      <WelcomeCard name={'User'} />

  {/* Quick Stats Section */}
  <QuickStats />

      {/* Upcoming Appointments Section */}
      <div className="quick-stats-grid" style={{margin:'2rem 0'}}>
        <div className="quick-stat-card">
          <div className="quick-stat-icon blue"><span role="img" aria-label="calendar">📅</span></div>
          <div>
            <p className="quick-stat-label">Next Appointment</p>
            <p className="quick-stat-value">No upcoming appointments</p>
          </div>
        </div>
      </div>

      {/* Find Doctors */}
      <FindDoctors
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialization={selectedSpecialization}
        setSelectedSpecialization={setSelectedSpecialization}
        doctors={doctors}
        handleBookAppointment={handleBookAppointment}
        loading={loadingDoctors}
        displayMode={displayMode}
        doctorsByName={doctorsByName}
        doctorsBySpec={doctorsBySpec}
        searchMessage={searchMessage}
      />

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          bookingTime={bookingTime}
          setBookingTime={setBookingTime}
          bookingNotes={bookingNotes}
          setBookingNotes={setBookingNotes}
          isBooking={isBooking}
          bookingSuccess={bookingSuccess}
          confirmBooking={confirmBooking}
          closeModal={() => setShowBookingModal(false)}
        />
      )}
    </DashboardWrapper>
  );
}
