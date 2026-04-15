import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './CheckEmail.css';
import authService from '../services/authService';

export default function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setMessage('Email address is missing. Please register again.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.resendVerificationEmail(email);
      setMessage(response.message || 'Verification email sent again');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-email-page min-h-screen flex items-center justify-center px-4 py-12 bg-secondary-50">
      <div className="check-email-container w-full max-w-md">
        <div className="check-email-card w-full bg-white shadow rounded-xl p-6 text-center">
          <h1 className="check-email-title text-2xl font-bold mb-4 text-secondary-900">
            Please verify your email
          </h1>

          <p className="check-email-label text-secondary-600 mb-2">
            We sent a verification link to:
          </p>

          <p className="check-email-address font-semibold mb-6 break-all text-secondary-900">
            {email || 'your email address'}
          </p>

          <p className="check-email-description text-secondary-500 mb-6">
            Please verify your email before using Sprintly.
          </p>

          {message && (
            <p className="check-email-message mb-4 text-sm text-blue-600">{message}</p>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="check-email-resend-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Resend verification email'}
          </button>

          <div className="check-email-footer mt-4">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="check-email-back-button text-blue-600 underline hover:text-blue-700 transition-colors"
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}