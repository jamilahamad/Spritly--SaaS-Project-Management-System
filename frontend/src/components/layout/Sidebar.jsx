import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiHome,
  HiFolder,
  HiClipboardList,
  HiUserGroup,
  HiChartBar,
  HiCog,
  HiPlus,
  HiX,
  HiOfficeBuilding,
  HiBell,
  HiUser
} from 'react-icons/hi';
import './Sidebar.css';
import { useOrganization } from '../../hooks/useOrganization';
import { hasPermission, canManageProjects } from '../../utils/helpers';
import Button from '../common/Button';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { currentOrganization, organizations } = useOrganization();

  const hasWorkspace = organizations.length > 0 && !!currentOrganization;
  const userRole = currentOrganization?.userRole || 'member';
  const canCreateProject = hasWorkspace && canManageProjects(userRole);

  const mainNavItems = hasWorkspace
    ? [
        { icon: HiHome, label: 'Dashboard', path: '/dashboard' },
        { icon: HiFolder, label: 'Projects', path: '/projects' },
        { icon: HiClipboardList, label: 'My Tasks', path: '/my-tasks' }
      ]
    : [
        { icon: HiOfficeBuilding, label: 'Create Workspace', path: '/create-organization' },
        { icon: HiBell, label: 'Notifications', path: '/notifications' },
        { icon: HiUser, label: 'Profile', path: '/profile' }
      ];

  const managementNavItems = hasWorkspace
    ? [
        {
          icon: HiUserGroup,
          label: 'Team',
          path: '/team',
          roles: ['owner', 'admin', 'project_manager']
        },
        {
          icon: HiChartBar,
          label: 'Reports',
          path: '/reports',
          roles: ['owner', 'admin', 'project_manager']
        },
        {
          icon: HiCog,
          label: 'Settings',
          path: '/settings',
          roles: ['owner', 'admin']
        }
      ]
    : [];

  const NavItem = ({ icon: Icon, label, path }) => {
    return (
      <NavLink
        to={path}
        onClick={onClose}
        className={({ isActive }) =>
          `sidebar-nav-item flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
            isActive
              ? 'bg-primary-50 text-primary-700'
              : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
          }`
        }
      >
        <Icon className="sidebar-nav-icon w-5 h-5" />
        <span className="sidebar-nav-label">{label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`sidebar-wrapper fixed lg:sticky top-0 lg:top-16 left-0 z-50 lg:z-0 w-64 h-screen lg:h-[calc(100vh-4rem)] bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="sidebar-content flex flex-col h-full">
          <div className="sidebar-mobile-header flex items-center justify-between p-4 lg:hidden border-b border-secondary-200">
            <span className="sidebar-mobile-title text-lg font-bold text-secondary-900">
              Menu
            </span>

            <button
              onClick={onClose}
              className="sidebar-close-button p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg"
              type="button"
            >
              <HiX className="sidebar-close-icon w-5 h-5" />
            </button>
          </div>

          <nav className="sidebar-nav flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {canCreateProject && (
              <div className="sidebar-create-project mb-4 px-1">
                <Button
                  onClick={() => navigate('/projects/new')}
                  className="sidebar-create-project-button w-full"
                  icon={HiPlus}
                >
                  New Project
                </Button>
              </div>
            )}

            <div className="sidebar-main-links space-y-1">
              {mainNavItems.map((item) => (
                <NavItem key={item.path} {...item} />
              ))}
            </div>

            {hasWorkspace &&
              managementNavItems.some(
                (item) => !item.roles || hasPermission(userRole, item.roles)
              ) && (
                <div className="sidebar-management-section mt-6 pt-6 border-t border-secondary-100">
                  <p className="sidebar-management-title px-4 mb-2 text-xs font-semibold text-secondary-400 uppercase tracking-wider">
                    Management
                  </p>

                  <div className="sidebar-management-links space-y-1">
                    {managementNavItems.map((item) => {
                      if (item.roles && !hasPermission(userRole, item.roles)) {
                        return null;
                      }

                      return <NavItem key={item.path} {...item} />;
                    })}
                  </div>
                </div>
              )}
          </nav>

          {hasWorkspace && currentOrganization && (
            <div className="sidebar-organization-footer p-4 border-t border-secondary-200">
              <div className="sidebar-organization-box flex items-center gap-3">
                <div className="sidebar-organization-avatar w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="sidebar-organization-initial text-primary-700 font-bold">
                    {currentOrganization.name.charAt(0)}
                  </span>
                </div>

                <div className="sidebar-organization-info flex-1 min-w-0">
                  <p className="sidebar-organization-name text-sm font-medium text-secondary-900 truncate">
                    {currentOrganization.name}
                  </p>
                  <p className="sidebar-organization-role text-xs text-secondary-500 capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;