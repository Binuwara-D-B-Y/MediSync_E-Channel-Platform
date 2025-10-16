import React, { useState, useEffect } from 'react';
import { apiRequest, authHeaders } from '../../api';
import '../../styles/AdminDoctors.css';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        specialization: '',
        nic: '',
        qualification: '',
        email: '',
        contactNo: '',
        details: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const data = await apiRequest('/api/admin/admindoctors', {
                headers: authHeaders()
            });
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const url = editingDoctor 
                ? `/api/admin/admindoctors/${editingDoctor.doctorId}`
                : '/api/admin/admindoctors';
            
            const method = editingDoctor ? 'PUT' : 'POST';
            
            await apiRequest(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(editingDoctor ? { ...formData, doctorId: editingDoctor.doctorId } : formData)
            });

            fetchDoctors();
            resetForm();
        } catch (error) {
            console.error('Error saving doctor:', error);
        }
    };

    const handleEdit = (doctor) => {
        setEditingDoctor(doctor);
        setFormData({
            fullName: doctor.fullName,
            specialization: doctor.specialization,
            nic: doctor.nic,
            qualification: doctor.qualification || '',
            email: doctor.email,
            contactNo: doctor.contactNo,
            details: doctor.details
        });
        setShowForm(true);
    };

    const handleDelete = async (doctorId) => {
        if (!confirm('Are you sure you want to delete this doctor?')) return;
        
        try {
            await apiRequest(`/api/admin/admindoctors/${doctorId}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            fetchDoctors();
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            fullName: '',
            specialization: '',
            nic: '',
            qualification: '',
            email: '',
            contactNo: '',
            details: ''
        });
        setEditingDoctor(null);
        setShowForm(false);
    };

    if (loading) return <div className="loading">Loading doctors...</div>;

    return (
        <div className="admin-doctors">
            <div className="header">
                <h1>Manage Doctors</h1>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                    Add New Doctor
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Specialization"
                                value={formData.specialization}
                                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="NIC"
                                value={formData.nic}
                                onChange={(e) => setFormData({...formData, nic: e.target.value})}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Qualification"
                                value={formData.qualification}
                                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Contact Number"
                                value={formData.contactNo}
                                onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Details"
                                value={formData.details}
                                onChange={(e) => setFormData({...formData, details: e.target.value})}
                                required
                            />
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">
                                    {editingDoctor ? 'Update' : 'Create'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="doctors-table">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialization</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => (
                            <tr key={doctor.doctorId}>
                                <td>{doctor.fullName}</td>
                                <td>{doctor.specialization}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.contactNo}</td>
                                <td>
                                    <button onClick={() => handleEdit(doctor)} className="btn-edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(doctor.doctorId)} className="btn-delete">
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

export default AdminDoctors;