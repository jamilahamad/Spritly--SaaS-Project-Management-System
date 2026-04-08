import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Navbar from '../components/layout/Navbar';
import AboutWorkspacePreview from '../assets/about-workspace-preview.png';
import PublicCTA from '../components/common/PublicCTA';
import Footer from '../components/layout/Footer';
import {
  HiOutlineArrowRight,
  HiOutlineLightningBolt,
  HiOutlineClock,
  HiOutlineUserGroup
} from 'react-icons/hi';

const philosophyCards = [
  {
    icon: HiOutlineLightningBolt,
    title: 'Project Chaos',
    subtitle: 'The Problem',
    description:
      'Teams drown in scattered tools, unclear ownership, and endless status meetings that drain productivity.',
    color: 'bg-rose-50 text-rose-500 border-rose-100',
    iconBg: 'bg-rose-100',
    accent: 'border-l-rose-400'
  },
  {
    icon: HiOutlineClock,
    title: 'Missed Deadlines',
    subtitle: 'The Cost',
    description:
      "Without clear visibility into project progress, deadlines slip silently until it's too late to recover.",
    color: 'bg-amber-50 text-amber-500 border-amber-100',
    iconBg: 'bg-amber-100',
    accent: 'border-l-amber-400'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Team Silos',
    subtitle: 'The Gap',
    description:
      "Information gets trapped in silos. Design doesn't talk to dev. Marketing doesn't know what shipped.",
    color: 'bg-violet-50 text-violet-500 border-violet-100',
    iconBg: 'bg-violet-100',
    accent: 'border-l-violet-400'
  }
];

const coreIntents = [
  {
    number: '01',
    title: 'Clarity Over Complexity',
    description:
      'We strip away the unnecessary. Every feature exists to bring clarity to your workflow, not to add more noise to an already chaotic process.'
  },
  {
    number: '02',
    title: 'Speed Without Sacrifice',
    description:
      'Move fast without breaking things. Sprintly is engineered for performance — instant load times, real-time updates, and zero friction.'
  },
  {
    number: '03',
    title: 'Built for Humans',
    description:
      'Tools should adapt to people, not the other way around. We obsess over UX so your team can focus on shipping, not learning software.'
  }
];

