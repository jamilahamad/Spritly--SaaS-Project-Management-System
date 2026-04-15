import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClipboardList } from 'react-icons/hi';
import './MyTasks.css';
import { useAuth } from '../hooks/useAuth';
import { useOrganization } from '../hooks/useOrganization';
import taskService from '../services/taskService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import TaskFilters from '../components/tasks/TaskFilters';
import EmptyState from '../components/common/EmptyState';
import { TASK_PRIORITIES, TASK_TYPES } from '../utils/constants';
import { formatDate } from '../utils/helpers';

const MyTasks = () => {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchTasks = useCallback(async () => {
    if (!currentOrganization || !user) {
      return;
    }

    try {
      setLoading(true);

      const response = await taskService.getTasks({
        organization: currentOrganization._id,
        assignee: user._id,
        ...filters
      });

      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [currentOrganization, user, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const groupedTasks = {
    todo: tasks.filter((task) => task.status === 'todo'),
    in_progress: tasks.filter((task) => task.status === 'in_progress'),
    review: tasks.filter((task) => task.status === 'review'),
    done: tasks.filter((task) => task.status === 'done')
  };

  if (loading) {
    return <Loader text="Loading your tasks..." />;
  }

  return (
    <div className="my-tasks-page space-y-6">
      <div className="my-tasks-header">
        <h1 className="my-tasks-title text-2xl font-bold text-secondary-900">
          My Tasks
        </h1>

        <p className="my-tasks-subtitle text-secondary-500 mt-1">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you
        </p>
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {tasks.length > 0 ? (
        <div className="my-tasks-groups space-y-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => {
            if (statusTasks.length === 0) {
              return null;
            }

            return (
              <div key={status} className="my-tasks-group">
                <h2 className="my-tasks-group-title text-lg font-semibold text-secondary-900 mb-3 capitalize">
                  {status.replace('_', ' ')} ({statusTasks.length})
                </h2>

                <div className="my-tasks-group-card bg-white rounded-lg shadow-soft border border-secondary-100 overflow-hidden">
                  {statusTasks.map((task) => {
                    const priority = TASK_PRIORITIES[task.priority];
                    const type = TASK_TYPES[task.type];
                    const isOverdue =
                      task.dueDate &&
                      new Date(task.dueDate) < new Date() &&
                      task.status !== 'done';

                    return (
                      <Link
                        key={task._id}
                        to={`/tasks/${task._id}`}
                        className="my-tasks-item flex items-center gap-4 p-4 border-b border-secondary-100 last:border-0 hover:bg-secondary-50 transition-colors"
                      >
                        <span className="my-tasks-item-type text-lg">{type?.icon}</span>

                        <div className="my-tasks-item-content flex-1 min-w-0">
                          <div className="my-tasks-item-title-row flex items-center gap-2">
                            <span className="my-tasks-item-key text-xs font-mono text-secondary-500">
                              {task.key}
                            </span>

                            <span className="my-tasks-item-title text-sm font-medium text-secondary-900 truncate">
                              {task.title}
                            </span>
                          </div>

                          <div className="my-tasks-item-meta flex items-center gap-2 mt-1">
                            <span className="my-tasks-item-project text-xs text-secondary-500">
                              {task.project?.name}
                            </span>

                            {task.dueDate && (
                              <span
                                className={`my-tasks-item-due text-xs ${
                                  isOverdue ? 'text-red-500' : 'text-secondary-500'
                                }`}
                              >
                                Due {formatDate(task.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Badge size="sm" className={priority?.color}>
                          {priority?.label}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={HiOutlineClipboardList}
          title="No tasks assigned"
          description="You don't have any tasks assigned to you yet"
        />
      )}
    </div>
  );
};

export default MyTasks;