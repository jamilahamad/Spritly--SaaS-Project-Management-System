import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineOfficeBuilding, HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';
import './OrganizationSettings.css';

import { canAccessSettings } from '../utils/helpers';
import EmptyState from '../components/common/EmptyState';
import { useOrganization } from '../hooks/useOrganization';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Card, { CardHeader, CardTitle, CardContent } from '../components/common/Card';

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { currentOrganization, updateOrganization } = useOrganization();

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userRole = currentOrganization?.userRole || 'member';

  useEffect(() => {
    if (currentOrganization) {
      setFormData({
        name: currentOrganization.name || '',
        description: currentOrganization.description || ''
      });
    }
  }, [currentOrganization]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setErrors({ name: 'Organization name is required' });
      return;
    }

    setLoading(true);

    const result = await updateOrganization(currentOrganization._id, formData);

    setLoading(false);

    if (result.success) {
      setErrors({});
      toast.success('Organization updated successfully');
    } else {
      toast.error(result.message || 'Failed to update organization');
    }
  };

  const handleDeleteOrganization = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this organization? This action cannot be undone and will delete all projects, tasks, and data.'
    );

    if (!confirmed) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm:');

    if (confirmText !== 'DELETE') {
      toast.info('Deletion cancelled');
      return;
    }

    try {
      toast.success('Organization deleted');
      navigate('/create-organization');
    } catch (error) {
      toast.error('Failed to delete organization');
    }
  };

  if (currentOrganization && !canAccessSettings(userRole)) {
    return (
      <EmptyState
        title="Access restricted"
        description="Only owner and admin can access organization settings."
      />
    );
  }

  return (
    <div className="organization-settings-page max-w-3xl mx-auto space-y-6">
      <div className="organization-settings-header">
        <h1 className="organization-settings-title text-2xl font-bold text-secondary-900">
          Organization Settings
        </h1>
        <p className="organization-settings-subtitle text-secondary-500 mt-1">
          Manage your workspace settings
        </p>
      </div>

      <Card className="organization-settings-general-card">
        <CardHeader className="organization-settings-card-header">
          <CardTitle className="organization-settings-card-title">General</CardTitle>
        </CardHeader>

        <CardContent className="organization-settings-card-content">
          <form
            onSubmit={handleSubmit}
            className="organization-settings-form space-y-4"
          >
            <Input
              label="Organization Name"
              value={formData.name}
              onChange={(event) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  name: event.target.value
                }))
              }
              error={errors.name}
              icon={HiOutlineOfficeBuilding}
            />

            <Input
              label="URL Slug"
              value={currentOrganization?.slug || ''}
              disabled
              helperText="The URL slug cannot be changed after creation"
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(event) =>
                setFormData((prevFormData) => ({
                  ...prevFormData,
                  description: event.target.value
                }))
              }
              placeholder="Describe your organization..."
              rows={3}
            />

            <div className="organization-settings-form-actions flex justify-end">
              <Button type="submit" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="organization-settings-workflow-card">
        <CardHeader className="organization-settings-card-header">
          <CardTitle className="organization-settings-card-title">
            Default Task Workflow
          </CardTitle>
        </CardHeader>

        <CardContent className="organization-settings-card-content">
          <p className="organization-settings-workflow-text text-sm text-secondary-600 mb-4">
            Configure the default task statuses for new projects.
          </p>

          <div className="organization-settings-workflow-list flex flex-wrap gap-2">
            {currentOrganization?.settings?.defaultTaskStatuses?.map((status, index) => (
              <div
                key={index}
                className="organization-settings-workflow-item px-3 py-1.5 bg-secondary-100 rounded-lg text-sm text-secondary-700"
              >
                {status.replace('_', ' ')}
              </div>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="organization-settings-workflow-button mt-4"
          >
            Customize Workflow
          </Button>
        </CardContent>
      </Card>

      <Card className="organization-settings-danger-card border-red-200">
        <CardHeader className="organization-settings-card-header">
          <CardTitle className="organization-settings-danger-title text-red-600">
            Danger Zone
          </CardTitle>
        </CardHeader>

        <CardContent className="organization-settings-card-content">
          <div className="organization-settings-danger-list space-y-4">
            <div className="organization-settings-danger-item flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="organization-settings-danger-text">
                <p className="organization-settings-danger-label font-medium text-secondary-900">
                  Delete Organization
                </p>
                <p className="organization-settings-danger-description text-sm text-secondary-600">
                  Permanently delete this organization and all its data
                </p>
              </div>

              <Button
                variant="danger"
                icon={HiOutlineTrash}
                onClick={handleDeleteOrganization}
                className="organization-settings-delete-button"
              >
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationSettings;