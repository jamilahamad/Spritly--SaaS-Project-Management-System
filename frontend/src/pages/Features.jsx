import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import PublicCTA from '../components/common/PublicCTA';
import FeaturesTaskManagement from '../assets/features-task-management.png';
import FeaturesWorkflowBoard from '../assets/features-workflow-board.png';
import FeaturesCollaboration from '../assets/features-collaboration.png';
import FeaturesAnalytics from '../assets/features-analytics.png';
import './Features.css';
import {
  HiOutlineViewBoards,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineSearch,
  HiOutlineChatAlt2,
  HiOutlinePaperClip,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineCollection,
  HiOutlineCog,
  HiOutlineDocumentReport,
  HiOutlineGlobe,
  HiOutlineDeviceMobile,
  HiOutlineRefresh,
  HiOutlineCube
} from 'react-icons/hi';

const coreFeatures = [
  {
    icon: HiOutlineViewBoards,
    title: 'Kanban Boards',
    description:
      'Visualize your workflow with intuitive drag-and-drop boards. Customize columns, swimlanes, and card layouts.',
    color: 'bg-indigo-50 text-indigo-600'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Team Collaboration',
    description:
      'Work together seamlessly with real-time updates, comments, @mentions, and team workspaces.',
    color: 'bg-emerald-50 text-emerald-600'
  },
  {
    icon: HiOutlineChartBar,
    title: 'Advanced Analytics',
    description:
      'Make data-driven decisions with comprehensive dashboards, burndown charts, and velocity tracking.',
    color: 'bg-amber-50 text-amber-600'
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Workflow Automation',
    description:
      'Automate repetitive tasks with custom rules, triggers, and actions. Save hours every week.',
    color: 'bg-rose-50 text-rose-600'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Enterprise Security',
    description:
      'Bank-grade encryption, SSO, 2FA, audit logs, and SOC 2 Type II compliance included.',
    color: 'bg-cyan-50 text-cyan-600'
  },
  {
    icon: HiOutlineBell,
    title: 'Smart Notifications',
    description:
      'Stay informed with intelligent alerts. Get notified about what matters, filter out the noise.',
    color: 'bg-violet-50 text-violet-600'
  }
];

const additionalFeatures = [
  {
    icon: HiOutlineSearch,
    title: 'Powerful Search',
    description: 'Find anything instantly across all projects and tasks.'
  },
  {
    icon: HiOutlineChatAlt2,
    title: 'Comments & Discussions',
    description: 'Discuss tasks in context with threaded conversations.'
  },
  {
    icon: HiOutlinePaperClip,
    title: 'File Attachments',
    description: 'Attach any file type directly to tasks and comments.'
  },
  {
    icon: HiOutlineCalendar,
    title: 'Due Dates & Reminders',
    description: 'Never miss a deadline with smart date tracking.'
  },
  {
    icon: HiOutlineTag,
    title: 'Labels & Tags',
    description: 'Organize and filter tasks with custom labels.'
  },
  {
    icon: HiOutlineCollection,
    title: 'Subtasks & Checklists',
    description: 'Break down complex tasks into manageable steps.'
  },
  {
    icon: HiOutlineCog,
    title: 'Custom Workflows',
    description: 'Define your own statuses and transitions.'
  },
  {
    icon: HiOutlineDocumentReport,
    title: 'Activity Logs',
    description: 'Track all changes with detailed audit trails.'
  },
  {
    icon: HiOutlineGlobe,
    title: 'Multi-Workspace',
    description: 'Manage multiple organizations from one account.'
  },
  {
    icon: HiOutlineDeviceMobile,
    title: 'Mobile Apps',
    description: 'Stay productive on iOS and Android devices.'
  },
  {
    icon: HiOutlineRefresh,
    title: 'Real-time Sync',
    description: 'Changes sync instantly across all devices.'
  },
  {
    icon: HiOutlineCube,
    title: 'Integrations',
    description: 'Connect with 100+ tools you already use.'
  }
];

const featureHighlights = [
  {
    badge: 'Task Management',
    title: 'Organize work your way with powerful task management',
    description:
      'Create tasks with rich descriptions, checklists, attachments, and custom fields. Assign to team members, set priorities, and track progress from start to finish.',
    features: [
      'Rich text descriptions with markdown',
      'Custom fields for any data type',
      'Task dependencies and blockers',
      'Time estimation and tracking',
      'Recurring tasks automation'
    ],
    illustration: 'task'
  },
  {
    badge: 'Visual Workflows',
    title: 'See the big picture with visual project boards',
    description:
      'Kanban boards, list views, and timeline views give you multiple ways to visualize your work. Switch between views instantly to find what works best for your team.',
    features: [
      'Drag-and-drop Kanban boards',
      'Customizable list views',
      'Timeline and Gantt charts',
      'Calendar view for deadlines',
      'Multiple view layouts'
    ],
    illustration: 'workflow'
  },
  {
    badge: 'Team Collaboration',
    title: 'Bring your entire team together in one place',
    description:
      'Comments, @mentions, and real-time notifications keep everyone aligned. Share files, discuss ideas, and make decisions faster without leaving Sprintly.',
    features: [
      'Threaded comments on tasks',
      '@mentions for notifications',
      'Real-time collaborative editing',
      'Team activity feeds',
      'Guest access for clients'
    ],
    illustration: 'collaboration'
  },
  {
    badge: 'Insights & Reporting',
    title: 'Make smarter decisions with powerful analytics',
    description:
      'Track team velocity, identify bottlenecks, and measure progress with beautiful dashboards. Export reports to share with stakeholders.',
    features: [
      'Customizable dashboards',
      'Burndown and velocity charts',
      'Team workload distribution',
      'Time tracking reports',
      'Export to PDF and CSV'
    ],
    illustration: 'analytics'
  }
];

