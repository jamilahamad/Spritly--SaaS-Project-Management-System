import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineOfficeBuilding } from 'react-icons/hi';
import './CreateOrganization.css';
import { useOrganization } from '../hooks/useOrganization';
import { generateSlug } from '../utils/helpers';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Logo from '../assets/logo.png';

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { createOrganization, loading } = useOrganization();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'name') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: value,
        slug: generateSlug(value)
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const result = await createOrganization(formData);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="create-organization-page min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-12">
      <div className="create-organization-container w-full max-w-md">
        <div className="create-organization-logo-wrapper text-center mb-8">
          <Link
            to="/"
            className="create-organization-logo-link inline-flex items-center justify-center"
          >
            <img
              src={Logo}
              alt="Sprintly Logo"
              className="create-organization-logo h-12 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="create-organization-card bg-white rounded-xl shadow-soft p-8">
          <div className="create-organization-header text-center mb-6">
            <div className="create-organization-icon-wrapper w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineOfficeBuilding className="create-organization-icon w-8 h-8 text-primary-600" />
            </div>

            <h1 className="create-organization-title text-2xl font-bold text-secondary-900">
              Create your workspace
            </h1>

            <p className="create-organization-subtitle text-secondary-500 mt-1">
              Set up your organization to start managing projects
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="create-organization-form space-y-4"
          >
            <Input
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="e.g., Acme Corporation"
              required
            />

            <Input
              label="URL Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              error={errors.slug}
              placeholder="e.g., acme-corp"
              helperText="This will be used in your workspace URL"
              required
            />

            <Textarea
              label="Description (optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Briefly describe your organization..."
              rows={3}
            />

            <Button
              type="submit"
              className="create-organization-submit-button w-full"
              loading={loading}
            >
              Create Workspace
            </Button>
          </form>
        </div>

        <div className="create-organization-footer mt-4 text-center">
          <p className="create-organization-footer-text text-sm text-secondary-500">
            Want to join an existing organization?{' '}
            <button
              type="button"
              className="create-organization-invite-button text-primary-600 hover:text-primary-700 font-medium"
            >
              Enter invite code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;