import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Clienthomepage from '../pages/Clienthomepage';

describe('Clienthomepage', () => {
  it('renders welcome card', () => {
    render(<Clienthomepage />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it('renders quick stats section', () => {
    render(<Clienthomepage />);
    expect(screen.getByText(/Quick Stats/i)).toBeInTheDocument();
  });

  it('renders upcoming appointments section', () => {
    render(<Clienthomepage />);
    expect(screen.getByText(/Next Appointment/i)).toBeInTheDocument();
  });
});
