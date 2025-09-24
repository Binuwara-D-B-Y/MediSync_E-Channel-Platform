// Mock data for doctors
export const mockDoctors = [
  {
    doctorId: 1,
    fullName: "Dr. Chamiklllllllllla Lakshan",
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
    fullName: "Dr. Nadeeshafffffffffffffffff Perera",
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

// Mock data for user profile
export const mockUserProfile = {
  name: 'yesen binuwara',
  email: 'yesen.binuwara@example.com',
  phone: '123-456-7890',
};

//Mock data for time slots (e.g., available appointment times for a doctor)
export const mockTimeSlots = [
  {
    id: 1,
    time: "09:00 AM",
    isBooked: false,
    doctorId: 1  // Optional: Link to a doctor from mockDoctors
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
    isBooked: true,  // Example of a booked slot
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




//YB edits below
// export const mockTimeSlots = [
//   {
//     id: 1,
//     date: "2025-09-22",   // today’s date for example
//     time: "09:00 AM",
//     available: true,
//     doctorId: 1
//   },
//   {
//     id: 2,
//     date: "2025-09-22",
//     time: "10:00 AM",
//     available: true,
//     doctorId: 1
//   },
//   {
//     id: 3,
//     date: "2025-09-22",
//     time: "11:00 AM",
//     available: false,
//     doctorId: 1
//   }
// ];
