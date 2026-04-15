import React from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import './TaskFilters.css';
import Select from '../common/Select';
import { TASK_PRIORITIES, TASK_TYPES } from '../../utils/constants';
import { useOrganization } from '../../hooks/useOrganization';

const TaskFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const { members } = useOrganization();

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== undefined
  );

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    ...Object.entries(TASK_PRIORITIES).map(([value, { label }]) => ({
      value,
      label
    }))
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    ...Object.entries(TASK_TYPES).map(([value, { label }]) => ({
      value,
      label
    }))
  ];

  const memberOptions = [
    { value: '', label: 'All Assignees' },
    ...members.map((member) => ({
      value: member.user._id,
      label: member.user.fullName
    }))
  ];

  return (
    <div className="task-filters-wrapper bg-white rounded-lg shadow-soft border border-secondary-100 p-4 mb-4">
      <div className="task-filters-row flex flex-wrap items-center gap-4">
        <div className="task-filters-search flex-1 min-w-[200px]">
          <div className="task-filters-search-box relative">
            <HiSearch className="task-filters-search-icon absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />

            <input
              type="text"
              value={filters.search || ''}
              onChange={(event) => onFilterChange('search', event.target.value)}
              placeholder="Search tasks..."
              className="task-filters-search-input w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <Select
          value={filters.status || ''}
          onChange={(event) => onFilterChange('status', event.target.value)}
          options={statusOptions}
          className="task-filters-select task-filters-status w-40"
        />

        <Select
          value={filters.priority || ''}
          onChange={(event) => onFilterChange('priority', event.target.value)}
          options={priorityOptions}
          className="task-filters-select task-filters-priority w-40"
        />

        <Select
          value={filters.type || ''}
          onChange={(event) => onFilterChange('type', event.target.value)}
          options={typeOptions}
          className="task-filters-select task-filters-type w-36"
        />

        <Select
          value={filters.assignee || ''}
          onChange={(event) => onFilterChange('assignee', event.target.value)}
          options={memberOptions}
          className="task-filters-select task-filters-assignee w-44"
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="task-filters-clear-button flex items-center gap-1 px-3 py-2 text-sm text-secondary-600 hover:text-secondary-800 hover:bg-secondary-100 rounded-lg"
          >
            <HiX className="task-filters-clear-icon w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;