<<<<<<< HEAD
// Mock data for doctors
export const mockDoctors = [
  {
    doctorId: 1,
    fullName: "Dr. Chamika Lakshan",
    specialization: "Cardiology",
    details: "Expert in heart diseases and preventive cardiology.",
    consultationFee: 2500,
    status: "available",
    qualification: "MBBS, MD (Cardiology)",
    experience: 12,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 2,
    fullName: "Dr. Nadeesha Perera",
    specialization: "Dermatology",
    details: "Specialist in skin and hair treatments.",
    consultationFee: 2000,
    status: "available",
    qualification: "MBBS, DDVL",
    experience: 8,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 3,
    fullName: "Dr. Sameera Fernando",
    specialization: "Neurology",
    details: "Focused on brain and nervous system disorders.",
    consultationFee: 3000,
    status: "busy",
    qualification: "MBBS, DM (Neurology)",
    experience: 10,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 4,
    fullName: "Dr. Kavindi Silva",
    specialization: "Pediatrics",
    details: "Experienced in child healthcare and vaccination.",
    consultationFee: 1800,
    status: "available",
    qualification: "MBBS, MD (Pediatrics)",
    experience: 7,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 5,
    fullName: "Dr. Rashmi Jayawardena",
    specialization: "Gynecology",
    details: "Specialist in women health and pregnancy care.",
    consultationFee: 2200,
    status: "available",
    qualification: "MBBS, MD (Gynecology)",
    experience: 11,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 6,
    fullName: "Dr. Harsha Wijesinghe",
    specialization: "Orthopedics",
    details: "Expert in bone, joint, and spine treatments.",
    consultationFee: 3500,
    status: "available",
    qualification: "MBBS, MS (Orthopedics)",
    experience: 15,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 7,
    fullName: "Dr. Tharindu Gunasekara",
    specialization: "ENT",
    details: "Treats ear, nose, and throat disorders.",
    consultationFee: 2000,
    status: "available",
    qualification: "MBBS, MS (ENT)",
    experience: 9,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 8,
    fullName: "Dr. Sanduni Rajapaksha",
    specialization: "Ophthalmology",
    details: "Specialist in eye treatments and surgeries.",
    consultationFee: 2800,
    status: "available",
    qualification: "MBBS, MS (Ophthalmology)",
    experience: 10,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 9,
    fullName: "Dr. Lasitha Fernando",
    specialization: "Psychiatry",
    details: "Provides mental health and counseling services.",
    consultationFee: 2500,
    status: "offline",
    qualification: "MBBS, MD (Psychiatry)",
    experience: 12,
    profileImage: "/images/unnamed.png"
  },
  {
    doctorId: 10,
    fullName: "Dr. Anushka Perera",
    specialization: "General Medicine",
    details: "General physician for all age groups.",
    consultationFee: 1500,
    status: "available",
    qualification: "MBBS, MD (General Medicine)",
    experience: 6,
    profileImage: "/images/unnamed.png"
  }
];

=======
>>>>>>> wishlist
// Mock data for user profile
export const mockUserProfile = {
  name: "yesen binuwara",
  email: "yesen.binuwara@example.com",
  phone: "123-456-7890",
};

<<<<<<< HEAD
// Mock data for time slots (e.g., available appointment times for a doctor)
export const mockTimeSlots = [
  {
    id: 1,
    time: "09:00 AM",
    isBooked: false,
    doctorId: 1
  },
  {
    id: 2,
    time: "10:00 AM",
    isBooked: false,
    doctorId: 1
  },
  {
    id: 3,
    time: "11:00 AM",
    isBooked: true,
    doctorId: 1
  },
  {
    id: 4,
    time: "02:00 PM",
    isBooked: false,
    doctorId: 1
  },
  {
    id: 5,
    time: "03:00 PM",
    isBooked: false,
    doctorId: 1
  },
  {
    id: 6,
    time: "04:00 PM",
    isBooked: true,
    doctorId: 1
  }
];
=======

// Mock schedules (matching SQL query data)
// Each slot includes: id, doctorId, date, time, dateTime (combined string), totalSlots, availableSlots, wardNo, price

