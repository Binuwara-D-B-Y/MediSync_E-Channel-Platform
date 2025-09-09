import React, { useState, useMemo } from 'react';
import DashboardWrapper from '../components/DashboardWrapper';
import WelcomeCard from '../components/WelcomeCard';
import QuickStats from '../components/QuickStats';
import AppointmentsList from '../components/AppointmentList';
import FindDoctors from '../components/FindDoctors';
import BookingModal from '../components/BookingModal';
import { mockDoctors, mockAppointments, specializations } from '../data/mockData';

export default function PatientDashboard() {
  // 🔹 State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return mockDoctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        selectedSpecialization === 'All Specializations' ||
        doctor.specialization === selectedSpecialization;

      return matchesSearch && matchesSpecialization;
    });
  }, [searchTerm, selectedSpecialization]);

  // Patient appointments
  const patientAppointments = useMemo(() => {
    return mockAppointments
      .map((apt) => ({
        ...apt,
        doctor: mockDoctors.find((doc) => doc.id === apt.doctorId),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  const upcomingAppointments = patientAppointments.filter((apt) => apt.status === 'scheduled');

  // Booking
  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');
    setBookingSuccess(false);
  };

  const confirmBooking = async () => {
    if (!bookingDate || !bookingTime) return;

    setIsBooking(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    setBookingSuccess(true);

    setTimeout(() => {
      setShowBookingModal(false);
      setBookingSuccess(false);
    }, 2000);
  };

  const cancelAppointment = async (appointmentId) => {
    // simulate API cancel
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <DashboardWrapper>
      {/* Welcome */}
      <WelcomeCard name={'User'} />

      {/* Quick Stats */}
      <QuickStats
        upcomingAppointmentsCount={upcomingAppointments.length}
        totalAppointmentsCount={patientAppointments.length}
        doctors={mockDoctors}
      />

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 ? (
        <AppointmentsList
          appointments={upcomingAppointments}
          cancelAppointment={cancelAppointment}
        />
      ) : (
        <div style={{ textAlign: 'center', margin: '2rem 0', color: '#888' }}>
          No upcoming appointments.
        </div>
      )}

      {/* Find Doctors */}
      <FindDoctors
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedSpecialization={selectedSpecialization}
        setSelectedSpecialization={setSelectedSpecialization}
        specializations={specializations}
        doctors={filteredDoctors}
        handleBookAppointment={handleBookAppointment}
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
