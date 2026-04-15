import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import Logo from '../../assets/logo.png';
import './Footer.css';

const Footer = ({ variant = 'default' }) => {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className="footer-minimal bg-white border-t border-secondary-200 py-4 px-6">
        <div className="footer-minimal-container flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="footer-minimal-copy text-sm text-secondary-500">
            &copy; {currentYear} Sprintly. Student project.
          </p>

          <div className="footer-minimal-links flex items-center gap-4">
            <a
              href="/help"
              className="footer-minimal-link text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              Help
            </a>

            <a
              href="/privacy"
              className="footer-minimal-link text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              Privacy
            </a>

            <a
              href="/terms"
              className="footer-minimal-link text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer-main bg-secondary-900 text-white">
      <div className="footer-main-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="footer-main-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="footer-brand">
            <Link to="/" className="footer-brand-link flex items-center gap-2 mb-4">
              <img
                src={Logo}
                alt="Sprintly logo"
                className="footer-brand-logo h-16 w-auto object-contain"
              />
            </Link>

            <p className="footer-brand-description text-secondary-400 text-sm max-w-xs">
              We are here to replace JIRA.
            </p>
          </div>

          <div className="footer-links-section">
            <h4 className="footer-section-title text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>

            <ul className="footer-links-list space-y-3">
              <li className="footer-links-item">
                <Link
                  to="/"
                  className="footer-link text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>

              <li className="footer-links-item">
                <Link
                  to="/features"
                  className="footer-link text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  Features
                </Link>
              </li>

              <li className="footer-links-item">
                <Link
                  to="/about"
                  className="footer-link text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>

              <li className="footer-links-item">
                <Link
                  to="/login"
                  className="footer-link text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  Login
                </Link>
              </li>

              <li className="footer-links-item">
                <Link
                  to="/register"
                  className="footer-link text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-support-section">
            <h4 className="footer-section-title text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Support
            </h4>

            <ul className="footer-support-list space-y-3">
              <li className="footer-support-item">
                <a
                  href="/help"
                  className="footer-support-link flex items-center gap-2 text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  <HiOutlineQuestionMarkCircle className="footer-support-icon w-4 h-4" />
                  Help
                </a>
              </li>

              <li className="footer-support-item">
                <a
                  href="mailto:techsolution.chatgpt@gmail.com"
                  className="footer-support-link flex items-center gap-2 text-secondary-400 hover:text-white transition-colors text-sm"
                >
                  <HiOutlineMail className="footer-support-icon w-4 h-4" />
                  Email
                </a>
              </li>

              <li className="footer-support-item">
                <Link
                  to="/privacy"
                  className="footer-support-link text-secondary-400 hover:text-white transition-colors text-sm block"
                >
                  Privacy
                </Link>
              </li>

              <li className="footer-support-item">
                <Link
                  to="/terms"
                  className="footer-support-link text-secondary-400 hover:text-white transition-colors text-sm block"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom border-t border-secondary-800">
        <div className="footer-bottom-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="footer-bottom-content flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="footer-bottom-copy text-secondary-400 text-sm">
              &copy; {currentYear} Sprintly. Student project.
            </p>

            <div className="footer-bottom-links flex items-center gap-6">
              <Link
                to="/privacy"
                className="footer-bottom-link text-secondary-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="footer-bottom-link text-secondary-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;