import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Auth.scss';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Check if token is available in the URL params
    if (!token) {
      setError('No token provided');
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
       await axios.post(`https://api.citratechsolar.com/reset-password/${token}`, { password }, {
        headers: {
          'Authorization': `Bearer ${Cookies.get('authToken')}`, // Include token in headers if needed
        },
      });
      setMessage('Password reset successful');
      setError('');
      navigate('/login');
    } catch (err) {
      setError('Password reset failed');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        {message && <p className="message">{message}</p>}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleResetPassword}>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
