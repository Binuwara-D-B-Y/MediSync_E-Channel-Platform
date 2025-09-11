import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, MapPin, Star, Check } from 'lucide-react';
import '../styles/BookAppointment.css';

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientContact, setPatientContact] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock doctor data (replace with API call)
  const mockDoctors = [
    {
      doctorId: 1,
      fullName: "Dr. Alice Johnson",
      specialization: "Cardiology",
      details: "Experienced cardiologist with expertise in interventional cardiology and heart disease management.",
      consultationFee: 2500,
      wardRoom: "A-101",
      rating: 4.8,
      reviews: 120,
      profileImage: "/images/unnamed.png"
    },
    {
      doctorId: 2,
      fullName: "Dr. Brian Smith",
      specialization: "Neurology",
      details: "Renowned neurologist specializing in stroke treatment and epilepsy management.",
      consultationFee: 3000,
      wardRoom: "B-205",
      rating: 4.9,
      reviews: 95,
      profileImage: "/images/unnamed.png"
    }
  ];

  // Mock time slots data
  const mockTimeSlots = [
    { id: 1, date: '2025-09-15', time: '09:00', available: true },
    { id: 2, date: '2025-09-15', time: '10:00', available: true },
    { id: 3, date: '2025-09-15', time: '11:00', available: false },
    { id: 4, date: '2025-09-15', time: '14:00', available: true },
    { id: 5, date: '2025-09-15', time: '15:00', available: true },
    { id: 6, date: '2025-09-16', time: '09:00', available: true },
    { id: 7, date: '2025-09-16', time: '10:00', available: true },
    { id: 8, date: '2025-09-16', time: '11:00', available: true },
    { id: 9, date: '2025-09-16', time: '14:00', available: false },
    { id: 10, date: '2025-09-16', time: '15:00', available: true }
  ];

  // Load doctor data and time slots
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Find doctor by ID
      const foundDoctor = mockDoctors.find(d => d.doctorId == doctorId);
      if (foundDoctor) {
        setDoctor(foundDoctor);
      }
      
      // Load available time slots
      setAvailableSlots(mockTimeSlots);
      
      setLoading(false);
    };
    
    loadData();
  }, [doctorId]);

  // Get available slots for selected date
  const getSlotsForDate = (date) => {
    return availableSlots.filter(slot => slot.date === date && slot.available);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || !patientName || !patientContact) {
      alert('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Call actual booking API
      console.log('Booking details:', {
        doctorId,
        patientName,
        patientContact,
        patientNotes,
        selectedDate,
        selectedTime,
        fee: doctor?.consultationFee
      });
      
      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
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
          <h1>Book Appointment</h1>
        </div>

        <div className="booking-content">
          {/* Doctor Profile */}
          <div className="doctor-profile">
            <div className="doctor-image">
              <img 
                src={doctor.profileImage} 
                alt={doctor.fullName}
                onError={(e) => { e.currentTarget.src = '/vite.svg'; }}
              />
            </div>
            <div className="doctor-info">
              <h2>{doctor.fullName}</h2>
              <p className="specialization">{doctor.specialization}</p>
              <p className="details">{doctor.details}</p>
              <div className="doctor-meta">
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>Ward {doctor.wardRoom}</span>
                </div>
                <div className="meta-item">
                  <Star size={16} />
                  <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <div className="consultation-fee">
              <div className="fee-amount">Rs. {doctor.consultationFee}</div>
              <div className="fee-label">Consultation Fee</div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form">
            <h3>Select Date & Time</h3>
            
            {/* Date Selection */}
            <div className="form-group">
              <label>Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(''); // Reset time when date changes
                }}
                min={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="form-group">
                <label>Available Time Slots</label>
                <div className="time-slots">
                  {getSlotsForDate(selectedDate).length > 0 ? (
                    getSlotsForDate(selectedDate).map(slot => (
                      <button
                        key={slot.id}
                        className={`time-slot ${selectedTime === slot.time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(slot.time)}
                      >
                        <Clock size={16} />
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <p className="no-slots">No available slots for this date</p>
                  )}
                </div>
              </div>
            )}

            {/* Patient Information */}
            <h3>Patient Information</h3>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your full name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Number *</label>
              <input
                type="tel"
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                placeholder="Enter your contact number"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={patientNotes}
                onChange={(e) => setPatientNotes(e.target.value)}
                placeholder="Any additional information..."
                className="form-textarea"
                rows={3}
              />
            </div>

            {/* Booking Summary */}
            <div className="booking-summary">
              <h3>Booking Summary</h3>
              <div className="summary-item">
                <span>Doctor:</span>
                <span>{doctor.fullName}</span>
              </div>
              <div className="summary-item">
                <span>Specialization:</span>
                <span>{doctor.specialization}</span>
              </div>
              <div className="summary-item">
                <span>Date:</span>
                <span>{selectedDate || 'Not selected'}</span>
              </div>
              <div className="summary-item">
                <span>Time:</span>
                <span>{selectedTime || 'Not selected'}</span>
              </div>
              <div className="summary-item total">
                <span>Total Fee:</span>
                <span>Rs. {doctor.consultationFee}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`btn-confirm ${isBooking ? 'loading' : ''}`}
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedTime || !patientName || !patientContact || isBooking}
            >
              {isBooking ? (
                <>
                  <div className="spinner"></div>
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
