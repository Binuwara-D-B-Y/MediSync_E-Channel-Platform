import React from 'react';
import '../styles/Header.css';

export default function Header({ title }) {
  return (
    <header className="dashboard-header">
      <div className="header-title">{title}</div>
      <div className="header-actions">
        <button className="settings-button">Profile</button>
        <button className="logout-button">Logout</button>
      </div>
    </header>
  );
}