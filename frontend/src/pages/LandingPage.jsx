import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import PublicCTA from '../components/common/PublicCTA';
import LandingHeroDashboard from '../assets/landing-hero-dashboard.png';
import LandingKanbanPreview from '../assets/landing-kanban-preview.png';
import LandingCollaborationPreview from '../assets/landing-collaboration-preview.png';
import LandingAnalyticsPreview from '../assets/landing-analytics-preview.png';
import './LandingPage.css';
import {
  HiOutlineViewBoards,
  HiOutlineUserGroup,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineStar
} from 'react-icons/hi';

const features = [
  {
    icon: HiOutlineViewBoards,
    title: 'Kanban Boards',
    description:
      'Visualize your workflow with intuitive drag-and-drop boards that adapt to your process.',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Team Collaboration',
    description:
      'Work together seamlessly with real-time updates, comments, and @mentions.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    icon: HiOutlineBell,
    title: 'Smart Notifications',
    description:
      'Stay informed with intelligent alerts that keep you in the loop without the noise.',
    color: 'bg-violet-50 text-violet-600'
  }
];

const featureHighlights = [
  {
    badge: 'Project Management',
    title: 'Organize work your way with powerful Kanban boards',
    description:
      "Create custom workflows that match your team's unique process. Drag and drop tasks, set priorities, add due dates, and track progress in real-time.",
    features: [
      'Unlimited custom columns and swimlanes',
      'Drag-and-drop task management',
      'Task dependencies and blockers',
      'Due dates with smart reminders',
      'File attachments and comments'
    ],
    imageType: 'kanban'
  },
  {
    badge: 'Team Collaboration',
    title: 'Bring your entire team together in one place',
    description:
      'Enable seamless communication with built-in messaging, threaded comments, and @mentions. Keep all discussions in context.',
    features: [
      'Real-time collaboration',
      'Threaded comments on tasks',
      '@mentions and notifications',
      'Team activity feeds',
      'Shared team workspaces'
    ],
    imageType: 'collaboration'
  },
  {
    badge: 'Analytics & Insights',
    title: 'Make smarter decisions with actionable data',
    description:
      "Understand your team's performance with beautiful dashboards. Track velocity, identify bottlenecks, and optimize your workflow.",
    features: [
      'Customizable dashboards',
      'Burndown and velocity charts',
      'Team performance metrics',
      'Time tracking reports',
      'Export to CSV and PDF'
    ],
    imageType: 'analytics'
  }
];

const testimonials = [
  {
    quote:
      "Sprintly transformed how our engineering team operates. We've seen a 40% increase in productivity since switching.",
    author: 'Sarah Chen',
    role: 'VP of Engineering',
    company: 'TechCorp',
    initials: 'SC'
  },
  {
    quote:
      "The best project management tool we've ever used. Simple enough to start immediately, powerful enough to scale.",
    author: 'Michael Roberts',
    role: 'Product Manager',
    company: 'StartupXYZ',
    initials: 'MR'
  },
  {
    quote:
      'Finally, a tool that our entire team actually enjoys using. The UI is beautiful and incredibly intuitive.',
    author: 'Emily Johnson',
    role: 'Design Lead',
    company: 'DesignStudio',
    initials: 'EJ'
  }
];

