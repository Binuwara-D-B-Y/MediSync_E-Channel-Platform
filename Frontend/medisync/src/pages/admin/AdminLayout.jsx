import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <nav className="admin-sidebar">
                <div className="admin-logo">
                    <h2>MediSync Admin</h2>
                </div>
                <ul className="admin-nav">
                    <li>
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/admin/doctors">Manage Doctors</Link>
                    </li>
                    <li>
                        <Link to="/admin/schedules">Manage Schedules</Link>
                    </li>
                    <li>
                        <Link to="/admin/transactions">Manage Transactions</Link>
                    </li>
                </ul>
                <div className="admin-logout">
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </nav>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;