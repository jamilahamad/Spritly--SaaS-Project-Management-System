import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';
import Footer from '../components/layout/Footer';
import Navbar from '../components/layout/Navbar';
import PublicCTA from '../components/common/PublicCTA';
import {
  HiCheck,
  HiX,
  HiOutlineArrowRight,
  HiOutlineQuestionMarkCircle,
  HiOutlineStar,
  HiOutlineShieldCheck
} from 'react-icons/hi';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for individuals and small teams getting started.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    cta: 'Get Started Free',
    ctaVariant: 'secondary',
    features: [
      { text: 'Up to 5 team members', included: true },
      { text: '3 projects', included: true },
      { text: 'Basic Kanban boards', included: true },
      { text: 'Task management', included: true },
      { text: '1GB storage', included: true },
      { text: 'Email support', included: true },
      { text: 'Custom workflows', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority support', included: false },
      { text: 'SSO & 2FA', included: false }
    ]
  },
  {
    name: 'Pro',
    description: 'For growing teams who need more power and flexibility.',
    monthlyPrice: 12,
    yearlyPrice: 10,
    popular: true,
    cta: 'Start Free Trial',
    ctaVariant: 'primary',
    features: [
      { text: 'Unlimited team members', included: true },
      { text: 'Unlimited projects', included: true },
      { text: 'Advanced Kanban boards', included: true },
      { text: 'Custom workflows', included: true },
      { text: '25GB storage', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Time tracking', included: true },
      { text: 'API access', included: true },
      { text: 'SSO & 2FA', included: false }
    ]
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with advanced security needs.',
    monthlyPrice: null,
    yearlyPrice: null,
    popular: false,
    cta: 'Contact Sales',
    ctaVariant: 'secondary',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited storage', included: true },
      { text: 'SSO & SAML 2.0', included: true },
      { text: 'Advanced security', included: true },
      { text: 'Audit logs', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: '24/7 phone support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'On-premise deployment', included: true },
      { text: 'SLA guarantee', included: true }
    ]
  }
];

const comparisonRows = [
  { feature: 'Team members', values: ['Up to 5', 'Unlimited', 'Unlimited'] },
  { feature: 'Projects', values: ['3', 'Unlimited', 'Unlimited'] },
  { feature: 'Storage', values: ['1GB', '25GB', 'Unlimited'] },
  { feature: 'Kanban boards', values: ['Basic', 'Advanced', 'Advanced'] },
  { feature: 'Custom workflows', values: [false, true, true] },
  { feature: 'Analytics', values: ['Basic', 'Advanced', 'Advanced'] },
  { feature: 'Time tracking', values: [false, true, true] },
  { feature: 'API access', values: [false, true, true] },
  { feature: 'SSO & SAML', values: [false, false, true] },
  { feature: 'Dedicated support', values: [false, false, true] }
];

