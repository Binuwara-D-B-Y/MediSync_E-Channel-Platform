import React, { useState, useEffect } from 'react';
import '../../styles/AdminSchedules.css';

const AdminSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [formData, setFormData] = useState({
        doctorId: '',
        scheduleDate: '',
        startTime: '',
        endTime: '',
        totalSlots: ''
    });

    useEffect(() => {
        fetchSchedules();
        fetchDoctors();
    }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/adminschedules', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSchedules(data);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/admindoctors', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDoctors(data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {
            const url = editingSchedule 
                ? `/api/admin/adminschedules/${editingSchedule.scheduleId}`
                : '/api/admin/adminschedules';
            
            const method = editingSchedule ? 'PUT' : 'POST';
            
            const submitData = {
                ...formData,
                doctorId: parseInt(formData.doctorId),
                totalSlots: parseInt(formData.totalSlots),
                scheduleDate: new Date(formData.scheduleDate).toISOString(),
                startTime: formData.startTime + ':00',
                endTime: formData.endTime + ':00'
            };

            if (editingSchedule) {
                submitData.scheduleId = editingSchedule.scheduleId;
                submitData.availableSlots = editingSchedule.availableSlots;
            }
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                fetchSchedules();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            doctorId: schedule.doctorId.toString(),
            scheduleDate: new Date(schedule.scheduleDate).toISOString().split('T')[0],
            startTime: schedule.startTime.substring(0, 5),
            endTime: schedule.endTime.substring(0, 5),
            totalSlots: schedule.totalSlots.toString()
        });
        setShowForm(true);
    };

    const handleDelete = async (scheduleId) => {
        if (!confirm('Are you sure you want to delete this schedule?')) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/adminschedules/${scheduleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                fetchSchedules();
            } else {
                const error = await response.json();
                alert(error.message || 'Error deleting schedule');
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            doctorId: '',
            scheduleDate: '',
            startTime: '',
            endTime: '',
            totalSlots: ''
        });
        setEditingSchedule(null);
        setShowForm(false);
    };

    if (loading) return <div className="loading">Loading schedules...</div>;

    return (
        <div className="admin-schedules">
            <div className="header">
                <h1>Manage Schedules</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    Add New Schedule
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</h2>
                        <form onSubmit={handleSubmit}>
                            <select
                                value={formData.doctorId}
                                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                                required
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                        {doctor.fullName} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={formData.scheduleDate}
                                onChange={(e) => setFormData({...formData, scheduleDate: e.target.value})}
                                required
                            />
                            <input
                                type="time"
                                placeholder="Start Time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                required
                            />
                            <input
                                type="time"
                                placeholder="End Time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Total Slots"
                                value={formData.totalSlots}
                                onChange={(e) => setFormData({...formData, totalSlots: e.target.value})}
                                min="1"
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingSchedule ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="schedules-table">
                <table>
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Total Slots</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.map(schedule => (
                            <tr key={schedule.scheduleId}>
                                <td>{schedule.doctor?.fullName}</td>
                                <td>{new Date(schedule.scheduleDate).toLocaleDateString()}</td>
                                <td>{schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}</td>
                                <td>{schedule.totalSlots}</td>
                                <td>{schedule.availableSlots}</td>
                                <td>
                                    <button onClick={() => handleEdit(schedule)} className="btn-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(schedule.scheduleId)} className="btn-delete">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSchedules;