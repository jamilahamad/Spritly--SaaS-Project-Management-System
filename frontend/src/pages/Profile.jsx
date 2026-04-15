import React, { useRef, useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineCamera
} from 'react-icons/hi';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [actionLoading, setActionLoading] = useState('');

  const {
    user,
    updateProfile,
    updatePassword,
    uploadProfileImage,
    removeProfileImage,
    logout
  } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setActionLoading('upload');

      const result = await uploadProfileImage(selectedFile);

      if (result.success) {
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setActionLoading('');
    }
  };

  const handleRemoveImage = async () => {
    if (!user?.avatar) {
      toast.error('No profile image to remove');
      return;
    }

    try {
      setActionLoading('remove');

      const result = await removeProfileImage();

      if (result.success) {
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } finally {
      setActionLoading('');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading('delete');

      await authService.deleteMyAccount();
      await logout(false);

      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setActionLoading('');
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileErrors({});

    if (!profileData.fullName.trim()) {
      setProfileErrors({ fullName: 'Name is required' });
      return;
    }

    setProfileLoading(true);
    await updateProfile(profileData);
    setProfileLoading(false);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordErrors({});

    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setPasswordErrors(newErrors);
      return;
    }

    setPasswordLoading(true);

    const result = await updatePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }

    setPasswordLoading(false);
  };

  return (
    <div className="profile-page max-w-3xl mx-auto space-y-6">
      <div className="profile-page-header">
        <h1 className="profile-page-title text-2xl font-bold text-secondary-900">
          Profile Settings
        </h1>
        <p className="profile-page-subtitle mt-1 text-secondary-500">
          Manage your account settings
        </p>
      </div>

      <Card className="profile-image-card">
        <CardHeader className="profile-card-header">
          <CardTitle className="profile-card-title">Profile Picture</CardTitle>
        </CardHeader>

        <CardContent className="profile-card-content">
          <div className="profile-image-section flex items-center gap-6">
            <div className="profile-avatar-wrapper relative">
              <Avatar src={user?.avatar} name={user?.fullName} size="xl" />

              <button
                type="button"
                onClick={handleChooseImage}
                className="profile-avatar-edit-button absolute bottom-0 right-0 rounded-full bg-primary-600 p-2 text-white transition-colors hover:bg-primary-700"
              >
                <HiOutlineCamera className="profile-avatar-edit-icon h-4 w-4" />
              </button>
            </div>

            <div className="profile-image-content flex-1">
              <p className="profile-image-help text-sm text-secondary-600">
                Upload a new profile picture. Supported formats: JPG, PNG, WEBP. Max size: 2MB.
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="profile-image-input mt-3 block w-full text-sm text-secondary-600"
              />

              {selectedFile && (
                <p className="profile-image-selected mt-2 text-sm text-secondary-500">
                  Selected: {selectedFile.name}
                </p>
              )}

              <div className="profile-image-actions mt-3 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onClick={handleUploadImage}
                  loading={actionLoading === 'upload'}
                  disabled={!selectedFile}
                >
                  Upload Image
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={handleRemoveImage}
                  loading={actionLoading === 'remove'}
                  disabled={!user?.avatar}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="profile-info-card">
        <CardHeader className="profile-card-header">
          <CardTitle className="profile-card-title">Profile Information</CardTitle>
        </CardHeader>

        <CardContent className="profile-card-content">
          <form onSubmit={handleProfileSubmit} className="profile-info-form space-y-4">
            <Input
              label="Full Name"
              value={profileData.fullName}
              onChange={(event) =>
                setProfileData((prevProfileData) => ({
                  ...prevProfileData,
                  fullName: event.target.value
                }))
              }
              error={profileErrors.fullName}
              icon={HiOutlineUser}
            />

            <Input
              label="Email Address"
              type="email"
              value={profileData.email}
              onChange={(event) =>
                setProfileData((prevProfileData) => ({
                  ...prevProfileData,
                  email: event.target.value
                }))
              }
              error={profileErrors.email}
              icon={HiOutlineMail}
            />

            <div className="profile-info-actions flex justify-end">
              <Button type="submit" loading={profileLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="profile-password-card">
        <CardHeader className="profile-card-header">
          <CardTitle className="profile-card-title">Change Password</CardTitle>
        </CardHeader>

        <CardContent className="profile-card-content">
          <form onSubmit={handlePasswordSubmit} className="profile-password-form space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(event) =>
                setPasswordData((prevPasswordData) => ({
                  ...prevPasswordData,
                  currentPassword: event.target.value
                }))
              }
              error={passwordErrors.currentPassword}
              icon={HiOutlineLockClosed}
            />

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(event) =>
                setPasswordData((prevPasswordData) => ({
                  ...prevPasswordData,
                  newPassword: event.target.value
                }))
              }
              error={passwordErrors.newPassword}
              icon={HiOutlineLockClosed}
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(event) =>
                setPasswordData((prevPasswordData) => ({
                  ...prevPasswordData,
                  confirmPassword: event.target.value
                }))
              }
              error={passwordErrors.confirmPassword}
              icon={HiOutlineLockClosed}
            />

            <div className="profile-password-actions flex justify-end">
              <Button type="submit" loading={passwordLoading}>
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="profile-danger-card border-red-200">
        <CardHeader className="profile-card-header">
          <CardTitle className="profile-danger-title text-red-600">Danger Zone</CardTitle>
        </CardHeader>

        <CardContent className="profile-card-content">
          <p className="profile-danger-text mb-4 text-sm text-secondary-600">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            loading={actionLoading === 'delete'}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;