const faqs = [
  {
    question: 'Can I try Sprintly for free?',
    answer:
      'Yes! Our Free plan is free forever with core features. You can also start a 14-day free trial of Pro with no credit card required.'
  },
  {
    question: 'What happens when my trial ends?',
    answer:
      "When your trial ends, you'll be moved to the Free plan automatically. You won't lose any data, but some features will be restricted."
  },
  {
    question: 'Can I change plans at any time?',
    answer:
      'Absolutely! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately.'
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer:
      'Yes! We offer 50% off for verified nonprofits and educational institutions. Contact our sales team to learn more.'
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and wire transfers for annual Enterprise plans.'
  },
  {
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use bank-grade encryption, are SOC 2 Type II compliant, and your data is backed up daily in secure data centers.'
  }
];

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const getPrice = (plan) => {
    if (plan.monthlyPrice === null) return 'Custom';

    const price = billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    return price === 0 ? 'Free' : `$${price}`;
  };

  return (
    <div
      className="pricing-page min-h-screen bg-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <Navbar variant="public" />

      <section className="pricing-hero-section relative pt-28 lg:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="pricing-hero-background absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 -z-10" />
        <div className="pricing-hero-blur-left absolute top-20 left-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="pricing-hero-blur-right absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="pricing-hero-container max-w-4xl mx-auto text-center">
          <span className="pricing-hero-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            Simple Pricing
          </span>

          <h1 className="pricing-hero-title text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Choose the perfect plan for{' '}
            <span className="pricing-hero-highlight text-indigo-600">your team</span>
          </h1>

          <p className="pricing-hero-description text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises. Cancel anytime.
          </p>

          <div className="pricing-billing-toggle inline-flex items-center bg-slate-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setBillingPeriod('monthly')}
              className={`pricing-billing-button px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingPeriod('yearly')}
              className={`pricing-billing-button pricing-billing-button-yearly px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="pricing-billing-badge px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="pricing-cards-section py-12 px-4 sm:px-6 lg:px-8">
        <div className="pricing-cards-container max-w-7xl mx-auto">
          <div className="pricing-cards-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/30 scale-105 z-10'
                    : 'bg-white border-2 border-slate-200 hover:border-indigo-200 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="pricing-card-popular-badge absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="pricing-card-popular-label inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      <HiOutlineStar className="w-4 h-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="pricing-card-header mb-6">
                  <h3
                    className={`pricing-card-title text-2xl font-bold mb-2 ${
                      plan.popular ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`pricing-card-description text-sm ${
                      plan.popular ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <div className="pricing-card-price-block mb-8">
                  <div className="pricing-card-price-row flex items-baseline gap-1">
                    <span
                      className={`pricing-card-price text-5xl font-bold ${
                        plan.popular ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {getPrice(plan)}
                    </span>

                    {plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                      <span
                        className={`pricing-card-price-unit text-sm ${
                          plan.popular ? 'text-indigo-200' : 'text-slate-500'
                        }`}
                      >
                        /user/month
                      </span>
                    )}
                  </div>

                  {billingPeriod === 'yearly' && plan.monthlyPrice > 0 && (
                    <p
                      className={`pricing-card-price-note text-sm mt-1 ${
                        plan.popular ? 'text-indigo-200' : 'text-slate-500'
                      }`}
                    >
                      Billed annually (${plan.yearlyPrice * 12}/user/year)
                    </p>
                  )}
                </div>

                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/register'}
                  className="pricing-card-link"
                >
                  <button
                    type="button"
                    className={`pricing-card-button w-full py-3.5 rounded-2xl font-semibold transition-all mb-8 ${
                      plan.popular
                        ? 'bg-white text-indigo-600 hover:bg-slate-50 shadow-lg'
                        : plan.ctaVariant === 'primary'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </Link>

                <ul className="pricing-card-features space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={`${plan.name}-${feature.text}`}
                      className="pricing-card-feature-item flex items-start gap-3"
                    >
                      {feature.included ? (
                        <HiCheck
                          className={`pricing-card-feature-icon w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-indigo-200' : 'text-emerald-500'
                          }`}
                        />
                      ) : (
                        <HiX
                          className={`pricing-card-feature-icon w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-indigo-300/50' : 'text-slate-300'
                          }`}
                        />
                      )}

                      <span
                        className={`pricing-card-feature-text text-sm ${
                          feature.included
                            ? plan.popular
                              ? 'text-white'
                              : 'text-slate-700'
                            : plan.popular
                              ? 'text-indigo-300/50'
                              : 'text-slate-400'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-trust-note text-center mt-12">
            <div className="pricing-trust-pill inline-flex items-center gap-3 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full">
              <HiOutlineShieldCheck className="w-5 h-5" />
              <span className="pricing-trust-text font-medium">
                30-day money-back guarantee on all paid plans
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-comparison-section py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="pricing-comparison-container max-w-7xl mx-auto">
          <div className="pricing-section-header text-center max-w-3xl mx-auto mb-16">
            <h2 className="pricing-section-title text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
              Compare plans in detail
            </h2>
            <p className="pricing-section-description text-lg text-slate-600">
              See which plan is right for your team.
            </p>
          </div>

          <div className="pricing-comparison-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="pricing-comparison-scroll overflow-x-auto">
              <table className="pricing-comparison-table w-full">
                <thead>
                  <tr className="pricing-comparison-head-row border-b border-slate-200">
                    <th className="pricing-comparison-head-cell text-left py-6 px-6 font-semibold text-slate-900">
                      Features
                    </th>

                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        className={`pricing-comparison-plan-head py-6 px-6 text-center ${
                          plan.popular ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <span
                          className={`pricing-comparison-plan-title font-bold text-lg ${
                            plan.popular ? 'text-indigo-600' : 'text-slate-900'
                          }`}
                        >
                          {plan.name}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonRows.map((row) => (
                    <tr
                      key={row.feature}
                      className="pricing-comparison-row border-b border-slate-100 last:border-0"
                    >
                      <td className="pricing-comparison-feature py-4 px-6 text-slate-700 font-medium">
                        {row.feature}
                      </td>

                      {row.values.map((value, index) => (
                        <td
                          key={`${row.feature}-${plans[index].name}`}
                          className={`pricing-comparison-value py-4 px-6 text-center ${
                            plans[index].popular ? 'bg-indigo-50/50' : ''
                          }`}
                        >
                          {typeof value === 'boolean' ? (
                            value ? (
                              <HiCheck className="w-5 h-5 text-emerald-500 mx-auto" />
                            ) : (
                              <HiX className="w-5 h-5 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="pricing-comparison-value-text text-slate-700">
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-faq-section py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="pricing-faq-container max-w-4xl mx-auto">
          <div className="pricing-section-header text-center mb-16">
            <span className="pricing-faq-badge inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>

            <h2 className="pricing-section-title text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
              Frequently asked questions
            </h2>

            <p className="pricing-section-description text-lg text-slate-600">
              Everything you need to know about our pricing.
            </p>
          </div>

          <div className="pricing-faq-list space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="pricing-faq-card bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors"
              >
                <div className="pricing-faq-content flex items-start gap-4">
                  <div className="pricing-faq-icon-wrapper w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <HiOutlineQuestionMarkCircle className="w-5 h-5 text-indigo-600" />
                  </div>

                  <div className="pricing-faq-text">
                    <h3 className="pricing-faq-question text-lg font-semibold text-slate-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="pricing-faq-answer text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pricing-contact-cta mt-12 text-center">
            <p className="pricing-contact-text text-slate-600 mb-4">Still have questions?</p>

            <Link to="/contact" className="pricing-contact-link">
              <button
                type="button"
                className="pricing-contact-button inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                Contact our team
                <HiOutlineArrowRight className="pricing-contact-icon w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <PublicCTA />
      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default Pricing;