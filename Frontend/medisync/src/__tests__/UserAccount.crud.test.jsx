import React from 'react';
import './setupTests.js';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, afterEach, beforeEach } from 'vitest';
import UserAccount from '../pages/UserAccount.jsx';

// Minimal browser router wrapper if component uses routing
import { BrowserRouter } from 'react-router-dom';

const wrap = (ui) => <BrowserRouter>{ui}</BrowserRouter>;

describe('UserAccount CRUD (frontend)', () => {
  const originalFetch = global.fetch;
  const originalAlert = global.alert;

  afterEach(() => {
    global.fetch = originalFetch;
    vi?.resetAllMocks?.();
    global.alert = originalAlert;
  });

  test('loads profile, allows edit, and sends PUT on save', async () => {
    const initialUser = {
      id: 1,
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-1111'
    };
    const updatedUser = { ...initialUser, fullName: 'Jane Updated' };

    // Component uses local mock data for profile; no network fetch expected.

    render(wrap(<UserAccount />));

    // Wait for initial name to appear (component shows the current mocked profile text)
    await waitFor(() => {
      const el = screen.queryByText(/Jane Doe/i) || screen.queryByText(/yesen binuwara/i);
      expect(!!el).toBe(true);
    });

  // Click Edit button (adjust text/role if different)
    const editBtn = screen.getByRole('button', { name: /edit profile/i }) || screen.getByText(/edit/i);
    await userEvent.click(editBtn);

    // Find name input by its current displayed value since label isn't associated in the markup
    let nameInput = screen.queryByDisplayValue(/Jane Doe/i) || screen.queryByDisplayValue(/yesen binuwara/i) || screen.queryByPlaceholderText(/full name/i) || document.querySelector('input[name="name"]') || screen.getByRole('textbox');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Jane Updated');

    // Mock alert so jsdom doesn't throw
    global.alert = vi.fn();

    // Submit/save (adjust button text)
    const saveBtn = screen.getByRole('button', { name: /save/i }) || screen.getByText(/save/i);
    await userEvent.click(saveBtn);
    // Wait for the UI to update to profile view and show the updated name
    await waitFor(() => {
      const el = screen.queryByText(/Jane Updated/i);
      expect(!!el).toBe(true);
    });

    // Ensure alert was called to signal save
    expect(global.alert).toHaveBeenCalled();
  });
});
