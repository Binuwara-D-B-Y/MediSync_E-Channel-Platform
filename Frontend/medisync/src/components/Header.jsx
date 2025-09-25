import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header({ title, actions }) {
  const navigate = useNavigate();

  // Default actions (if none are passed from props)
  const defaultActions = [
    { label: "Profile", path: "/account", className: "settings-button" },
    { label: "Logout", path: "/logout", className: "logout-button" },
  ];

  const actionButtons = actions && actions.length > 0 ? actions : defaultActions;

  return (
    <header className="dashboard-header">
      <div className="header-title" onClick={() => navigate("/patient")}>
        {title}
      </div>
      <div className="header-actions">
        {actionButtons.map((action, index) => (
          <button
            key={index}
            className={action.className || "header-button"}
            onClick={() => navigate(action.path)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </header>
  );
}