const FeatureIllustration = ({ type }) => {
  const illustrations = {
    task: (
      <div className="features-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={FeaturesTaskManagement}
          alt="Sprintly task management preview"
          className="features-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    ),
    workflow: (
      <div className="features-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={FeaturesWorkflowBoard}
          alt="Sprintly workflow board preview"
          className="features-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    ),
    collaboration: (
      <div className="features-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={FeaturesCollaboration}
          alt="Sprintly collaboration preview"
          className="features-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    ),
    analytics: (
      <div className="features-illustration-card w-full rounded-[1rem] overflow-hidden bg-slate-50">
        <img
          src={FeaturesAnalytics}
          alt="Sprintly analytics preview"
          className="features-illustration-image w-full h-auto object-cover object-top"
        />
      </div>
    )
  };

  return illustrations[type] || illustrations.task;
};

const Features = () => {
  return (
    <div
      className="features-page min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar variant="public" />

      <section className="features-hero-section relative pt-28 lg:pt-36 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="features-hero-background absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 -z-10" />
        <div className="features-hero-blur-right absolute top-20 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="features-hero-blur-left absolute bottom-0 left-0 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="features-hero-container max-w-4xl mx-auto text-center">
          <span className="features-hero-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            Powerful Features
          </span>

          <h1 className="features-hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Everything you need to <span className="features-hero-highlight text-indigo-600">ship faster</span>
          </h1>

          <p className="features-hero-description text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From task management to team collaboration, Sprintly gives your team all the tools
            they need to deliver projects on time, every time.
          </p>

          <div className="features-hero-actions flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="features-hero-primary-link">
              <button
                type="button"
                className="features-hero-primary-button group flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Start Free Trial
                <HiOutlineArrowRight className="features-hero-primary-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <Link to="/pricing" className="features-hero-secondary-link">
              <button
                type="button"
                className="features-hero-secondary-button px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all"
              >
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="features-core-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="features-core-container max-w-7xl mx-auto">
          <div className="features-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="features-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Core Features
            </span>

            <h2 className="features-section-title text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
              Built for modern teams
            </h2>

            <p className="features-section-description text-lg text-slate-600">
              Powerful features designed to help your team work better together.
            </p>
          </div>

          <div className="features-core-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {coreFeatures.map((feature) => (
              <div
                key={feature.title}
                className="features-core-card group p-8 bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`features-core-icon w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7" />
                </div>

                <h3 className="features-core-title text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>

                <p className="features-core-description text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featureHighlights.map((highlight, index) => (
        <section
          key={highlight.title}
          className={`features-highlight-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 ${
            index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
          }`}
        >
          <div className="features-highlight-container max-w-7xl mx-auto">
            <div className="features-highlight-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div
                className={`features-highlight-content ${index % 2 !== 0 ? 'lg:order-2' : ''}`}
              >
                <span className="features-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
                  {highlight.badge}
                </span>

                <h2 className="features-highlight-title text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {highlight.title}
                </h2>

                <p className="features-highlight-description text-lg text-slate-600 leading-relaxed mb-8">
                  {highlight.description}
                </p>

                <ul className="features-highlight-list space-y-4 mb-8">
                  {highlight.features.map((featureItem) => (
                    <li
                      key={featureItem}
                      className="features-highlight-list-item flex items-start gap-3"
                    >
                      <div className="features-highlight-check w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="features-highlight-list-text text-slate-700">
                        {featureItem}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/register" className="features-highlight-link">
                  <button
                    type="button"
                    className="features-highlight-button group inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all"
                  >
                    Get Started
                    <HiOutlineArrowRight className="features-highlight-button-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              <div
                className={`features-highlight-visual ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
              >
                <div className="features-highlight-visual-wrapper relative">
                  <div className="features-highlight-visual-blur absolute -inset-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl opacity-50 blur-xl -z-10" />
                  <div className="features-highlight-card relative bg-white rounded-2xl shadow-xl border border-slate-200/60 p-4 overflow-hidden">
                    <FeatureIllustration type={highlight.illustration} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="features-additional-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="features-additional-container max-w-7xl mx-auto">
          <div className="features-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="features-additional-badge inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium mb-4">
              And So Much More
            </span>

            <h2 className="features-additional-title text-3xl sm:text-4xl font-bold text-white mb-5">
              Packed with features you'll love
            </h2>

            <p className="features-additional-description text-lg text-slate-400">
              Every feature is designed to make your team more productive.
            </p>
          </div>

          <div className="features-additional-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature) => (
              <div
                key={feature.title}
                className="features-additional-card p-6 bg-slate-800/50 hover:bg-slate-800 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300"
              >
                <feature.icon className="features-additional-icon w-8 h-8 text-indigo-400 mb-4" />
                <h3 className="features-additional-card-title text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="features-additional-card-description text-sm text-slate-400">
                  {feature.description}
                </p>
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

export default Features;