const FeatureIllustration = ({ type }) => {
  const illustrations = {
    kanban: (
      <div className="landing-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={LandingKanbanPreview}
          alt="Sprintly kanban board preview"
          className="landing-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    ),
    collaboration: (
      <div className="landing-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={LandingCollaborationPreview}
          alt="Sprintly collaboration preview"
          className="landing-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    ),
    analytics: (
      <div className="landing-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={LandingAnalyticsPreview}
          alt="Sprintly analytics preview"
          className="landing-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    )
  };

  return illustrations[type] || illustrations.kanban;
};

const LandingPage = () => {
  return (
    <div
      className="landing-page min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar variant="public" />

      <section className="landing-hero-section relative pt-28 lg:pt-36 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="landing-hero-background absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 -z-10" />
        <div className="landing-hero-blur-left absolute top-20 left-10 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="landing-hero-blur-right absolute bottom-10 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="landing-hero-container max-w-7xl mx-auto">
          <div className="landing-hero-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="landing-hero-content order-2 lg:order-1 text-center lg:text-left">
              <div className="landing-hero-badge inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <HiOutlineStar className="landing-hero-badge-icon w-4 h-4 fill-indigo-600" />
                <span>Rated #1 Project Management Tool</span>
              </div>

              <h1 className="landing-hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] mb-6">
                Ship projects{' '}
                <span className="landing-hero-highlight relative text-indigo-600">
                  faster
                  <svg
                    className="landing-hero-highlight-line absolute -bottom-1 left-0 w-full h-3"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8C50 2 150 2 198 8"
                      stroke="#818CF8"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{' '}
                with your team
              </h1>

              <p className="landing-hero-description text-lg lg:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Sprintly brings all your tasks, teammates, and tools together in one place.
                Plan, track, and deliver projects with clarity and confidence.
              </p>

              <div className="landing-hero-actions flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                <Link to="/register" className="landing-hero-primary-link">
                  <button
                    type="button"
                    className="landing-hero-primary-button group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all"
                  >
                    Start Free Trial
                    <HiOutlineArrowRight className="landing-hero-primary-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <button
                  type="button"
                  className="landing-hero-secondary-button group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all"
                >
                  <HiOutlinePlay className="landing-hero-secondary-icon w-5 h-5 text-indigo-600" />
                  Watch Demo
                </button>
              </div>

              <div className="landing-hero-social-proof flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="landing-hero-avatar-group flex -space-x-3">
                  {['#6366F1', '#10B981', '#F59E0B', '#F43F5E'].map((color, index) => (
                    <div
                      key={color}
                      className="landing-hero-avatar w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-medium shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                  <div className="landing-hero-avatar-count w-10 h-10 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center text-slate-600 text-xs font-medium">
                    +5K
                  </div>
                </div>

                <div className="landing-hero-rating text-left">
                  <div className="landing-hero-rating-stars flex items-center gap-1 justify-center lg:justify-start">
                    {[...Array(5)].map((_, index) => (
                      <HiOutlineStar
                        key={index}
                        className="landing-hero-rating-star w-4 h-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                    <span className="landing-hero-rating-value ml-1 text-sm font-semibold text-slate-700">
                      4.9/5
                    </span>
                  </div>
                  <p className="landing-hero-rating-text text-sm text-slate-500">
                    from 2,000+ reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="landing-hero-visual order-1 lg:order-2 relative">
              <div className="landing-hero-visual-blur absolute -inset-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-3xl opacity-40 blur-2xl -z-10" />

              <div className="landing-hero-dashboard-card relative bg-white rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200/60 p-2 overflow-hidden">
                <img
                  src={LandingHeroDashboard}
                  alt="Sprintly dashboard preview"
                  className="landing-hero-dashboard-image w-full h-auto rounded-[1rem] object-cover"
                />
              </div>

              <div className="landing-hero-floating-card landing-hero-floating-complete hidden lg:flex absolute -left-6 top-1/4 bg-white rounded-xl shadow-xl border border-slate-100 p-4 items-center gap-3 animate-float">
                <div className="landing-hero-floating-icon w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  <HiOutlineCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="landing-hero-floating-content">
                  <p className="landing-hero-floating-title text-sm font-semibold text-slate-900">
                    Task Completed!
                  </p>
                  <p className="landing-hero-floating-text text-xs text-slate-500">Just now</p>
                </div>
              </div>

              <div className="landing-hero-floating-card landing-hero-floating-team hidden lg:flex absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-xl border border-slate-100 p-4 items-center gap-3 animate-float-delayed">
                <div className="landing-hero-floating-icon w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <HiOutlineUserGroup className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="landing-hero-floating-content">
                  <p className="landing-hero-floating-title text-sm font-semibold text-slate-900">
                    8 online
                  </p>
                  <p className="landing-hero-floating-text text-xs text-slate-500">
                    Team members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-features-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="landing-features-container max-w-7xl mx-auto">
          <div className="landing-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="landing-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="landing-section-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
              Everything you need to succeed
            </h2>
            <p className="landing-section-description text-lg text-slate-600 leading-relaxed">
              Powerful features designed for modern teams. Simple enough to start today,
              powerful enough to scale with you.
            </p>
          </div>

          <div className="landing-features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="landing-feature-card group relative p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`landing-feature-icon w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="landing-feature-title text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="landing-feature-description text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="landing-features-action text-center mt-14">
            <Link to="/features" className="landing-features-link">
              <button
                type="button"
                className="landing-features-button group inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Explore all features
                <HiOutlineArrowRight className="landing-features-button-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {featureHighlights.map((highlight, index) => (
        <section
          key={highlight.title}
          className={`landing-highlight-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 ${
            index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
          }`}
        >
          <div className="landing-highlight-container max-w-7xl mx-auto">
            <div className="landing-highlight-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                className={`landing-highlight-content ${index % 2 !== 0 ? 'lg:order-2' : 'lg:order-1'}`}
              >
                <span className="landing-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  {highlight.badge}
                </span>
                <h2 className="landing-highlight-title text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {highlight.title}
                </h2>
                <p className="landing-highlight-description text-lg text-slate-600 leading-relaxed mb-8">
                  {highlight.description}
                </p>

                <ul className="landing-highlight-list space-y-4 mb-8">
                  {highlight.features.map((featureItem) => (
                    <li
                      key={featureItem}
                      className="landing-highlight-list-item flex items-start gap-3"
                    >
                      <div className="landing-highlight-check w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="landing-highlight-list-text text-slate-700">
                        {featureItem}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/features" className="landing-highlight-link">
                  <button
                    type="button"
                    className="landing-highlight-button group inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
                  >
                    Learn More
                    <HiOutlineArrowRight className="landing-highlight-button-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div
                className={`landing-highlight-visual ${index % 2 !== 0 ? 'lg:order-1' : 'lg:order-2'}`}
              >
                <div className="landing-highlight-visual-wrapper relative">
                  <div className="landing-highlight-visual-blur absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl opacity-50 blur-xl -z-10" />
                  <div className="landing-highlight-card relative bg-white rounded-2xl shadow-xl border border-slate-200/60 p-4 overflow-hidden">
                    <FeatureIllustration type={highlight.imageType} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="landing-testimonials-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="landing-testimonials-container max-w-7xl mx-auto">
          <div className="landing-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="landing-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="landing-section-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
              Loved by teams worldwide
            </h2>
            <p className="landing-section-description text-lg text-slate-600">
              See what our customers have to say about their experience with Sprintly.
            </p>
          </div>

          <div className="landing-testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.author}
                className="landing-testimonial-card p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300"
              >
                <div className="landing-testimonial-stars flex gap-1 mb-6">
                  {[...Array(5)].map((_, index) => (
                    <HiOutlineStar
                      key={index}
                      className="landing-testimonial-star w-5 h-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                <p className="landing-testimonial-quote text-slate-700 leading-relaxed mb-8 italic">
                  "{testimonial.quote}"
                </p>

                <div className="landing-testimonial-author flex items-center gap-4">
                  <div className="landing-testimonial-avatar w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {testimonial.initials}
                  </div>
                  <div className="landing-testimonial-author-info">
                    <p className="landing-testimonial-author-name font-semibold text-slate-900">
                      {testimonial.author}
                    </p>
                    <p className="landing-testimonial-author-role text-sm text-slate-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;