const techStack = [
  {
    name: 'React.js',
    description: 'Interactive UI',
    detail: 'Component-based architecture for fast, dynamic user interfaces',
    icon: (
      <svg viewBox="0 0 24 24" className="about-tech-icon-svg w-8 h-8" fill="currentColor">
        <path d="M12 10.11c1.03 0 1.87.84 1.87 1.89 0 1-.84 1.85-1.87 1.85S10.13 13 10.13 12c0-1.05.84-1.89 1.87-1.89M7.37 20c.63.38 2.01-.2 3.6-1.7-.52-.59-1.03-1.23-1.51-1.9a22.7 22.7 0 01-2.4-.36c-.51 2.14-.32 3.61.31 3.96m.71-5.74l-.29-.51c-.11.29-.22.58-.29.86.27.06.57.11.88.16l-.3-.51m6.54-.76l.81-1.5-.81-1.5c-.3-.53-.62-1-.91-1.47C13.17 9 12.6 9 12 9c-.6 0-1.17 0-1.71.03-.29.47-.61.94-.91 1.47L8.57 12l.81 1.5c.3.53.62 1 .91 1.47.54.03 1.11.03 1.71.03.6 0 1.17 0 1.71-.03.29-.47.61-.94.91-1.47M12 6.78c-.19.22-.39.45-.59.72h1.18c-.2-.27-.4-.5-.59-.72m0 10.44c.19-.22.39-.45.59-.72h-1.18c.2.27.4.5.59.72M16.62 4c-.62-.38-2 .2-3.59 1.7.52.59 1.03 1.23 1.51 1.9.82.08 1.63.2 2.4.36.51-2.14.32-3.61-.32-3.96m-.7 5.74l.29.51c.11-.29.22-.58.29-.86-.27-.06-.57-.11-.88-.16l.3.51m1.45-7.05c1.47.84 1.63 3.05 1.01 5.63 2.54.75 4.37 1.99 4.37 3.68s-1.83 2.93-4.37 3.68c.62 2.58.46 4.79-1.01 5.63-1.46.84-3.45-.12-5.37-1.95-1.92 1.83-3.91 2.79-5.38 1.95-1.46-.84-1.62-3.05-1-5.63-2.54-.75-4.37-1.99-4.37-3.68s1.83-2.93 4.37-3.68c-.62-2.58-.46-4.79 1-5.63 1.47-.84 3.46.12 5.38 1.95 1.92-1.83 3.91-2.79 5.37-1.95M17.08 12c.34.75.64 1.5.89 2.26 2.1-.63 3.28-1.53 3.28-2.26 0-.73-1.18-1.63-3.28-2.26-.25.76-.55 1.51-.89 2.26M6.92 12c-.34-.75-.64-1.5-.89-2.26-2.1.63-3.28 1.53-3.28 2.26 0 .73 1.18 1.63 3.28 2.26.25-.76.55-1.51.89-2.26m9 2.26l-.3.51c.31-.05.61-.1.88-.16-.07-.28-.18-.57-.29-.86l-.29.51m-2.89 4.04c1.59 1.5 2.97 2.08 3.59 1.7.64-.35.83-1.82.32-3.96-.77.16-1.58.28-2.4.36-.48.67-.99 1.31-1.51 1.9M8.08 9.74l.3-.51c-.31.05-.61.1-.88.16.07.28.18.57.29.86l.29-.51m2.89-4.04C9.38 4.2 8 3.62 7.37 4c-.63.35-.82 1.82-.31 3.96a22.7 22.7 0 012.4-.36c.48-.67.99-1.31 1.51-1.9z" />
      </svg>
    )
  },
  {
    name: 'Node.js',
    description: 'Backend Engine',
    detail: 'Scalable server-side runtime for high-performance API development',
    icon: (
      <svg viewBox="0 0 24 24" className="about-tech-icon-svg w-8 h-8" fill="currentColor">
        <path d="M12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.46 1.71.46 1.4 0 2.21-.85 2.21-2.33V8.44c0-.12-.1-.22-.22-.22H8.5c-.13 0-.23.1-.23.22V16.9c0 .66-.68 1.31-1.77.76L4.45 16.5a.26.26 0 01-.12-.21V7.71c0-.09.04-.17.12-.21l7.44-4.29c.08-.04.18-.04.25 0l7.44 4.29c.07.04.12.12.12.21v8.58c0 .08-.05.17-.12.21l-7.44 4.29c-.07.04-.17.04-.25 0l-1.88-1.11c-.07-.04-.15-.05-.22-.02-.61.27-.72.31-1.3.47-.14.04-.36.11.08.32l2.46 1.45c.24.14.5.21.78.21.27 0 .54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36V7.71c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2M14.52 8c-2.16 0-3.41.93-3.41 2.47 0 1.68 1.3 2.14 3.31 2.35 2.41.25 2.6.63 2.6 1.13 0 .88-.7 1.24-2.35 1.24-2.08 0-2.54-.52-2.69-1.55a.22.22 0 00-.22-.18h-.96c-.12 0-.22.1-.22.22 0 1.24.68 2.73 4.09 2.73 2.45 0 3.85-.96 3.85-2.65 0-1.67-1.13-2.11-3.51-2.43-2.41-.32-2.41-.56-2.41-1.01 0-.44.2-1.04 1.91-1.04 1.53 0 2.09.33 2.32 1.37.02.1.11.18.22.18h.96c.06 0 .12-.03.16-.08a.24.24 0 00.06-.16c-.15-1.77-1.32-2.59-3.71-2.59z" />
      </svg>
    )
  },
  {
    name: 'MongoDB',
    description: 'Data Layer',
    detail: 'Flexible NoSQL database for scalable and efficient data storage',
    icon: (
      <svg viewBox="0 0 24 24" className="about-tech-icon-svg w-8 h-8" fill="currentColor">
        <path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z" />
      </svg>
    )
  },
  {
    name: 'Tailwind CSS',
    description: 'Design System',
    detail: 'Utility-first CSS framework for rapid, consistent UI development',
    icon: (
      <svg viewBox="0 0 24 24" className="about-tech-icon-svg w-8 h-8" fill="currentColor">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    )
  }
];