export const mockSchedules = [
  // Doctor 1 - Cardiology (matching SQL: 09:00-12:00 and 14:00-17:00)
  { id: 1, doctorId: 1, date: '2025-10-10', time: '09:00 AM', dateTime: '2025-10-10 09:00 AM', totalSlots: 10, availableSlots: 6, wardNo: 'A-101', price: 3000 },
  { id: 2, doctorId: 1, date: '2025-10-10', time: '02:00 PM', dateTime: '2025-10-10 02:00 PM', totalSlots: 10, availableSlots: 4, wardNo: 'A-101', price: 3000 },

  // Doctor 2 - Neurology (matching SQL: 09:30-12:30 and 15:00-18:00)
  { id: 3, doctorId: 2, date: '2025-10-11', time: '09:30 AM', dateTime: '2025-10-11 09:30 AM', totalSlots: 8, availableSlots: 3, wardNo: 'B-201', price: 3200 },
  { id: 4, doctorId: 2, date: '2025-10-11', time: '03:00 PM', dateTime: '2025-10-11 03:00 PM', totalSlots: 8, availableSlots: 5, wardNo: 'B-201', price: 3200 },

  // Doctor 3 - Pediatrics (matching SQL: 10:00-13:00)
  { id: 5, doctorId: 3, date: '2025-10-10', time: '10:00 AM', dateTime: '2025-10-10 10:00 AM', totalSlots: 12, availableSlots: 8, wardNo: 'C-301', price: 1800 },
  { id: 302, doctorId: 3, date: '2025-10-12', time: '01:00 PM', dateTime: '2025-10-12 01:00 PM', totalSlots: 12, availableSlots: 12, wardNo: 'C-301', price: 1800 },

  // Doctor 4 - Orthopedics
  { id: 401, doctorId: 4, date: '2025-10-10', time: '11:00 AM', dateTime: '2025-10-10 11:00 AM', totalSlots: 6, availableSlots: 2, wardNo: 'D-401', price: 3500 },
  { id: 402, doctorId: 4, date: '2025-10-13', time: '04:00 PM', dateTime: '2025-10-13 04:00 PM', totalSlots: 6, availableSlots: 6, wardNo: 'D-401', price: 3500 },

  // Doctor 5 - Dermatology
  { id: 501, doctorId: 5, date: '2025-10-11', time: '09:00 AM', dateTime: '2025-10-11 09:00 AM', totalSlots: 10, availableSlots: 7, wardNo: 'E-102', price: 2200 },
  { id: 502, doctorId: 5, date: '2025-10-11', time: '11:30 AM', dateTime: '2025-10-11 11:30 AM', totalSlots: 10, availableSlots: 1, wardNo: 'E-102', price: 2200 },

  // Doctor 6 - Gynecology
  { id: 601, doctorId: 6, date: '2025-10-12', time: '10:00 AM', dateTime: '2025-10-12 10:00 AM', totalSlots: 8, availableSlots: 4, wardNo: 'F-210', price: 2500 },
  { id: 602, doctorId: 6, date: '2025-10-12', time: '02:30 PM', dateTime: '2025-10-12 02:30 PM', totalSlots: 8, availableSlots: 0, wardNo: 'F-210', price: 2500 },

  // Doctor 7 - ENT
  { id: 701, doctorId: 7, date: '2025-10-10', time: '09:00 AM', dateTime: '2025-10-10 09:00 AM', totalSlots: 10, availableSlots: 10, wardNo: 'G-110', price: 2000 },
  { id: 702, doctorId: 7, date: '2025-10-13', time: '03:00 PM', dateTime: '2025-10-13 03:00 PM', totalSlots: 10, availableSlots: 6, wardNo: 'G-110', price: 2000 },

  // Doctor 8 - Psychiatry
  { id: 801, doctorId: 8, date: '2025-10-11', time: '01:00 PM', dateTime: '2025-10-11 01:00 PM', totalSlots: 6, availableSlots: 2, wardNo: 'H-305', price: 2700 },
  { id: 802, doctorId: 8, date: '2025-10-14', time: '10:00 AM', dateTime: '2025-10-14 10:00 AM', totalSlots: 6, availableSlots: 6, wardNo: 'H-305', price: 2700 },

  // Doctor 9 - Ophthalmology
  { id: 901, doctorId: 9, date: '2025-10-10', time: '08:30 AM', dateTime: '2025-10-10 08:30 AM', totalSlots: 8, availableSlots: 5, wardNo: 'I-501', price: 2800 },
  { id: 902, doctorId: 9, date: '2025-10-12', time: '12:00 PM', dateTime: '2025-10-12 12:00 PM', totalSlots: 8, availableSlots: 0, wardNo: 'I-501', price: 2800 }
];

// Backwards-compatible export: keep mockTimeSlots name used by pages
export const mockTimeSlots = mockSchedules;
>>>>>>> wishlist
