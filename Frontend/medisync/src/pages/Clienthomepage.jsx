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
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  // Fetch doctors from backend
  React.useEffect(() => {
    async function fetchDoctors() {
      setLoadingDoctors(true);
      let url = `/api/doctors?`;
      if (searchTerm) url += `name=${encodeURIComponent(searchTerm)}&`;
      if (selectedSpecialization && selectedSpecialization !== 'All Specializations') url += `specialization=${encodeURIComponent(selectedSpecialization)}&`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        setDoctors([]);
      }
      setLoadingDoctors(false);
    }
    fetchDoctors();
  }, [searchTerm, selectedSpecialization]);

  // Patient appointments
  // Booking
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
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
