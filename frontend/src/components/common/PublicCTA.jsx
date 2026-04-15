import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi';
import './PublicCTA.css';

const CTA_CONTENT = {
  '/': {
    title: 'Ready to transform your workflow?',
    description:
      'Join thousands of teams already using Sprintly to ship projects faster and collaborate better. Start your free trial today.',
    primaryLabel: 'Get Started Free',
    primaryTo: '/register',
    secondaryLabel: 'View Pricing',
    secondaryTo: '/pricing',
    note: 'No credit card required • 14-day free trial • Cancel anytime',
    sectionClassName: 'bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700',
    descriptionClassName: 'text-indigo-100 leading-relaxed',
    noteClassName: 'text-indigo-200',
    stretchButtons: true,
    showDotPattern: false
  },
  '/features': {
    title: 'Ready to supercharge your workflow?',
    description:
      'Start your free trial today and discover why thousands of teams choose Sprintly.',
    primaryLabel: 'Start Free Trial',
    primaryTo: '/register',
    secondaryLabel: 'View Pricing',
    secondaryTo: '/pricing',
    note: 'No credit card required • 14-day free trial • Cancel anytime',
    sectionClassName: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    descriptionClassName: 'text-indigo-100',
    noteClassName: 'text-indigo-200',
    stretchButtons: false,
    showDotPattern: false
  },
  '/pricing': {
    title: 'Ready to get started?',
    description:
      'Join thousands of teams already using Sprintly to ship projects faster.',
    primaryLabel: 'Start Free Trial',
    primaryTo: '/register',
    secondaryLabel: 'Contact Sales',
    secondaryTo: '/contact',
    note: 'No credit card required • 14-day free trial • Cancel anytime',
    sectionClassName: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    descriptionClassName: 'text-indigo-100',
    noteClassName: 'text-indigo-200',
    stretchButtons: false,
    showDotPattern: false
  },
  '/about': {
    title: 'Ready to build with precision?',
    description:
      "Join thousands of high-performing teams who've traded chaos for clarity. Start your free trial today — no credit card required.",
    primaryLabel: 'Start Free Trial',
    primaryTo: '/register',
    secondaryLabel: 'Talk to Us',
    secondaryTo: '/contact',
    note: 'Free 14-day trial • No credit card • Cancel anytime',
    sectionClassName: 'bg-gradient-to-br from-indigo-600 to-indigo-700',
    descriptionClassName: 'text-indigo-100 leading-relaxed',
    noteClassName: 'text-indigo-200',
    stretchButtons: true,
    showDotPattern: false
  }
};

const PublicCTA = () => {
  const location = useLocation();
  const content = CTA_CONTENT[location.pathname];

  if (!content) {
    return null;
  }

  const primaryButtonClassName = content.stretchButtons
    ? 'cta-primary-button group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-semibold rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all'
    : 'cta-primary-button group flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-semibold rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all';

  const secondaryButtonClassName = content.stretchButtons
    ? 'cta-secondary-button w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all'
    : 'cta-secondary-button px-8 py-4 bg-transparent hover:bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/30 hover:border-white/60 transition-all';

  return (
    <section
      className={`public-cta-section relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 ${content.sectionClassName}`}
    >
      <div className="public-cta-top-blur absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="public-cta-bottom-blur absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2" />

      {content.showDotPattern && (
        <div
          className="public-cta-dot-pattern absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
      )}

      <div className="public-cta-container relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="public-cta-title text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {content.title}
        </h2>

        <p
          className={`public-cta-description text-xl mb-10 max-w-2xl mx-auto ${content.descriptionClassName}`}
        >
          {content.description}
        </p>

        <div className="public-cta-actions flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={content.primaryTo} className="public-cta-primary-link">
            <button type="button" className={primaryButtonClassName}>
              {content.primaryLabel}
              <HiOutlineArrowRight className="public-cta-primary-icon w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>

          <Link to={content.secondaryTo} className="public-cta-secondary-link">
            <button type="button" className={secondaryButtonClassName}>
              {content.secondaryLabel}
            </button>
          </Link>
        </div>

        <p className={`public-cta-note mt-8 text-sm ${content.noteClassName}`}>
          {content.note}
        </p>
      </div>
    </section>
  );
};

export default PublicCTA;