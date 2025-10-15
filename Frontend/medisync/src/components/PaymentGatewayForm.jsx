import React, { useState } from 'react';
import '../styles/PaymentGatewayForm.css';

export default function PaymentGatewayForm({ amount, onCancel, onCheckout }) {
  const [accName, setAccName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  const [pin, setPin] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validate = () => {
    const e = {};
    
    // Account name validation
    if (!accName || !accName.trim()) {
      e.accName = 'Account name is required';
    } else if (accName.trim().length < 2) {
      e.accName = 'Account name must be at least 2 characters';
    }
    
    // Account number validation
    if (!accNo || !accNo.trim()) {
      e.accNo = 'Account number is required';
    } else if (!/^[0-9]+$/.test(accNo.trim())) {
      e.accNo = 'Account number must be digits only';
    } else if (accNo.trim().length < 6 || accNo.trim().length > 24) {
      e.accNo = 'Account number must be 6-24 digits';
    }
    
    // Bank name validation
    if (!bankName || !bankName.trim()) {
      e.bankName = 'Bank name is required';
    } else if (bankName.trim().length < 2) {
      e.bankName = 'Bank name must be at least 2 characters';
    }
    
    // Bank branch validation
    if (!bankBranch || !bankBranch.trim()) {
      e.bankBranch = 'Bank branch is required';
    }
    
    // PIN validation
    if (!pin || !pin.trim()) {
      e.pin = 'PIN is required';
    } else if (!/^[0-9]{4}$/.test(pin.trim())) {
      e.pin = 'PIN must be exactly 4 digits';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setIsProcessing(true);
    try {
      if (onCheckout) {
        // pass minimal payment payload (do not include sensitive info in logs)
        await onCheckout({ accName, accNo, bankName, bankBranch, pin, amount });
      }
    } catch (err) {
      console.error('Checkout failed', err);
      // swallow; onCheckout should handle user-facing errors
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-overlay">
      <div className="payment-box">
        <h4>Payment Details</h4>
        <div className="form-group">
          <label>Account Name</label>
          <input 
            className={`form-input ${errors.accName ? 'error' : ''}`} 
            value={accName} 
            onChange={e=>setAccName(e.target.value)}
            placeholder="Enter account holder name"
          />
          {errors.accName && <div className="form-error">{errors.accName}</div>}
        </div>
        
        <div className="form-group">
          <label>Account Number</label>
          <input 
            className={`form-input ${errors.accNo ? 'error' : ''}`} 
            value={accNo} 
            onChange={e=>setAccNo(e.target.value)}
            placeholder="Enter account number"
          />
          {errors.accNo && <div className="form-error">{errors.accNo}</div>}
        </div>
        
        <div className="form-group">
          <label>Bank Name</label>
          <input 
            className={`form-input ${errors.bankName ? 'error' : ''}`} 
            value={bankName} 
            onChange={e=>setBankName(e.target.value)}
            placeholder="Enter bank name"
          />
          {errors.bankName && <div className="form-error">{errors.bankName}</div>}
        </div>
        
        <div className="form-group">
          <label>Bank Branch</label>
          <input 
            className={`form-input ${errors.bankBranch ? 'error' : ''}`} 
            value={bankBranch} 
            onChange={e=>setBankBranch(e.target.value)}
            placeholder="Enter bank branch"
          />
          {errors.bankBranch && <div className="form-error">{errors.bankBranch}</div>}
        </div>
        
        <div className="form-group">
          <label>PIN</label>
          <input 
            className={`form-input ${errors.pin ? 'error' : ''}`} 
            type="password"
            value={pin} 
            onChange={e=>setPin(e.target.value)} 
            maxLength={4}
            placeholder="4-digit PIN"
          />
          {errors.pin && <div className="form-error">{errors.pin}</div>}
        </div>

        <div className="payment-summary">
          <span className="label">Amount:</span>
          <span className="value">Rs. {amount}</span>
        </div>

        <div className="payment-actions">
          <button className="btn-secondary" onClick={onCancel} disabled={isProcessing}>Cancel</button>
          <button className="btn-primary" onClick={handleCheckout} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Checkout'}</button>
        </div>
      </div>
    </div>
  );
}
