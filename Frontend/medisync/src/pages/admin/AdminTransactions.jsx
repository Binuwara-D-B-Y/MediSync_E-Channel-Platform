import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../api';
import '../../styles/AdminTransactions.css';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async (searchTerm = '') => {
        try {
            const url = searchTerm ? `/api/admin/admintransactions?search=${encodeURIComponent(searchTerm)}` : '/api/admin/admintransactions';
            const data = await apiRequest(url);
            setTransactions(data || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTransactions(search);
    };

    const getStatusBadge = (status, statusValue) => {
        const badgeClass = statusValue === 1 ? 'status-paid' : statusValue === 0 ? 'status-pending' : 'status-failed';
        return <span className={`status-badge ${badgeClass}`}>{status}</span>;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR'
        }).format(amount);
    };

    if (loading) return <div className="loading">Loading transactions...</div>;

    return (
        <div className="admin-transactions">
            <div className="header">
                <h1>Manage Transactions</h1>
                <div className="transaction-stats">
                    <div className="stat-item">
                        <span className="stat-label">Total Transactions:</span>
                        <span className="stat-value">{transactions.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Total Revenue:</span>
                        <span className="stat-value">
                            {formatCurrency(transactions.reduce((sum, t) => sum + (t.amount || 0), 0))}
                        </span>
                    </div>
                </div>
            </div>

            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by Patient Name, NIC, or Payment ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">Search</button>
                    <button type="button" onClick={() => { setSearch(''); fetchTransactions(); }} className="clear-btn">
                        Clear
                    </button>
                </form>
            </div>

            <div className="transactions-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient Name</th>
                            <th>Appointment</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Bank</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{textAlign: 'center', padding: '2rem', color: '#666'}}>
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            transactions.map(transaction => (
                                <tr key={transaction.transactionId}>
                                    <td>{transaction.transactionId}</td>
                                    <td>{transaction.patientName}</td>
                                    <td>#{transaction.appointmentId}</td>
                                    <td>{formatCurrency(transaction.amount || 0)}</td>
                                    <td>{transaction.paymentMethod || 'Bank Transfer'}</td>
                                    <td>{new Date(transaction.paymentDate).toLocaleDateString()}</td>
                                    <td>{getStatusBadge(transaction.status, transaction.statusValue)}</td>
                                    <td>{transaction.bankName || 'N/A'}</td>
                                    <td>{transaction.email}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTransactions;