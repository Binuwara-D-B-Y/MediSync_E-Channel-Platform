import React, { useState, useEffect } from 'react';
import { apiRequest, authHeaders } from '../../api';
import '../../styles/AdminDoctors.css';

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [sortField, setSortField] = useState('fullName');
    const [sortDirection, setSortDirection] = useState('asc');
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
            const data = await apiRequest('/api/doctors');
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted with data:', formData);
        
        try {
            let result;
            if (editingDoctor) {
                console.log(`Making request to: /api/doctors/${editingDoctor.doctorId} with method: PUT`);
                result = await apiRequest(`/api/doctors/${editingDoctor.doctorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, doctorId: editingDoctor.doctorId })
                });
            } else {
                console.log('Making request to: /api/doctors with method: POST');
                result = await apiRequest('/api/doctors', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
            }
            
            console.log('Doctor saved successfully:', result);
            fetchDoctors();
            resetForm();
        } catch (error) {
            console.error('Error saving doctor:', error);
            console.error('Form data sent:', formData);
            if (editingDoctor) {
                console.error('Editing doctor:', editingDoctor);
            }
            alert('Error saving doctor: ' + error.message);
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
            await apiRequest(`/api/doctors/${doctorId}`, {
                method: 'DELETE'
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

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedDoctors = [...doctors].sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        if (sortDirection === 'asc') {
            return aVal.localeCompare(bVal);
        }
        return bVal.localeCompare(aVal);
    });

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
                            <th onClick={() => handleSort('fullName')} style={{cursor: 'pointer'}}>
                                Name {sortField === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('specialization')} style={{cursor: 'pointer'}}>
                                Specialization {sortField === 'specialization' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>
                                Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedDoctors.map(doctor => (
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