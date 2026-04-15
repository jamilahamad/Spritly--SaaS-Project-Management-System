import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import {
  HiBell,
  HiMenuAlt3,
  HiChevronDown,
  HiLogout,
  HiUser,
  HiCog,
  HiOutlineMenuAlt3,
  HiOutlineX
} from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { useOrganization } from '../../hooks/useOrganization';
import { useNotifications } from '../../hooks/useNotifications';
import Avatar from '../common/Avatar';
import Logo from '../../assets/logo.png';
import Dropdown, { DropdownItem, DropdownDivider } from '../common/Dropdown';

const PUBLIC_NAV_LINKS = [
  { name: 'Features', href: '/features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' }
];

const PublicNavbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href) => location.pathname === href;

  return (
    <header
      className={`public-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-xl shadow-sm border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="public-navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="public-navbar-content flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="public-navbar-brand flex items-center">
            <img
              src={Logo}
              alt="Sprintly Logo"
              className="public-navbar-logo h-12 w-auto object-contain"
            />
          </Link>

          <div className="public-navbar-links hidden md:flex items-center gap-8">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`public-navbar-link relative font-medium transition-colors group ${
                  isActive(link.href)
                    ? 'text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {link.name}
                <span
                  className={`public-navbar-link-line absolute left-0 -bottom-1 h-0.5 bg-indigo-600 transition-all duration-300 ${
                    isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="public-navbar-actions hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="public-navbar-signin px-4 py-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="public-navbar-register px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="public-navbar-mobile-toggle md:hidden p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenuAlt3 className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`public-navbar-mobile-menu md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="public-navbar-mobile-panel bg-white/95 backdrop-blur-xl border-t border-slate-200/60 px-4 py-4 space-y-1">
          {PUBLIC_NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`public-navbar-mobile-link block px-4 py-3 rounded-xl font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="public-navbar-mobile-actions pt-4 mt-4 border-t border-slate-200 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="public-navbar-mobile-signin block w-full px-4 py-3 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="public-navbar-mobile-register block w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-2xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardNavbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { organizations, currentOrganization, switchOrganization } = useOrganization();
  const { unreadCount } = useNotifications();

  const hasWorkspace = organizations.length > 0 && !!currentOrganization;
  const brandLink = hasWorkspace ? '/dashboard' : '/create-organization';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="dashboard-navbar sticky top-0 z-40 bg-white border-b border-secondary-200">
      <div className="dashboard-navbar-container px-4 sm:px-6 lg:px-8">
        <div className="dashboard-navbar-content flex items-center justify-between h-16">
          <div className="dashboard-navbar-left flex items-center gap-4">
            <button
              onClick={onToggleSidebar}
              className="dashboard-navbar-sidebar-toggle lg:hidden p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg"
              type="button"
            >
              <HiMenuAlt3 className="w-6 h-6" />
            </button>

            <Link to={brandLink} className="dashboard-navbar-brand flex items-center">
              <img
                src={Logo}
                alt="Sprintly Logo"
                className="dashboard-navbar-logo h-12 w-auto object-contain"
              />
            </Link>

            {hasWorkspace && organizations.length > 1 && (
              <Dropdown
                trigger={
                  <button
                    type="button"
                    className="dashboard-navbar-org-trigger hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary-50 hover:bg-secondary-100 rounded-lg text-sm font-medium text-secondary-700"
                  >
                    <span className="dashboard-navbar-org-name">
                      {currentOrganization?.name || 'Select Organization'}
                    </span>
                    <HiChevronDown className="w-4 h-4" />
                  </button>
                }
                position="bottom-left"
              >
                {organizations.map((org) => (
                  <DropdownItem key={org._id} onClick={() => switchOrganization(org)}>
                    <div className="dashboard-navbar-org-item flex items-center justify-between w-full">
                      <span>{org.name}</span>
                      {org._id === currentOrganization?._id && (
                        <span className="dashboard-navbar-org-active w-2 h-2 bg-primary-600 rounded-full" />
                      )}
                    </div>
                  </DropdownItem>
                ))}
              </Dropdown>
            )}
          </div>

          <div className="dashboard-navbar-right flex items-center gap-2">
            <Link
              to="/notifications"
              className="dashboard-navbar-notification relative p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg"
            >
              <HiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="dashboard-navbar-notification-badge absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <Dropdown
              trigger={
                <button
                  type="button"
                  className="dashboard-navbar-user-trigger flex items-center gap-2 p-1 hover:bg-secondary-100 rounded-lg"
                >
                  <Avatar src={user?.avatar} name={user?.fullName} size="sm" />
                  <span className="dashboard-navbar-user-name hidden sm:block text-sm font-medium text-secondary-700">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <HiChevronDown className="dashboard-navbar-user-icon hidden sm:block w-4 h-4 text-secondary-500" />
                </button>
              }
              position="bottom-right"
            >
              <div className="dashboard-navbar-user-info px-4 py-3 border-b border-secondary-100">
                <p className="dashboard-navbar-fullname text-sm font-medium text-secondary-900">
                  {user?.fullName}
                </p>
                <p className="dashboard-navbar-email text-xs text-secondary-500">
                  {user?.email}
                </p>
              </div>

              <DropdownItem icon={HiUser} onClick={() => navigate('/profile')}>
                Profile
              </DropdownItem>

              {hasWorkspace && (
                <DropdownItem icon={HiCog} onClick={() => navigate('/settings')}>
                  Settings
                </DropdownItem>
              )}

              <DropdownDivider />

              <DropdownItem icon={HiLogout} danger onClick={handleLogout}>
                Log out
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Navbar = ({ variant = 'dashboard', onToggleSidebar }) => {
  if (variant === 'public') {
    return <PublicNavbar />;
  }

  return <DashboardNavbar onToggleSidebar={onToggleSidebar} />;
};

export default Navbar;