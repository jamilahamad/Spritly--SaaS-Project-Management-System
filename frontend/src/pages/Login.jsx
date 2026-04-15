import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';
import './Login.css';
import { AuthContext } from '../context/AuthContext';
import { OrganizationContext } from '../context/OrganizationContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useContext(AuthContext);
  const { refreshOrganizations } = useContext(OrganizationContext);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.redirectTo;
  const invitationToken = location.state?.invitationToken;
  const registeredEmail = location.state?.registeredEmail;

  useEffect(() => {
    if (registeredEmail && !formData.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: registeredEmail
      }));
    }
  }, [registeredEmail, formData.email]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo || '/dashboard'} replace />;
  }

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData);

      if (!result?.success) {
        if (result?.requiresEmailVerification) {
          navigate('/check-email', {
            replace: true,
            state: { email: result.email || formData.email }
          });
          return;
        }

        setLoading(false);
        return;
      }

      const organizations = await refreshOrganizations(true);

      if (redirectTo) {
        navigate(redirectTo, {
          replace: true,
          state: invitationToken ? { invitationToken } : undefined
        });
      } else if (organizations.length > 0) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/create-organization', { replace: true });
      }
    } catch (error) {
      console.error('Login submit error:', error);

      const errorData = error.response?.data;

      if (errorData?.requiresEmailVerification) {
        navigate('/check-email', {
          replace: true,
          state: { email: errorData.email || formData.email }
        });
        return;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        general: errorData?.message || 'Login failed. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center px-4 py-12">
      <div className="login-container w-full max-w-md">
        <Card className="login-card p-8">
          <div className="login-header text-center mb-8">
            {registeredEmail && (
              <div className="login-success-message mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Registration successful. Check your inbox for a verification link before signing
                in.
              </div>
            )}

            {errors.general && (
              <div className="login-error-message mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.general}
              </div>
            )}

            <h1 className="login-title text-3xl font-bold text-secondary-900 mb-2">
              Welcome back
            </h1>

            <p className="login-subtitle text-secondary-600">
              Sign in to your Sprintly account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Enter your email"
              leftIcon={HiOutlineMail}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              leftIcon={HiOutlineLockClosed}
            />

            <div className="login-actions flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="login-forgot-link text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="login-footer mt-6 text-center">
            <p className="login-footer-text text-secondary-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="login-register-link text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;