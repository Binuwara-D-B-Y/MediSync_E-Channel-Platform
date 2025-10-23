import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api';
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
            const data = await apiRequest('/api/doctorschedules');
            setSchedules(data || []);
        } catch (error) {
            console.error('Error fetching schedules:', error);
            setSchedules([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            const data = await apiRequest('/api/doctors');
            setDoctors(data || []);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Validate required fields
            if (!formData.doctorId || !formData.scheduleDate || !formData.startTime || !formData.endTime || !formData.totalSlots) {
                alert('Please fill in all required fields');
                return;
            }

            const submitData = {
                doctorId: parseInt(formData.doctorId),
                scheduleDate: formData.scheduleDate,
                startTime: formData.startTime,
                endTime: formData.endTime,
                totalSlots: parseInt(formData.totalSlots)
            };

            console.log('Submitting data:', submitData);

            if (editingSchedule) {
                submitData.scheduleId = editingSchedule.scheduleId;
                await apiRequest(`/api/doctorschedules/${editingSchedule.scheduleId}`, {
                    method: 'PUT',
                    body: JSON.stringify(submitData)
                });
            } else {
                await apiRequest('/api/doctorschedules', {
                    method: 'POST',
                    body: JSON.stringify(submitData)
                });
            }
            
            fetchSchedules();
            resetForm();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Error saving schedule: ' + error.message);
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
            await apiRequest(`/api/doctorschedules/${scheduleId}`, {
                method: 'DELETE'
            });
            fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Error deleting schedule: ' + error.message);
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
                        {schedules.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                                    No schedules found. Click "Add New Schedule" to create one.
                                </td>
                            </tr>
                        ) : (
                            schedules.map(schedule => (
                                <tr key={schedule.scheduleId}>
                                    <td>{schedule.doctorName || 'Unknown Doctor'}</td>
                                    <td>{new Date(schedule.scheduleDate).toLocaleDateString()}</td>
                                    <td>
                                        {schedule.startTime || 'N/A'} - {schedule.endTime || 'N/A'}
                                    </td>
                                    <td>{schedule.totalSlots || 0}</td>
                                    <td>{schedule.availableSlots || 0}</td>
                                    <td>
                                        <button onClick={() => handleEdit(schedule)} className="btn-edit">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(schedule.scheduleId)} className="btn-delete">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSchedules;