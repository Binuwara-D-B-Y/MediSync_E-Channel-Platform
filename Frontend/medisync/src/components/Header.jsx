import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    <header className="card" style={{ borderRadius: 0, borderLeft: 0, borderRight: 0, borderTop: 0 }}>
      <div className="flex items-center justify-between p-4">
        <h1 
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate('/patient')}
          style={{ color: 'var(--primary-600)', cursor: 'pointer' }}
        >
          {title}
        </h1>
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              className="btn btn-secondary"
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}