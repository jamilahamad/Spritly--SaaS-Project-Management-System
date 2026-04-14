import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import {
  HiOutlineCog,
  HiOutlineUserAdd,
  HiOutlinePlus,
  HiOutlineViewBoards,
  HiOutlineViewList,
  HiOutlineDotsVertical,
  HiOutlineArchive,
  HiOutlineTrash,
  HiOutlineUserGroup,
  HiOutlineX,
  HiOutlineCheck,
  HiOutlineSearch,
  HiStar
} from 'react-icons/hi';
import './ProjectDetails.css';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import Avatar, { AvatarGroup } from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Dropdown, { DropdownItem, DropdownDivider } from '../components/common/Dropdown';
import KanbanBoard from '../components/tasks/KanbanBoard';
import TaskModal from '../components/tasks/TaskModal';
import TaskFilters from '../components/tasks/TaskFilters';
import { PROJECT_STATUS } from '../utils/constants';
import {
  canManageProjects,
  canDeleteProjects,
  canManageProjectMembers,
  canCreateTasks
} from '../utils/helpers';
import { toast } from 'react-toastify';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { members: organizationMembers, currentOrganization } = useOrganization();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('kanban');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filters, setFilters] = useState({});
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [memberActionLoading, setMemberActionLoading] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [availableSearch, setAvailableSearch] = useState('');

  const userRole = currentOrganization?.userRole || 'member';
  const canEditProject = canManageProjects(userRole);
  const canRemoveProject = canDeleteProjects(userRole);
  const canManageMembers = canManageProjectMembers(userRole);
  const canAddTask = canCreateTasks(userRole);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [projectResponse, tasksResponse] = await Promise.all([
        projectService.getProject(id),
        taskService.getTasks({ project: id })
      ]);

      setProject(projectResponse.data);
      setTasks(tasksResponse.data || []);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (taskId, newStatus) => {
    if (!canAddTask) {
      toast.error('You do not have permission to update task status');
      return;
    }

    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (error) {
      toast.error('Failed to update task status');
      fetchData();
    }
  };

  const handleTaskClick = (task) => {
    navigate(`/tasks/${task._id}`);
  };

  const handleCreateTask = async (taskData) => {
    if (!canAddTask) {
      toast.error('You do not have permission to create tasks');
      return;
    }

    try {
      setCreating(true);

      const response = await taskService.createTask(taskData);

      if (response?.data) {
        setTasks((prevTasks) => [...prevTasks, response.data]);
        setShowTaskModal(false);
        toast.success('Task created successfully');
      } else {
        toast.error('Task created response was invalid');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();

      if (
        !task.title?.toLowerCase().includes(searchLower) &&
        !task.key?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.type && task.type !== filters.type) return false;
    if (filters.assignee && task.assignee?._id !== filters.assignee) return false;

    return true;
  });

  const handleArchiveProject = async () => {
    if (!canEditProject) {
      toast.error('You do not have permission to archive this project');
      return;
    }

    try {
      await projectService.updateProject(id, { status: 'archived' });
      toast.success('Project archived successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to archive project');
    }
  };

  const handleDeleteProject = async () => {
    if (!canRemoveProject) {
      toast.error('You do not have permission to delete this project');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this project?');

    if (!confirmed) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const projectMemberIds = useMemo(() => {
    return new Set((project?.members || []).map((member) => member._id));
  }, [project]);

  const availableMembers = useMemo(() => {
    return (organizationMembers || []).filter(
      (member) => member?.user?._id && !projectMemberIds.has(member.user._id)
    );
  }, [organizationMembers, projectMemberIds]);

  const searchedProjectMembers = useMemo(() => {
    const query = memberSearch.trim().toLowerCase();

    if (!query) {
      return project?.members || [];
    }

    return (project?.members || []).filter((member) => {
      return (
        member.fullName?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      );
    });
  }, [project, memberSearch]);

  const searchedAvailableMembers = useMemo(() => {
    const query = availableSearch.trim().toLowerCase();

    if (!query) {
      return availableMembers;
    }

    return availableMembers.filter((member) => {
      return (
        member.user?.fullName?.toLowerCase().includes(query) ||
        member.user?.email?.toLowerCase().includes(query)
      );
    });
  }, [availableMembers, availableSearch]);

  const handleAddProjectMember = async (userId) => {
    if (!canManageMembers) {
      toast.error('You do not have permission to manage project members');
      return;
    }

    try {
      setMemberActionLoading(`add-${userId}`);
      const response = await projectService.addMember(id, userId);
      setProject(response.data);
      toast.success('Member added to project');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setMemberActionLoading('');
    }
  };

  const handleRemoveProjectMember = async (userId) => {
    if (!canManageMembers) {
      toast.error('You do not have permission to manage project members');
      return;
    }

    if (project?.lead?._id === userId) {
      toast.error('Change the project lead before removing this member');
      return;
    }

    const confirmed = window.confirm('Remove this member from the project?');

    if (!confirmed) {
      return;
    }

    try {
      setMemberActionLoading(`remove-${userId}`);
      const response = await projectService.removeMember(id, userId);
      setProject(response.data);
      toast.success('Member removed from project');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    } finally {
      setMemberActionLoading('');
    }
  };

  const handleSetLead = async (userId) => {
    if (!canManageMembers) {
      toast.error('You do not have permission to manage project members');
      return;
    }

    try {
      setMemberActionLoading(`lead-${userId}`);

      const memberIds = (project?.members || []).map((member) => member._id);
      const safeMembers = memberIds.includes(userId) ? memberIds : [...memberIds, userId];

      const response = await projectService.updateProject(id, {
        lead: userId,
        members: safeMembers
      });

      setProject(response.data);
      toast.success('Project lead updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update project lead');
    } finally {
      setMemberActionLoading('');
    }
  };

  if (loading || !project) {
    return <Loader text="Loading project..." />;
  }

  return (
    <div className="project-details-page space-y-6">
      <div className="project-details-header-card bg-white rounded-xl shadow-soft border border-secondary-100 p-6">
        <div className="project-details-header flex items-start justify-between gap-4">
          <div className="project-details-header-left flex items-start gap-4">
            <div className="project-details-avatar w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
              <span className="project-details-avatar-letter text-primary-700 font-bold text-2xl">
                {project.name?.charAt(0)}
              </span>
            </div>

            <div className="project-details-info">
              <div className="project-details-title-row flex items-center gap-3">
                <h1 className="project-details-title text-2xl font-bold text-secondary-900">
                  {project.name}
                </h1>

                <Badge variant={project.status === 'active' ? 'success' : 'default'}>
                  {PROJECT_STATUS[project.status]?.label}
                </Badge>
              </div>

              <p className="project-details-description text-secondary-500 mt-1">
                {project.description || 'No description'}
              </p>

              <div className="project-details-meta flex items-center gap-4 mt-3 flex-wrap">
                <span className="project-details-meta-item text-sm text-secondary-600">
                  <strong>Key:</strong> {project.key}
                </span>
                <span className="project-details-meta-item text-sm text-secondary-600">
                  <strong>Lead:</strong> {project.lead?.fullName || 'Unassigned'}
                </span>
                <span className="project-details-meta-item text-sm text-secondary-600">
                  <strong>Tasks:</strong> {tasks.length}
                </span>
                <span className="project-details-meta-item text-sm text-secondary-600">
                  <strong>Members:</strong> {project.members?.length || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="project-details-header-actions flex items-center gap-3">
            <div className="project-details-members-summary flex items-center gap-2 px-3 py-2 border border-secondary-200 rounded-lg bg-secondary-50">
              <AvatarGroup users={project.members || []} max={4} />

              <button
                type="button"
                onClick={() => setShowMembersModal(true)}
                className="project-details-members-button inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50"
              >
                <HiOutlineUserAdd className="project-details-members-button-icon w-5 h-5" />
                <span>{project.members?.length || 0} Members</span>
              </button>
            </div>

            <div className="project-details-view-toggle flex items-center border border-secondary-200 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`project-details-view-button p-2 ${
                  viewMode === 'kanban'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-secondary-500'
                }`}
              >
                <HiOutlineViewBoards className="project-details-view-icon w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`project-details-view-button p-2 ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-secondary-500'
                }`}
              >
                <HiOutlineViewList className="project-details-view-icon w-5 h-5" />
              </button>
            </div>

            {canAddTask && (
              <Button
                onClick={() => setShowTaskModal(true)}
                icon={HiOutlinePlus}
                className="project-details-create-task-button"
              >
                New Task
              </Button>
            )}

            <Dropdown
              trigger={
                <button
                  type="button"
                  className="project-details-more-button p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 rounded-lg"
                >
                  <HiOutlineDotsVertical className="project-details-more-icon w-5 h-5" />
                </button>
              }
              position="bottom-right"
            >
              {[
                canEditProject && (
                  <DropdownItem
                    key="settings"
                    icon={HiOutlineCog}
                    onClick={() => navigate(`/projects/${id}/settings`)}
                  >
                    Project Settings
                  </DropdownItem>
                ),
                canEditProject && <DropdownDivider key="divider" />,
                canEditProject && (
                  <DropdownItem
                    key="archive"
                    icon={HiOutlineArchive}
                    onClick={handleArchiveProject}
                  >
                    Archive Project
                  </DropdownItem>
                ),
                canRemoveProject && (
                  <DropdownItem
                    key="delete"
                    icon={HiOutlineTrash}
                    danger
                    onClick={handleDeleteProject}
                  >
                    Delete Project
                  </DropdownItem>
                )
              ].filter(Boolean)}
            </Dropdown>
          </div>
        </div>
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={handleTaskClick}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="project-details-task-list-card bg-white rounded-xl shadow-soft border border-secondary-100 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="project-details-empty-list p-10 text-center text-secondary-500">
              No tasks found
            </div>
          ) : (
            <div className="project-details-task-list divide-y divide-secondary-100">
              {filteredTasks.map((task) => (
                <button
                  key={task._id}
                  type="button"
                  onClick={() => handleTaskClick(task)}
                  className="project-details-task-row w-full text-left p-4 hover:bg-secondary-50 transition-colors"
                >
                  <div className="project-details-task-row-content flex items-center justify-between gap-4">
                    <div className="project-details-task-main">
                      <p className="project-details-task-title font-medium text-secondary-900">
                        {task.title}
                      </p>
                      <p className="project-details-task-key text-sm text-secondary-500 mt-1">
                        {task.key}
                      </p>
                    </div>

                    <Badge variant="default">{task.status}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {canAddTask && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => setShowTaskModal(false)}
          onSubmit={handleCreateTask}
          loading={creating}
          projectId={project?._id}
        />
      )}

      <Modal
        isOpen={showMembersModal}
        onClose={() => setShowMembersModal(false)}
        title="Manage Project Members"
        size="lg"
      >
        <div className="project-details-members-modal space-y-6">
          <div className="project-details-members-modal-header flex items-center justify-between gap-3 flex-wrap">
            <div className="project-details-members-modal-text">
              <p className="project-details-members-modal-description text-sm text-secondary-500">
                View current members, add organization members, and update the project lead.
              </p>
            </div>

            <div className="project-details-members-role text-sm text-secondary-600">
              Role:{' '}
              <span className="project-details-members-role-value font-semibold capitalize">
                {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="project-details-current-members-section">
            <div className="project-details-section-header flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="project-details-section-title-row flex items-center gap-2">
                <HiOutlineUserGroup className="project-details-section-icon w-5 h-5 text-primary-600" />
                <h3 className="project-details-section-title text-base font-semibold text-secondary-900">
                  Current Project Members ({project.members?.length || 0})
                </h3>
              </div>

              <div className="project-details-search-wrapper relative w-full sm:w-72">
                <HiOutlineSearch className="project-details-search-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(event) => setMemberSearch(event.target.value)}
                  placeholder="Search current members..."
                  className="project-details-search-input w-full pl-9 pr-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="project-details-members-list space-y-3">
              {searchedProjectMembers.length === 0 ? (
                <div className="project-details-empty-members p-4 text-sm text-secondary-500 bg-secondary-50 rounded-lg">
                  No matching project members found.
                </div>
              ) : (
                searchedProjectMembers.map((member) => {
                  const isLead = project.lead?._id === member._id;

                  return (
                    <div
                      key={member._id}
                      className="project-details-member-row flex items-center justify-between p-3 border border-secondary-200 rounded-lg"
                    >
                      <div className="project-details-member-info flex items-center gap-3">
                        <Avatar src={member.avatar} name={member.fullName} size="sm" />
                        <div className="project-details-member-text">
                          <p className="project-details-member-name text-sm font-medium text-secondary-900">
                            {member.fullName}
                          </p>
                          <p className="project-details-member-email text-xs text-secondary-500">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <div className="project-details-member-actions flex items-center gap-2 flex-wrap">
                        {isLead && (
                          <span className="project-details-lead-badge inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                            <HiStar className="project-details-lead-icon w-3 h-3" />
                            Lead
                          </span>
                        )}

                        {canManageMembers && !isLead && (
                          <button
                            type="button"
                            onClick={() => handleSetLead(member._id)}
                            disabled={memberActionLoading === `lead-${member._id}`}
                            className="project-details-set-lead-button inline-flex items-center gap-1 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-lg disabled:opacity-60"
                          >
                            <HiStar className="project-details-set-lead-icon w-4 h-4" />
                            Set Lead
                          </button>
                        )}

                        {canManageMembers && !isLead && (
                          <button
                            type="button"
                            onClick={() => handleRemoveProjectMember(member._id)}
                            disabled={memberActionLoading === `remove-${member._id}`}
                            className="project-details-remove-member-button inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-60"
                          >
                            <HiOutlineX className="project-details-remove-member-icon w-4 h-4" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="project-details-available-members-section">
            <div className="project-details-section-header flex items-center justify-between gap-3 mb-3 flex-wrap">
              <h3 className="project-details-section-title text-base font-semibold text-secondary-900">
                Available Organization Members ({searchedAvailableMembers.length})
              </h3>

              <div className="project-details-search-wrapper relative w-full sm:w-72">
                <HiOutlineSearch className="project-details-search-icon absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  value={availableSearch}
                  onChange={(event) => setAvailableSearch(event.target.value)}
                  placeholder="Search available members..."
                  className="project-details-search-input w-full pl-9 pr-3 py-2 border border-secondary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {searchedAvailableMembers.length === 0 ? (
              <div className="project-details-empty-members p-4 text-sm text-secondary-500 bg-secondary-50 rounded-lg">
                No available organization members found.
              </div>
            ) : (
              <div className="project-details-members-list space-y-3">
                {searchedAvailableMembers.map((member) => (
                  <div
                    key={member._id}
                    className="project-details-member-row flex items-center justify-between p-3 border border-secondary-200 rounded-lg"
                  >
                    <div className="project-details-member-info flex items-center gap-3">
                      <Avatar
                        src={member.user?.avatar}
                        name={member.user?.fullName}
                        size="sm"
                      />
                      <div className="project-details-member-text">
                        <p className="project-details-member-name text-sm font-medium text-secondary-900">
                          {member.user?.fullName}
                        </p>
                        <p className="project-details-member-email text-xs text-secondary-500">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>

                    {canManageMembers ? (
                      <button
                        type="button"
                        onClick={() => handleAddProjectMember(member.user._id)}
                        disabled={memberActionLoading === `add-${member.user._id}`}
                        className="project-details-add-member-button inline-flex items-center gap-1 px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-60"
                      >
                        <HiOutlineCheck className="project-details-add-member-icon w-4 h-4" />
                        Add
                      </button>
                    ) : (
                      <span className="project-details-view-only text-xs text-secondary-400">
                        View only
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;