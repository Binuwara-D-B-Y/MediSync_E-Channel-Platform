import React, { useState, useEffect } from 'react';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/admindashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Today's Appointments</h3>
                    <p className="stat-number">{stats?.todayAppointments || 0}</p>
                </div>
            </div>

            <div className="recent-appointments">
                <h2>Recent Appointments</h2>
                <div className="appointments-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Schedule Date</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentAppointments?.map(appointment => (
                                <tr key={appointment.appointmentId}>
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{new Date(appointment.scheduleDate).toLocaleDateString()}</td>
                                    <td>{new Date(appointment.bookingDate).toLocaleDateString()}</td>
                                    <td className={`status ${appointment.status.toLowerCase()}`}>
                                        {appointment.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;