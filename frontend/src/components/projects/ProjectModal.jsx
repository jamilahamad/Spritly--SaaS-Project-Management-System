import React, { useState, useEffect } from 'react';
import './ProjectModal.css';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import { useOrganization } from '../../hooks/useOrganization';

const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  project = null,
  loading = false
}) => {
  const { currentOrganization, members } = useOrganization();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    lead: '',
    priority: 'medium',
    startDate: '',
    endDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        key: project.key || '',
        description: project.description || '',
        lead: project.lead?._id || '',
        priority: project.priority || 'medium',
        startDate: project.startDate ? project.startDate.split('T')[0] : '',
        endDate: project.endDate ? project.endDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        name: '',
        key: '',
        description: '',
        lead: '',
        priority: 'medium',
        startDate: '',
        endDate: ''
      });
    }

    setErrors({});
  }, [project, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'name' && !isEditing) {
      const key = value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 6);

      setFormData((prevFormData) => ({
        ...prevFormData,
        name: value,
        key
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
      newErrors.name = 'Project name is required';
    }

    if (!formData.key.trim()) {
      newErrors.key = 'Project key is required';
    } else if (!/^[A-Z]{2,10}$/.test(formData.key)) {
      newErrors.key = 'Key must be 2-10 uppercase letters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const projectData = {
      ...formData,
      organization: currentOrganization._id,
      lead: formData.lead || undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined
    };

    await onSubmit(projectData);
  };

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const memberOptions = members
    .filter((member) => member.role !== 'guest')
    .map((member) => ({
      value: member.user._id,
      label: member.user.fullName
    }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="project-modal-form">
        <div className="project-modal-fields space-y-4">
          <div className="project-modal-name-row grid grid-cols-3 gap-4">
            <div className="project-modal-name-field col-span-2">
              <Input
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g., Website Redesign"
                required
              />
            </div>

            <div className="project-modal-key-field">
              <Input
                label="Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                error={errors.key}
                placeholder="e.g., PROJ"
                disabled={isEditing}
                required
              />
            </div>
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the project goals and scope..."
            rows={3}
          />

          <div className="project-modal-meta-row grid grid-cols-2 gap-4">
            <Select
              label="Project Lead"
              name="lead"
              value={formData.lead}
              onChange={handleChange}
              options={[{ value: '', label: 'Select a lead' }, ...memberOptions]}
            />

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
            />
          </div>

          <div className="project-modal-dates-row grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
            />

            <Input
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="project-modal-actions flex justify-end gap-3 mt-6 pt-4 border-t border-secondary-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="project-modal-cancel-button"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            className="project-modal-submit-button"
          >
            {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;