const DeskIllustration = () => (
  <div className="about-desk-illustration w-full rounded-[1.5rem] overflow-hidden bg-white border border-slate-200/60 shadow-2xl shadow-slate-200/60">
    <img
      src={AboutWorkspacePreview}
      alt="Sprintly workspace preview"
      className="about-desk-image w-full h-auto object-cover object-top"
    />
  </div>
);

const About = () => {
  return (
    <div
      className="about-page min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar variant="public" />

      <section className="about-hero-section relative pt-28 lg:pt-36 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="about-hero-background absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 -z-10" />
        <div className="about-hero-blur-right absolute top-20 right-20 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="about-hero-blur-left absolute bottom-10 left-10 w-60 h-60 bg-purple-100 rounded-full blur-3xl opacity-20 -z-10" />

        <div className="about-hero-container max-w-7xl mx-auto">
          <div className="about-hero-grid grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="about-hero-content order-2 lg:order-1">
              <div className="about-hero-badge inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="about-hero-badge-dot w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                About Sprintly
              </div>

              <h1 className="about-hero-title text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-900 leading-[1.1] mb-6">
                The precision curator for{' '}
                <span className="about-hero-highlight relative text-indigo-600">
                  high-performing
                  <svg
                    className="about-hero-highlight-line absolute -bottom-1 left-0 w-full h-3"
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
                teams
              </h1>

              <p className="about-hero-description text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                We don't just build project management software. We architect precision systems
                that eliminate noise, surface clarity, and empower teams to ship meaningful work
                — consistently and confidently.
              </p>

              <div className="about-hero-actions flex flex-col sm:flex-row items-start gap-4">
                <Link to="/register" className="about-hero-primary-link">
                  <button
                    type="button"
                    className="about-hero-primary-button group flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  >
                    Start Building
                    <HiOutlineArrowRight className="about-hero-primary-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>

                <Link to="/features" className="about-hero-secondary-link">
                  <button
                    type="button"
                    className="about-hero-secondary-button px-7 py-3.5 text-slate-700 hover:text-indigo-600 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all"
                  >
                    Explore Features
                  </button>
                </Link>
              </div>
            </div>

            <div className="about-hero-visual order-1 lg:order-2">
              <div className="about-hero-visual-wrapper relative">
                <div className="about-hero-visual-blur absolute -inset-4 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-3xl blur-2xl -z-10" />
                <DeskIllustration />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-philosophy-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="about-philosophy-container max-w-7xl mx-auto">
          <div className="about-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="about-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Philosophy
            </span>

            <h2 className="about-section-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
              Why we exist
            </h2>

            <p className="about-section-description text-lg text-slate-600 leading-relaxed">
              We identified three critical failures that plague modern teams. Sprintly was built
              to systematically eliminate each one.
            </p>
          </div>

          <div className="about-philosophy-grid grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20">
            {philosophyCards.map((card, index) => (
              <div
                key={card.title}
                className={`about-philosophy-card relative p-8 bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 hover:-translate-y-1 border-l-4 ${card.accent}`}
              >
                <span className="about-philosophy-number absolute top-6 right-6 text-6xl font-bold text-slate-100">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div
                  className={`about-philosophy-icon w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                >
                  <card.icon className={`w-7 h-7 ${card.color.split(' ')[1]}`} />
                </div>

                <p
                  className={`about-philosophy-subtitle text-xs font-semibold uppercase tracking-widest mb-2 ${card.color.split(' ')[1]}`}
                >
                  {card.subtitle}
                </p>

                <h3 className="about-philosophy-title text-xl font-bold text-slate-900 mb-3">
                  {card.title}
                </h3>

                <p className="about-philosophy-description text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="about-intent-wrapper max-w-4xl mx-auto">
            <div className="about-intent-header text-center mb-12">
              <h3 className="about-intent-title text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
                Core Intent
              </h3>
              <p className="about-intent-description text-slate-600">
                Three principles that drive every decision we make.
              </p>
            </div>

            <div className="about-intent-list space-y-0">
              {coreIntents.map((intent, index) => (
                <div
                  key={intent.number}
                  className={`about-intent-item flex gap-6 lg:gap-8 p-6 lg:p-8 ${
                    index !== coreIntents.length - 1 ? 'border-b border-slate-200' : ''
                  } hover:bg-white rounded-2xl transition-colors group`}
                >
                  <div className="about-intent-number-wrapper flex-shrink-0">
                    <span className="about-intent-number inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {intent.number}
                    </span>
                  </div>

                  <div className="about-intent-content">
                    <h4 className="about-intent-item-title text-lg font-bold text-slate-900 mb-2">
                      {intent.title}
                    </h4>
                    <p className="about-intent-item-description text-slate-600 leading-relaxed">
                      {intent.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-tech-section py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="about-tech-container max-w-7xl mx-auto">
          <div className="about-section-header text-center max-w-3xl mx-auto mb-16">
            <span className="about-section-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Technology
            </span>

            <h2 className="about-section-title text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
              Built on modern foundations
            </h2>

            <p className="about-section-description text-lg text-slate-600 leading-relaxed">
              We chose each technology with purpose — performance, scalability, and developer
              experience at the core of every decision.
            </p>
          </div>

          <div className="about-tech-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="about-tech-card group relative p-8 bg-slate-50 hover:bg-white rounded-2xl border-2 border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="about-tech-icon-wrapper w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  {tech.icon}
                </div>

                <h3 className="about-tech-title text-lg font-bold text-slate-900 mb-1">
                  {tech.name}
                </h3>

                <p className="about-tech-subtitle text-indigo-600 text-sm font-medium mb-3">
                  {tech.description}
                </p>

                <p className="about-tech-detail text-slate-500 text-sm leading-relaxed">
                  {tech.detail}
                </p>

                <div className="about-tech-line absolute bottom-0 left-8 right-8 h-0.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </div>
            ))}
          </div>

          <div className="about-tech-summary mt-12 p-6 lg:p-8 bg-slate-900 rounded-2xl text-center">
            <div className="about-tech-summary-items flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="about-tech-summary-item flex items-center gap-2">
                <div className="about-tech-summary-dot w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
                <span className="about-tech-summary-text text-slate-300 text-sm font-medium">
                  MVC Architecture
                </span>
              </div>

              <div className="about-tech-divider hidden sm:block w-px h-4 bg-slate-700" />

              <div className="about-tech-summary-item flex items-center gap-2">
                <div className="about-tech-summary-dot w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
                <span className="about-tech-summary-text text-slate-300 text-sm font-medium">
                  RESTful APIs
                </span>
              </div>

              <div className="about-tech-divider hidden sm:block w-px h-4 bg-slate-700" />

              <div className="about-tech-summary-item flex items-center gap-2">
                <div className="about-tech-summary-dot w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
                <span className="about-tech-summary-text text-slate-300 text-sm font-medium">
                  JWT Authentication
                </span>
              </div>

              <div className="about-tech-divider hidden sm:block w-px h-4 bg-slate-700" />

              <div className="about-tech-summary-item flex items-center gap-2">
                <div className="about-tech-summary-dot w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
                <span className="about-tech-summary-text text-slate-300 text-sm font-medium">
                  Multi-Tenant SaaS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicCTA />
      <Footer />
    </div>
  );
};

export default About;