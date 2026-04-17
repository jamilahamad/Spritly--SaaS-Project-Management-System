import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, AuthContext } from './context/AuthContext';
import { OrganizationProvider, OrganizationContext } from './context/OrganizationContext';
import { NotificationProvider } from './context/NotificationContext';

import ErrorBoundary from './components/common/ErrorBoundary';
import DashboardLayout from './components/layout/DashboardLayout';
import Loader from './components/common/Loader';

import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CheckEmail from './pages/CheckEmail';
import VerifyEmail from './pages/VerifyEmail';
import AcceptInvitation from './pages/AcceptInvitation';
import NotFound from './pages/NotFound';

import CreateOrganization from './pages/CreateOrganization';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import TaskDetails from './pages/TaskDetails';
import MyTasks from './pages/MyTasks';
import Team from './pages/Team';
import Profile from './pages/Profile';
import OrganizationSettings from './pages/OrganizationSettings';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useContext(AuthContext);

//   if (loading) {
//     return <Loader text="Checking authentication..." />;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

const AuthOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const WorkspaceRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const {
    currentOrganization,
    organizations,
    loading: orgLoading,
    initialized
  } = useContext(OrganizationContext);

  if (authLoading) {
    return <Loader text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!initialized || orgLoading) {
    return <Loader text="Loading workspace..." />;
  }

  if (!organizations.length || !currentOrganization) {
    return <Navigate to="/create-organization" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const {
    currentOrganization,
    organizations,
    loading: orgLoading,
    initialized
  } = useContext(OrganizationContext);

  if (authLoading) {
    return <Loader text="Loading..." />;
  }

  if (!isAuthenticated) {
    return children;
  }

  if (!initialized || orgLoading) {
    return <Loader text="Loading workspace..." />;
  }

  if (organizations.length > 0 && currentOrganization) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/create-organization" replace />;
};

const AppRoutes = () => {
  return (
    <div className="app-routes-wrapper">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/accept-invite/:token" element={<AcceptInvitation />} />

        <Route
          element={
            <AuthOnlyRoute>
              <DashboardLayout />
            </AuthOnlyRoute>
          }
        >
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        <Route
          element={
            <WorkspaceRoute>
              <DashboardLayout />
            </WorkspaceRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/new" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/:id/settings" element={<ProjectDetails />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/team" element={<Team />} />
          <Route path="/settings" element={<OrganizationSettings />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <div className="app-shell">
        <Router>
          <AuthProvider>
            <OrganizationProvider>
              <NotificationProvider>
                <AppRoutes />
                <ToastContainer position="top-right" autoClose={3000} />
              </NotificationProvider>
            </OrganizationProvider>
          </AuthProvider>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;