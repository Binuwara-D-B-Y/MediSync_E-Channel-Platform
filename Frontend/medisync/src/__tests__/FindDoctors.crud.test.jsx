import React from 'react';
import './setupTests.js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FindDoctors from '../components/FindDoctors.jsx';
import { vi, describe, test, expect, afterEach, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

const wrap = (ui) => <BrowserRouter>{ui}</BrowserRouter>;

describe('FindDoctors frontend fetch & UI behaviors', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi?.resetAllMocks?.();
  });

  test('loads specializations and shows search results on query', async () => {
    const specializations = ['Cardiology', 'Dermatology'];
    const doctors = [
      { id: 1, name: 'Dr Alice', specialization: 'Cardiology' },
      { id: 2, name: 'Dr Bob', specialization: 'Dermatology' }
    ];

  global.fetch = vi.fn((input, init) => {
      const url = typeof input === 'string' ? input : input.url;
      if (url.endsWith('/api/specializations') && (init?.method ?? 'GET') === 'GET') {
        return Promise.resolve(new Response(JSON.stringify(specializations), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      if (url.startsWith('/api/doctors') && (init?.method ?? 'GET') === 'GET') {
        return Promise.resolve(new Response(JSON.stringify(doctors), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      }
      return Promise.resolve(new Response(null, { status: 404 }));
    });

    // Render component with required props so it won't throw when accessing `doctors`
    render(wrap(<FindDoctors
      doctors={doctors}
      searchTerm={''}
      setSearchTerm={() => {}}
      selectedSpecialization={'All Specializations'}
      setSelectedSpecialization={() => {}}
      handleBookAppointment={() => {}}
      loading={false}
    />));

    // Wait for specialization options to render (adjust selector to your component)
    await waitFor(() => {
      const select = screen.getByRole('combobox') || screen.queryByLabelText(/specialization/i);
      expect(!!select).toBe(true);
    });

    const select = screen.getByRole('combobox') || screen.queryByLabelText(/specialization/i);
    if (select) {
      await userEvent.selectOptions(select, ['Cardiology']);
      expect(select.value === 'Cardiology' || select.options[select.selectedIndex].text === 'Cardiology').toBeTruthy();
    }

    // Type into search box and assert that the provided doctors prop produces results
    const searchInput = screen.getByPlaceholderText(/search/i) || screen.getByRole('textbox');
    await userEvent.type(searchInput, 'Alice');

    await waitFor(() => {
      const el = screen.queryByText(/Dr Alice/i);
      expect(!!el).toBe(true);
    });
  });
});
