import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Star, Check } from 'lucide-react';
import { mockTimeSlots } from '../data/mockData';
import '../styles/BookAppointment.css';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [loading, setLoading] = useState(true);


  // Load doctor data and time slots
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch doctor from API
        const response = await fetch('/api/doctors');
        const doctors = await response.json();
        const foundDoctor = doctors.find(d => d.doctorId == doctorId);
        if (foundDoctor) {
          // Add missing fields for compatibility
          foundDoctor.consultationFee = foundDoctor.consultationFee || 2000;
          foundDoctor.profileImage = foundDoctor.profileImage || '/images/unnamed.png';
          foundDoctor.wardRoom = foundDoctor.wardRoom || 'A-101';
          foundDoctor.rating = foundDoctor.rating || 4.5;
          foundDoctor.reviews = foundDoctor.reviews || 25;
          setDoctor(foundDoctor);
        }
      } catch (error) {
        console.error('Failed to fetch doctor:', error);
      }
      // TODO: Replace mockTimeSlots with backend data when available
      setAvailableSlots(mockTimeSlots);
      setLoading(false);
    };
    loadData();
  }, [doctorId]);

  // Get available slots for selected date
  const getAvailableSlotsForDoctor = () => {
    // Return all schedule entries for this doctor (we'll show availableSlots in the UI)
    return (availableSlots || []).filter(s => (s.doctorId == doctor.doctorId || s.doctorId == doctor.id));
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (slot) => {
    // Accept a slot object {date?, time, id}
    if (!slot) return;
    const date = slot.date || slot.day || '';
    const time = slot.time || slot.start || '';

    setSelectedDate(date);
    setSelectedTime(time);
    setBookingSlotId(slot.id);
    setIsBooking(true);

    try {
      // Simulate API call (replace with real booking API)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Update local availableSlots to simulate a booking decrement
      setAvailableSlots(prev => prev.map(s => s.id === slot.id ? { ...s, availableSlots: Math.max(0, (s.availableSlots || 0) - 1) } : s));
      console.log('Booked slot:', { doctorId, slot, fee: doctor?.consultationFee });
      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
      setBookingSlotId(null);
    }
  };

  if (loading) {
    return (
      <div className="booking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="booking-page">
        <div className="error-container">
          <h2>Doctor not found</h2>
          <p>The requested doctor could not be found.</p>
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="booking-page">
        <div className="success-container">
          <div className="success-icon">
            <Check size={48} />
          </div>
          <h2>Appointment Booked Successfully!</h2>
          <p>Your appointment has been confirmed.</p>
          <div className="booking-details">
            <p><strong>Doctor:</strong> {doctor.fullName}</p>
            <p><strong>Date:</strong> {selectedDate}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Fee:</strong> Rs. {doctor.consultationFee}</p>
          </div>
          <div className="success-actions">
            <button onClick={() => navigate('/patient')} className="btn-primary">
              Back to Dashboard
            </button>
            <button onClick={() => navigate(-1)} className="btn-secondary">
              Book Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header */}
        <div className="booking-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={16} /> Back
          </button>
          <h1>Book Your Appointments Here</h1>
        </div>

        <div className="booking-content">
          {/* Left: Doctor profile panel (moved left) */}
          <aside className="doctor-profile">
            <div className="doctor-image">
              <img src={doctor.profileImage} alt={doctor.fullName} onError={(e) => { e.currentTarget.src = '/src/assets/Elogo.png'; }} />
            </div>
            <div className="doctor-info">
              <h2>{doctor.fullName}</h2>
              <div className="specialization">{doctor.specialization}</div>
              <div><button className="btn-secondary">Details</button></div>
            </div>
          </aside>

          {/* Right: schedule list and book buttons */}
          <div className="booking-form schedule-panel">
            <h3>Available Schedule</h3>
            <div className="schedule-list">
              {getAvailableSlotsForDoctor().length === 0 && (
                <div className="no-slots">No available slots.</div>
              )}
              {getAvailableSlotsForDoctor().map(slot => (
                <div key={slot.id} className="slot-card">
                  <div className="slot-meta">
                    <div className="slot-datetime">{slot.dateTime || `${slot.date} ${slot.time}`}</div>
                    <div className="slot-submeta">Available: <strong>{slot.availableSlots ?? slot.totalSlots}</strong> • Ward: {slot.wardNo}</div>
                  </div>
                  <div className="slot-actions">
                    <div className="slot-fee">Rs. {slot.price ?? doctor.consultationFee}</div>
                    <button
                      className="btn-primary"
                      disabled={(slot.availableSlots ?? 0) <= 0 || (isBooking && bookingSlotId === slot.id)}
                      onClick={() => handleConfirmBooking(slot)}
                    >
                      {isBooking && bookingSlotId === slot.id ? 'Processing...' : ((slot.availableSlots ?? 0) <= 0 ? 'Full' : 'Book Now')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
