import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WelcomeCard from '../components/WelcomeCard';

describe('WelcomeCard', () => {
  it('renders with user name', () => {
    render(<WelcomeCard name="Yesen" />);
    expect(screen.getByText(/Welcome back, Yesen!/i)).toBeInTheDocument();
  });

  it('renders with default name', () => {
    render(<WelcomeCard name="User" />);
    expect(screen.getByText(/Welcome back, User!/i)).toBeInTheDocument();
  });
});
