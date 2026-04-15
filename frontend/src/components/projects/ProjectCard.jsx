import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineFolder,
  HiOutlineUsers,
  HiOutlineClipboardList
} from 'react-icons/hi';
import './ProjectCard.css';
import { AvatarGroup } from '../common/Avatar';
import Badge from '../common/Badge';
import { PROJECT_STATUS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

const ProjectCard = ({ project }) => {
  const status = PROJECT_STATUS[project.status];

  return (
    <Link
      to={`/projects/${project._id}`}
      className="project-card block bg-white rounded-lg shadow-soft border border-secondary-100 hover:shadow-medium transition-all duration-200"
    >
      <div className="project-card-body p-5">
        <div className="project-card-header flex items-start justify-between mb-3">
          <div className="project-card-header-left flex items-center gap-3">
            <div className="project-card-icon-wrapper w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <HiOutlineFolder className="project-card-icon w-5 h-5 text-primary-600" />
            </div>

            <div className="project-card-title-group">
              <h3 className="project-card-title font-semibold text-secondary-900">
                {project.name}
              </h3>
              <span className="project-card-key text-xs font-mono text-secondary-500">
                {project.key}
              </span>
            </div>
          </div>

          <Badge variant={project.status === 'active' ? 'success' : 'default'}>
            {status?.label}
          </Badge>
        </div>

        {project.description && (
          <p className="project-card-description text-sm text-secondary-600 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        <div className="project-card-stats flex items-center gap-4 text-sm text-secondary-500 mb-4">
          <div className="project-card-stat-item flex items-center gap-1">
            <HiOutlineClipboardList className="project-card-stat-icon w-4 h-4" />
            <span className="project-card-stat-text">{project.taskCount ?? 0} tasks</span>
          </div>

          <div className="project-card-stat-item flex items-center gap-1">
            <HiOutlineUsers className="project-card-stat-icon w-4 h-4" />
            <span className="project-card-stat-text">
              {project.memberCount ?? project.members?.length ?? 0} members
            </span>
          </div>
        </div>

        <div className="project-card-footer flex items-center justify-between pt-4 border-t border-secondary-100">
          <AvatarGroup users={project.members || []} max={4} size="sm" />

          {project.endDate && (
            <span className="project-card-due text-xs text-secondary-500">
              Due: {formatDate(project.endDate)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;