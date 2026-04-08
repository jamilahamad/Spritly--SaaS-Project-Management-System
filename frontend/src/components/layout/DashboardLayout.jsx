import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import './DashboardLayout.css';
import { useAuth } from '../../hooks/useAuth';
import { useOrganization } from '../../hooks/useOrganization';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Loader from '../common/Loader';

const DashboardLayout = () => {
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    currentOrganization,
    organizations,
    loading: orgLoading,
    initialized
  } = useOrganization();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const noWorkspaceAllowedPaths = ['/create-organization', '/notifications', '/profile'];

  const isNoWorkspaceAllowedPath = noWorkspaceAllowedPaths.includes(location.pathname);

  const handleSidebarToggle = () => {
    setSidebarOpen((prevSidebarOpen) => !prevSidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  if (authLoading) {
    return <Loader fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!initialized || orgLoading) {
    return <Loader fullScreen text="Loading workspace..." />;
  }

  if (organizations.length === 0 && !isNoWorkspaceAllowedPath) {
    return <Navigate to="/create-organization" replace />;
  }

  if (
    organizations.length > 0 &&
    currentOrganization &&
    location.pathname === '/create-organization'
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  if (organizations.length > 0 && !currentOrganization) {
    return <Loader fullScreen text="Loading workspace..." />;
  }

  return (
    <div className="dashboard-layout min-h-screen bg-secondary-50">
      <Navbar onToggleSidebar={handleSidebarToggle} />

      <div className="dashboard-layout-body flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

        <main className="dashboard-layout-main flex-1 min-w-0 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;