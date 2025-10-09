// import React from 'react';
// import { X, Check } from 'lucide-react';
// import LoadingSpinner from './LoadingSpinner';
// import '../styles/BookingModal.css';

// export default function BookingModal({
//   doctor,
//   bookingDate,
//   setBookingDate,
//   bookingTime,
//   setBookingTime,
//   bookingNotes,
//   setBookingNotes,
//   isBooking,
//   bookingSuccess,
//   confirmBooking,
//   closeModal
// }) {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <div className="modal-header">
//           <h3>Book Appointment</h3>
//           <button className="modal-close" onClick={closeModal}><X size={20} /></button>
//         </div>

//         <div className="modal-body">
//           {bookingSuccess ? (
//             <div className="modal-success">
//               <div className="success-icon"><Check size={32} /></div>
//               <h4>Appointment Booked!</h4>
//               <p>Your appointment has been scheduled successfully.</p>
//             </div>
//           ) : (
//             <>
//               <div className="modal-doctor-info">
//                 <h4>{doctor.fullName || doctor.name}</h4>
//                 <p>{doctor.specialization}</p>
//                 {doctor.wardRoom && <p>Ward {doctor.wardRoom}</p>}
//               </div>

//               <label>Date</label>
//               <input
//                 type="date"
//                 value={bookingDate}
//                 onChange={(e) => setBookingDate(e.target.value)}
//                 min={new Date().toISOString().split('T')[0]}
//               />

//               <label>Time</label>
//               <select value={bookingTime} onChange={(e) => setBookingTime(e.target.value)}>
//                 <option value="">Select time</option>
//                 <option value="09:00">9:00 AM</option>
//                 <option value="10:00">10:00 AM</option>
//                 <option value="11:00">11:00 AM</option>
//                 <option value="14:00">2:00 PM</option>
//                 <option value="15:00">3:00 PM</option>
//                 <option value="16:00">4:00 PM</option>
//               </select>

//               <label>Notes (optional)</label>
//               <textarea
//                 rows={3}
//                 value={bookingNotes}
//                 onChange={(e) => setBookingNotes(e.target.value)}
//               />

//               {doctor.consultationFee && (
//                 <div className="modal-fee">
//                   Consultation Fee: Rs. {doctor.consultationFee}
//                 </div>
//               )}

//               <div className="modal-actions">
//                 <button className="btn-cancel" onClick={closeModal}>Cancel</button>
//                 <button
//                   className="btn-confirm"
//                   onClick={confirmBooking}
//                   disabled={!bookingDate || !bookingTime || isBooking}
//                 >
//                   {isBooking ? <LoadingSpinner size="sm" /> : 'Book Appointment'}
//                 </button>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
