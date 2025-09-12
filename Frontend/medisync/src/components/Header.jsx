import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="header-title" onClick={() => navigate('/patient')}>{title}</div>
      <div className="header-actions">
        <button className="settings-button" onClick={() => navigate('/account')}>Profile</button>
        <button className="logout-button">Logout</button>
      </div>
    </header>
  );
}