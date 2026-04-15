import React from 'react';
import {
  HiOutlineCalendar,
  HiOutlineChatAlt,
  HiOutlinePaperClip
} from 'react-icons/hi';
import './TaskCard.css';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { TASK_PRIORITIES, TASK_TYPES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const TaskCard = ({ task, onClick }) => {
  const priority = TASK_PRIORITIES[task.priority];
  const type = TASK_TYPES[task.type];

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const completedSubtasks = task.subtasks?.filter((subtask) => subtask.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      onClick={onClick}
      className="task-card bg-white rounded-lg p-3 shadow-sm border border-secondary-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="task-card-header flex items-center gap-2 mb-2">
        <span className="task-card-type-icon text-sm">{type?.icon}</span>

        <span className="task-card-key text-xs font-mono text-secondary-500">
          {task.key}
        </span>

        <span
          className={`task-card-priority-icon ml-auto ${priority?.color} px-1.5 py-0.5 rounded text-xs`}
        >
          {priority?.icon}
        </span>
      </div>

      <h4 className="task-card-title text-sm font-medium text-secondary-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.labels?.length > 0 && (
        <div className="task-card-labels flex flex-wrap gap-1 mb-2">
          {task.labels.slice(0, 2).map((label, index) => (
            <Badge key={index} size="sm" variant="default">
              {label}
            </Badge>
          ))}

          {task.labels.length > 2 && (
            <Badge size="sm" variant="default">
              +{task.labels.length - 2}
            </Badge>
          )}
        </div>
      )}

      <div className="task-card-footer flex items-center justify-between mt-3 pt-2 border-t border-secondary-50">
        <div className="task-card-meta flex items-center gap-3 text-secondary-500">
          {task.dueDate && (
            <div
              className={`task-card-due flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-500' : ''
              }`}
            >
              <HiOutlineCalendar className="task-card-meta-icon w-3.5 h-3.5" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}

          {task.commentsCount > 0 && (
            <div className="task-card-comments flex items-center gap-1 text-xs">
              <HiOutlineChatAlt className="task-card-meta-icon w-3.5 h-3.5" />
              <span>{task.commentsCount}</span>
            </div>
          )}

          {task.attachments?.length > 0 && (
            <div className="task-card-attachments flex items-center gap-1 text-xs">
              <HiOutlinePaperClip className="task-card-meta-icon w-3.5 h-3.5" />
              <span>{task.attachments.length}</span>
            </div>
          )}
        </div>

        {task.assignee && (
          <Avatar
            src={task.assignee.avatar}
            name={task.assignee.fullName}
            size="xs"
          />
        )}
      </div>

      {task.subtasks?.length > 0 && (
        <div className="task-card-subtasks mt-2">
          <div className="task-card-subtasks-row flex items-center gap-2 text-xs text-secondary-500">
            <div className="task-card-subtasks-track flex-1 bg-secondary-200 rounded-full h-1.5">
              <div
                className="task-card-subtasks-fill bg-primary-500 h-1.5 rounded-full transition-all"
                style={{
                  width: `${(completedSubtasks / totalSubtasks) * 100}%`
                }}
              />
            </div>

            <span className="task-card-subtasks-count">
              {completedSubtasks}/{totalSubtasks}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;