// Mock data for doctors
export const mockDoctors = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    specialization: "Cardiology",
    qualification: "MBBS, MD",
    experience: 12,
    consultationFee: 50,
    wardRoom: "A1",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Dr. Brian Smith",
    specialization: "Neurology",
    qualification: "MBBS, DM",
    experience: 8,
    consultationFee: 60,
    wardRoom: "B2",
    isAvailable: false,
  },
  {
    id: 3,
    name: "Dr. Catherine Lee",
    specialization: "Dermatology",
    qualification: "MBBS, DDVL",
    experience: 10,
    consultationFee: 40,
    wardRoom: "C3",
    isAvailable: true,
  },
];

// Mock data for appointments
export const mockAppointments = [
  {
    id: "apt1",
    patientId: 1,
    doctorId: 1,
    date: "2025-09-15",
    time: "10:00 AM",
    status: "scheduled",
  },
  {
    id: "apt2",
    patientId: 1,
    doctorId: 2,
    date: "2025-08-20",
    time: "2:00 PM",
    status: "completed",
  },
];

// Specializations list
export const specializations = [
  "All Specializations",
  "Cardiology",
  "Neurology",
  "Dermatology",
  "Orthopedics",
  "Pediatrics",
];
