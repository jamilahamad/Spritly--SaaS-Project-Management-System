import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  HiOutlineOfficeBuilding,
  HiOutlineUserAdd,
  HiOutlineMail,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import './AcceptInvitation.css';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { OrganizationContext } from '../context/OrganizationContext';

const AcceptInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { refreshOrganizations } = useContext(OrganizationContext);

  const [invitation, setInvitation] = useState(null);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Loading invitation details...');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const response = await authService.getInvitationDetails(token);
        setInvitation(response.data);
        setStatus('ready');
        setMessage('Invitation details loaded.');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Unable to load invitation.');
      }
    };

    if (token) {
      fetchInvitation();
    } else {
      setStatus('error');
      setMessage('Missing invitation token.');
    }
  }, [token]);

  useEffect(() => {
    const stateToken = location.state?.invitationToken;

    if (isAuthenticated && stateToken && stateToken === token) {
      window.history.replaceState({}, document.title);
    }
  }, [isAuthenticated, location.state, token]);

  const handleAccept = async () => {
    try {
      setSubmitting(true);

      const response = await authService.acceptInvitationByToken(token);

      await refreshOrganizations(true);
      setStatus('accepted');
      setMessage(response.message || 'Invitation accepted successfully.');

      navigate('/dashboard', { replace: true });
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to accept invitation.');
    } finally {
      setSubmitting(false);
    }
  };

  const authState = {
    invitationToken: token,
    redirectTo: `/accept-invite/${token}`
  };

  return (
    <div className="accept-invitation-page min-h-screen bg-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="accept-invitation-container w-full max-w-2xl">
        <Card className="accept-invitation-card p-8">
          <div className="accept-invitation-header text-center mb-8">
            <HiOutlineUserAdd className="accept-invitation-header-icon w-14 h-14 text-primary-600 mx-auto mb-4" />
            <h1 className="accept-invitation-title text-3xl font-bold text-secondary-900">
              Organization invitation
            </h1>
            <p className="accept-invitation-subtitle mt-2 text-secondary-600">
              Review the invitation and accept it with the matching verified account.
            </p>
          </div>

          {status === 'loading' && (
            <div className="accept-invitation-loading text-center text-secondary-600">
              Loading invitation details...
            </div>
          )}

          {status !== 'loading' && invitation && (
            <div className="accept-invitation-details space-y-4 mb-8">
              <div className="accept-invitation-org-box rounded-lg border border-secondary-200 bg-secondary-50 p-4 flex items-start gap-3">
                <HiOutlineOfficeBuilding className="accept-invitation-org-icon w-6 h-6 text-primary-600 mt-0.5" />
                <div className="accept-invitation-org-content">
                  <div className="accept-invitation-org-label text-sm text-secondary-500">
                    Organization
                  </div>
                  <div className="accept-invitation-org-name font-semibold text-secondary-900">
                    {invitation.organization?.name}
                  </div>
                </div>
              </div>

              <div className="accept-invitation-info-grid grid md:grid-cols-2 gap-4">
                <div className="accept-invitation-email-box rounded-lg border border-secondary-200 p-4">
                  <div className="accept-invitation-email-label flex items-center gap-2 text-secondary-500 text-sm mb-1">
                    <HiOutlineMail className="w-4 h-4" />
                    Invited email
                  </div>
                  <div className="accept-invitation-email-value font-medium text-secondary-900 break-all">
                    {invitation.email}
                  </div>
                </div>

                <div className="accept-invitation-role-box rounded-lg border border-secondary-200 p-4">
                  <div className="accept-invitation-role-label flex items-center gap-2 text-secondary-500 text-sm mb-1">
                    <HiOutlineShieldCheck className="w-4 h-4" />
                    Role
                  </div>
                  <div className="accept-invitation-role-value font-medium text-secondary-900 capitalize">
                    {invitation.role}
                  </div>
                </div>
              </div>

              {invitation.invitedBy && (
                <div className="accept-invitation-inviter text-sm text-secondary-600">
                  Invited by{' '}
                  <span className="accept-invitation-inviter-name font-medium text-secondary-900">
                    {invitation.invitedBy.fullName}
                  </span>
                  {invitation.invitedBy.email ? ` (${invitation.invitedBy.email})` : ''}
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="accept-invitation-error rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 mb-6">
              {message}
            </div>
          )}

          {status !== 'error' && invitation && !isAuthenticated && (
            <div className="accept-invitation-auth-prompt space-y-3">
              <div className="accept-invitation-auth-note rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm">
                Sign in or create an account using <strong>{invitation.email}</strong>, then
                return here to accept the invitation.
              </div>

              <div className="accept-invitation-auth-actions flex flex-col sm:flex-row gap-3">
                <Button
                  className="accept-invitation-signin-button w-full"
                  onClick={() => navigate('/login', { state: authState })}
                >
                  Sign in to accept
                </Button>

                <Button
                  className="accept-invitation-register-button w-full"
                  variant="outline"
                  onClick={() => navigate('/register', { state: authState })}
                >
                  Create account
                </Button>
              </div>
            </div>
          )}

          {status !== 'error' && invitation && isAuthenticated && (
            <div className="accept-invitation-authenticated space-y-4">
              <div className="accept-invitation-account-note rounded-lg bg-secondary-50 border border-secondary-200 p-4 text-sm text-secondary-700">
                Signed in as <strong>{user?.email || 'your account'}</strong>. This must match
                the invited email and the account must be verified.
              </div>

              <Button
                className="accept-invitation-confirm-button w-full"
                onClick={handleAccept}
                loading={submitting}
              >
                Accept invitation
              </Button>
            </div>
          )}

          <div className="accept-invitation-footer mt-6 text-center text-sm text-secondary-500">
            <Link
              to="/"
              className="accept-invitation-home-link hover:text-primary-600"
            >
              Back to home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvitation;