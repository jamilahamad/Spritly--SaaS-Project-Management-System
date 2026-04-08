import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineMail,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle
} from 'react-icons/hi';
import './ForgotPassword.css';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { validateForgotPasswordForm } from '../utils/validators';
import { toast } from 'react-toastify';
import Logo from '../assets/logo.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validation = validateForgotPasswordForm({ email });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await api.post('/auth/forgot-password', { email });

      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      setErrors({ email: message });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    if (errors.email) {
      setErrors({});
    }
  };

  if (submitted) {
    return (
      <div className="forgot-password-page min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-12">
        <div className="forgot-password-container w-full max-w-md">
          <div className="forgot-password-logo-wrapper text-center mb-8">
            <Link
              to="/"
              className="forgot-password-logo-link inline-flex items-center justify-center"
            >
              <img
                src={Logo}
                alt="Sprintly Logo"
                className="forgot-password-logo h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <div className="forgot-password-success-card bg-white rounded-xl shadow-soft p-8 text-center">
            <div className="forgot-password-success-icon-wrapper w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineCheckCircle className="forgot-password-success-icon w-8 h-8 text-green-600" />
            </div>

            <h1 className="forgot-password-success-title text-2xl font-bold text-secondary-900 mb-2">
              Check your email
            </h1>

            <p className="forgot-password-success-text text-secondary-500 mb-6">
              We&apos;ve sent a password reset link to
              <br />
              <strong className="forgot-password-success-email text-secondary-700">{email}</strong>
            </p>

            <p className="forgot-password-retry-text text-sm text-secondary-500 mb-6">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="forgot-password-retry-button text-primary-600 hover:text-primary-700 font-medium"
              >
                try again
              </button>
            </p>

            <Link to="/login" className="forgot-password-back-login-link block">
              <Button variant="secondary" className="forgot-password-back-login-button w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-12">
      <div className="forgot-password-container w-full max-w-md">
        <div className="forgot-password-logo-wrapper text-center mb-8">
          <Link
            to="/"
            className="forgot-password-logo-link inline-flex items-center justify-center"
          >
            <img
              src={Logo}
              alt="Sprintly Logo"
              className="forgot-password-logo h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="forgot-password-card bg-white rounded-xl shadow-soft p-8">
          <Link
            to="/login"
            className="forgot-password-back-link inline-flex items-center gap-1 text-sm text-secondary-500 hover:text-secondary-700 mb-6"
          >
            <HiOutlineArrowLeft className="forgot-password-back-icon w-4 h-4" />
            Back to login
          </Link>

          <div className="forgot-password-header text-center mb-6">
            <h1 className="forgot-password-title text-2xl font-bold text-secondary-900">
              Forgot password?
            </h1>
            <p className="forgot-password-subtitle text-secondary-500 mt-1">
              No worries, we&apos;ll send you reset instructions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="forgot-password-form space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              placeholder="Enter your email"
              icon={HiOutlineMail}
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              className="forgot-password-submit-button w-full"
              loading={loading}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="forgot-password-footer mt-6 text-center">
            <p className="forgot-password-footer-text text-secondary-500">
              Remember your password?{' '}
              <Link
                to="/login"
                className="forgot-password-signin-link text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;