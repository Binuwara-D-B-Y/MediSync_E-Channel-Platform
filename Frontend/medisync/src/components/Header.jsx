import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

export default function Header({ title, actions = [] }) {
  const navigate = useNavigate();

  const handleActionClick = (action) => {
    if (action.label === 'Logout') {
      localStorage.clear();
      navigate('/login');
    } else {
      navigate(action.path);
    }
  };

  return (
    <header className="dashboard-header">
      <div className="header-title" onClick={() => navigate('/patient')}>
        {title}
      </div>
      <div className="header-actions">
        {actions.map((action, index) => (
          <button
            key={index}
            className={action.className || "header-button"}
            onClick={() => handleActionClick(action)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}