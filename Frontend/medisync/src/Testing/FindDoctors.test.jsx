import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FindDoctors from '../components/FindDoctors';

describe('FindDoctors', () => {
  const doctors = [
    { id: 1, fullName: 'Dr. Samantha Perera', specialization: 'Cardiologist' },
    { id: 2, fullName: 'Dr. Nimal Silva', specialization: 'Dermatologist' },
  ];

  it('renders doctor search input', () => {
    render(
      <FindDoctors
        searchTerm=""
        setSearchTerm={() => {}}
        selectedSpecialization="All Specializations"
        setSelectedSpecialization={() => {}}
        doctors={doctors}
        handleBookAppointment={() => {}}
        loading={false}
      />
    );
    expect(screen.getByPlaceholderText(/Search doctors.../i)).toBeInTheDocument();
  });

  it('shows doctor in dropdown when searched', () => {
    render(
      <FindDoctors
        searchTerm=""
        setSearchTerm={() => {}}
        selectedSpecialization="All Specializations"
        setSelectedSpecialization={() => {}}
        doctors={doctors}
        handleBookAppointment={() => {}}
        loading={false}
      />
    );
    fireEvent.change(screen.getByPlaceholderText(/Search doctors.../i), { target: { value: 'Samantha' } });
    expect(screen.getByText(/Dr. Samantha Perera/i)).toBeInTheDocument();
  });
});
