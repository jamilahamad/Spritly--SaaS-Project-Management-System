import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineArrowLeft,
  HiOutlineSearch
} from 'react-icons/hi';
import './NotFound.css';
import Button from '../components/common/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page min-h-screen bg-secondary-50 flex items-center justify-center px-4">
      <div className="not-found-container max-w-lg w-full text-center">
        <div className="not-found-illustration mb-8">
          <div className="not-found-illustration-wrapper relative inline-block">
            <span className="not-found-code text-[150px] font-bold text-secondary-200 leading-none">
              404
            </span>

            <div className="not-found-icon-overlay absolute inset-0 flex items-center justify-center">
              <div className="not-found-icon-wrapper w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <HiOutlineSearch className="not-found-icon w-10 h-10 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="not-found-title text-3xl font-bold text-secondary-900 mb-4">
          Page Not Found
        </h1>

        <p className="not-found-description text-secondary-500 mb-8 max-w-md mx-auto">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="not-found-actions flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="secondary"
            icon={HiOutlineArrowLeft}
            className="not-found-back-button"
          >
            Go Back
          </Button>

          <Link to="/dashboard" className="not-found-dashboard-link">
            <Button icon={HiOutlineHome} className="not-found-dashboard-button">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="not-found-help-section mt-12 pt-8 border-t border-secondary-200">
          <p className="not-found-help-text text-sm text-secondary-500 mb-4">
            Need help? Try these links:
          </p>

          <div className="not-found-help-links flex items-center justify-center gap-6">
            <Link
              to="/projects"
              className="not-found-help-link text-sm text-primary-600 hover:text-primary-700"
            >
              Projects
            </Link>

            <Link
              to="/my-tasks"
              className="not-found-help-link text-sm text-primary-600 hover:text-primary-700"
            >
              My Tasks
            </Link>

            <Link
              to="/team"
              className="not-found-help-link text-sm text-primary-600 hover:text-primary-700"
            >
              Team
            </Link>

            <a
              href="mailto:support@sprintly.com"
              className="not-found-help-link text-sm text-primary-600 hover:text-primary-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;