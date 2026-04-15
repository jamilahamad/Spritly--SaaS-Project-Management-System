import React, { useState, useEffect } from 'react';
import './TaskModal.css';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Select from '../common/Select';
import Button from '../common/Button';
import { TASK_PRIORITIES, TASK_TYPES } from '../../utils/constants';
import { useOrganization } from '../../hooks/useOrganization';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  projectId,
  loading = false
}) => {
  const { members } = useOrganization();
  const isEditing = Boolean(task);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    estimatedHours: '',
    labels: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        type: task.type || 'task',
        priority: task.priority || 'medium',
        assignee: task.assignee?._id || '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        estimatedHours: task.estimatedHours || '',
        labels: task.labels?.join(', ') || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'task',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        estimatedHours: '',
        labels: ''
      });
    }

    setErrors({});
  }, [task, isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (formData.estimatedHours && Number(formData.estimatedHours) < 0) {
      newErrors.estimatedHours = 'Estimated hours cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      priority: formData.priority,
      project: projectId,
      labels: formData.labels
        .split(',')
        .map((label) => label.trim())
        .filter(Boolean),
      assignee: formData.assignee || null,
      estimatedHours: formData.estimatedHours
        ? parseFloat(formData.estimatedHours)
        : null,
      dueDate: formData.dueDate || null
    };

    await onSubmit(taskData);
  };

  const priorityOptions = Object.entries(TASK_PRIORITIES).map(([value, { label }]) => ({
    value,
    label
  }));

  const typeOptions = Object.entries(TASK_TYPES).map(([value, { label }]) => ({
    value,
    label
  }));

  const memberOptions = members.map((member) => ({
    value: member.user._id,
    label: member.user.fullName
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="task-modal-form">
        <div className="task-modal-fields space-y-4">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Enter task title"
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the task..."
            rows={4}
          />

          <div className="task-modal-meta-row grid grid-cols-2 gap-4">
            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={typeOptions}
            />

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
            />
          </div>

          <Select
            label="Assignee"
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            options={[{ value: '', label: 'Unassigned' }, ...memberOptions]}
          />

          <div className="task-modal-dates-row grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />

            <Input
              label="Estimated Hours"
              name="estimatedHours"
              type="number"
              value={formData.estimatedHours}
              onChange={handleChange}
              error={errors.estimatedHours}
              placeholder="e.g. 4"
              min="0"
              step="0.5"
            />
          </div>

          <Input
            label="Labels"
            name="labels"
            value={formData.labels}
            onChange={handleChange}
            placeholder="bug, urgent, backend"
            helperText="Separate labels with commas"
          />
        </div>

        <div className="task-modal-actions flex items-center justify-end gap-3 mt-6 pt-6 border-t border-secondary-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="task-modal-cancel-button"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            className="task-modal-submit-button"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;