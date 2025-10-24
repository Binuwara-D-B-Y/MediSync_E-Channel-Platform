import React, { useState, useEffect } from 'react';
import '../../styles/AdminTransactions.css';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTransactions(data);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'status-completed';
            case 'pending': return 'status-pending';
            case 'failed': return 'status-failed';
            default: return '';
        }
    };

    if (loading) return <div className="loading">Loading transactions...</div>;

    return (
        <div className="admin-transactions">
            <div className="header">
                <h1>Transaction Management</h1>
            </div>

            <div className="transactions-table">
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Amount</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.transactionId}>
                                <td>{transaction.paymentId}</td>
                                <td>{transaction.patientName}</td>
                                <td>{transaction.doctorName}</td>
                                <td>Rs. {transaction.amount.toFixed(2)}</td>
                                <td>{transaction.paymentMethod || 'N/A'}</td>
                                <td>
                                    <span className={`status ${getStatusClass(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td>{new Date(transaction.paymentDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {transactions.length === 0 && (
                    <div className="no-data">No transactions found</div>
                )}
            </div>
        </div>
    );
};

export default AdminTransactions;