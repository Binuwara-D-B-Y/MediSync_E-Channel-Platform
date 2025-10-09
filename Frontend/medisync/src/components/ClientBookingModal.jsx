import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/BookingModal.css';

export default function ClientBookingModal({ doctor, slot, onClose, onPay, isProcessing }) {
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');

  // Use date and time directly from the slot. Many schedule sources provide
  // date and time separately (e.g. { date: '2025-10-10', time: '10:00 AM' }).
  // Relying on these fields preserves any AM/PM text the backend or mock provides.
  const dateDisplay = slot?.date || slot?.day || '';
  const timeDisplay = slot?.time || slot?.start || '';

  const handlePay = async () => {
    if (!name || !nic || !email || !contact) {
      alert('Please fill all required fields');
      return;
    }

    if (onPay) {
      try {
        await onPay({ name, nic, email, contact });
      } catch (err) {
        console.error('onPay failed', err);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box modal-wide">
        <div className="modal-header">
          <h3>Confirm & Pay</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body modal-grid">
          <div>
            <h4>Patient Details</h4>
            <div className="form-group"><label>Full Name *</label><input className="form-input" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="form-group"><label>NIC *</label><input className="form-input" value={nic} onChange={e=>setNic(e.target.value)} /></div>
            <div className="form-group"><label>Email *</label><input className="form-input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div className="form-group"><label>Contact No *</label><input className="form-input" value={contact} onChange={e=>setContact(e.target.value)} /></div>
          </div>

          <div>
            <h4>Booking Details</h4>
            <div className="summary-item"><span>Doctor:</span><span>{doctor.fullName}</span></div>
            <div className="summary-item"><span>Specialization:</span><span>{doctor.specialization}</span></div>
            <div className="summary-item"><span>Price:</span><span>Rs. {slot.price ?? doctor.consultationFee}</span></div>
            <div className="summary-item"><span>Date:</span><span>{dateDisplay}</span></div>
            <div className="summary-item"><span>Time:</span><span>{timeDisplay}</span></div>
            <div className="summary-item"><span>Ward:</span><span>{slot.wardNo}</span></div>
            <div style={{marginTop:12}}>
              <button className="btn-secondary" onClick={onClose} disabled={isProcessing}>Cancel</button>
              <button className="btn-primary" onClick={handlePay} disabled={isProcessing} style={{marginLeft:8}}>{isProcessing ? 'Processing...' : 'Pay Now'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
