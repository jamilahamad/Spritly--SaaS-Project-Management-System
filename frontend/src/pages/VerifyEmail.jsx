import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineMail
} from 'react-icons/hi';
import './VerifyEmail.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import authService from '../services/authService';

const VerifyEmail = () => {
  const { token } = useParams();
  const location = useLocation();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying your email address...');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  useEffect(() => {
    const runVerification = async () => {
      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to verify your email.');
      }
    };

    if (!token || token.trim().length < 10) {
      setStatus('error');
      setMessage('Invalid or missing verification token.');
      return;
    }

    runVerification();
  }, [token]);

  const title = useMemo(() => {
    if (status === 'loading') return 'Verifying your email';
    if (status === 'success') return 'Email verified';
    if (status === 'resent') return 'Verification email sent';
    return 'Verification failed';
  }, [status]);

  const handleResend = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    try {
      setResending(true);
      const response = await authService.resendVerificationEmail(trimmedEmail);
      setStatus('resent');
      setMessage(response.message || 'Verification email sent successfully.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="verify-email-page min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="verify-email-container w-full max-w-md">
        <Card className="verify-email-card p-8">
          <div className="verify-email-header text-center mb-6">
            {status === 'success' ? (
              <HiOutlineCheckCircle className="verify-email-status-icon w-14 h-14 text-green-500 mx-auto mb-4" />
            ) : status === 'loading' ? (
              <div className="verify-email-loader w-14 h-14 mx-auto mb-4 rounded-full border-4 border-secondary-200 border-t-primary-600 animate-spin" />
            ) : status === 'resent' ? (
              <HiOutlineMail className="verify-email-status-icon w-14 h-14 text-primary-600 mx-auto mb-4" />
            ) : (
              <HiOutlineExclamationCircle className="verify-email-status-icon w-14 h-14 text-amber-500 mx-auto mb-4" />
            )}

            <h1 className="verify-email-title text-2xl font-bold text-secondary-900">
              {title}
            </h1>
            <p className="verify-email-message mt-2 text-secondary-600">{message}</p>
          </div>

          {status === 'success' && (
            <div className="verify-email-success-actions space-y-3">
              <Link to="/login" className="verify-email-login-link block">
                <Button className="verify-email-login-button w-full">Go to login</Button>
              </Link>
            </div>
          )}

          {(status === 'error' || status === 'resent') && (
            <>
              <form onSubmit={handleResend} className="verify-email-form space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  icon={HiOutlineMail}
                />
                <Button
                  type="submit"
                  className="verify-email-resend-button w-full"
                  loading={resending}
                >
                  Resend verification email
                </Button>
              </form>

              <div className="verify-email-footer mt-4 text-center text-sm text-secondary-600">
                Already verified?{' '}
                <Link
                  to="/login"
                  className="verify-email-signin-link text-primary-600 font-medium hover:text-primary-700"
                >
                  Sign in
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;