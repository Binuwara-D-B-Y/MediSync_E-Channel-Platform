import React from 'react';
import { Calendar, Clock, Star } from 'lucide-react';
import '../styles/QuickStats.css';

export default function QuickStats({ upcomingAppointmentsCount, totalAppointmentsCount, doctors }) {
  return (
    <div className="quick-stats-grid">
      <div className="quick-stat-card">
        <div className="quick-stat-icon blue"><Calendar size={24} /></div>
        <div>
          <p className="quick-stat-label">Upcoming Appointments</p>
          <p className="quick-stat-value">{upcomingAppointmentsCount}</p>
        </div>
      </div>

      <div className="quick-stat-card">
        <div className="quick-stat-icon green"><Clock size={24} /></div>
        <div>
          <p className="quick-stat-label">Total Appointments</p>
          <p className="quick-stat-value">{totalAppointmentsCount}</p>
        </div>
      </div>

      <div className="quick-stat-card">
        <div className="quick-stat-icon purple"><Star size={24} /></div>
        <div>
          <p className="quick-stat-label">Saved Doctors</p>
          <p className="quick-stat-value">{doctors.filter(d => d.isAvailable).length}</p>
        </div>
      </div>
    </div>
  );
}
