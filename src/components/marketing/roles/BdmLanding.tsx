import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Building2, 
  Target, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Shield, 
  DollarSign, 
  LineChart, 
  Layers, 
  Check, 
  ChevronRight,
  Handshake,
  PieChart
} from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';

interface BdmLandingProps {
  theme?: 'light' | 'dark';
}

export default function BdmLanding({ theme }: BdmLandingProps) {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: 'Job Management',
      desc: 'Create, assign, and manage job requisitions across multiple enterprise clients and domains.',
      icon: Briefcase,
    },
    {
      title: 'Recruiter Network',
      desc: 'Manage recruiter partners, assign specific roles, and track individual sourcing velocity.',
      icon: Users,
    },
    {
      title: 'Business Analytics',
      desc: 'Monitor requisition fill rates, pipeline health, and revenue growth in real time.',
      icon: TrendingUp,
    },
    {
      title: 'Client Management',
      desc: 'Maintain client relationships, contract requirements, and hiring manager contacts in one workspace.',
      icon: Building2,
    },
    {
      title: 'Performance Tracking',
      desc: 'Track team performance and recruiter activity against custom organizational benchmarks.',
      icon: Target,
    },
    {
      title: 'Reports & Insights',
      desc: 'Generate executive reporting dashboards and actionable business intelligence.',
      icon: BarChart3,
    },
  ];

  const dashboardMetrics = [
    { label: 'Active Jobs', value: '156', desc: 'Managed requisitions' },
    { label: 'Active Recruiters', value: '84', desc: 'Recruiter partners' },
    { label: 'Total Placements', value: '52', desc: 'Successful hires' },
    { label: 'Total Revenue', value: '₹24.8L', desc: 'Generated revenue' },
  ];

  const workflowSteps = [
    { number: '01', title: 'Create Opportunity', desc: 'Publish client requisitions with skill criteria and budget guidelines.' },
    { number: '02', title: 'Manage Recruiters', desc: 'Assign requisitions to top recruiter partners in your network.' },
    { number: '03', title: 'Source Talent', desc: 'Recruiters source, screen, and present candidate shortlists.' },
    { number: '04', title: 'Track Hiring', desc: 'Oversee client interview loops, offers, and candidate feedback.' },
    { number: '05', title: 'Measure Results', desc: 'Track deal revenues, recruiter commissions, and account growth.' },
  ];

  const valuePoints = [
    { title: 'Centralized Job Management', desc: 'Single control tower for all client requisitions and job postings.' },
    { title: 'Recruiter Network Management', desc: 'Seamless partner onboarding, role assignments, and commission tracking.' },
    { title: 'Performance Visibility', desc: 'Real-time visibility into recruiter productivity and submission ratios.' },
    { title: 'Business Intelligence', desc: 'Predictive revenue forecasting and automated client reporting.' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-brand-blue font-bold text-xs uppercase tracking-widest mb-6"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>FOR BDM MANAGERS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Scale Hiring. <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Grow Your Network
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-app-muted font-medium mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Create jobs, manage recruiters, track performance, and grow your business with AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => navigate('/auth?role=marketplace_bdm')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white text-base font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue text-base font-bold rounded-full hover:bg-app-surface/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Contact Sales</span>
                </button>
              </motion.div>
            </div>

            {/* Right Visual Card Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-md"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] opacity-20 blur-xl animate-pulse" />
                
                <div className="relative glass border border-app-border rounded-[36px] p-6 sm:p-8 card-shadow bg-app-surface/80 backdrop-blur-xl">
                  
                  {/* Top Glowing 3D Orb */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-[1px] shadow-2xl shadow-blue-500/30">
                      <div className="w-full h-full bg-[#0B1120] rounded-[23px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/10 blur-md" />
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <TrendingUp className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Performance Banner */}
                  <div className="p-4 rounded-2xl bg-app-bg/60 border border-app-border mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-app-muted uppercase tracking-wider">Business Development Overview</p>
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +34% MoM
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-app-border/40 text-left">
                      <div>
                        <p className="text-xs text-app-muted">Active Requisitions</p>
                        <p className="text-lg font-bold text-app-text">156 Jobs</p>
                      </div>
                      <div>
                        <p className="text-xs text-app-muted">Total Placements</p>
                        <p className="text-lg font-bold text-brand-blue">52 Hires</p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Overview Block */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 text-center">
                    <p className="text-xs text-app-muted mb-1">Network Revenue Generated</p>
                    <p className="text-2xl font-display font-bold text-app-text">₹24.8L</p>
                  </div>

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-app-surface/30 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              Everything You Need to Lead
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Complete management suite for client requisitions, recruiter networks, and revenue growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-8 rounded-[28px] glass border border-app-border card-shadow group hover:border-brand-blue/40 hover:bg-app-surface/70 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-brand-blue group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-app-text">{feature.title}</h3>
                <p className="text-app-muted text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Key Metrics Dashboard Section */}
      <section className="py-20 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              Key Metrics Dashboard
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Real-time visibility into your workforce operations and financial performance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-[28px] glass border border-app-border card-shadow text-center group hover:border-brand-blue/40"
              >
                <p className="text-xs font-bold text-app-muted uppercase tracking-wider mb-2">{metric.label}</p>
                <p className="text-3xl sm:text-4xl font-display font-bold text-app-text mb-2 group-hover:text-brand-blue transition-colors">
                  {metric.value}
                </p>
                <p className="text-xs text-app-muted">{metric.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Business Workflow Section */}
      <section className="py-20 bg-app-surface/30 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              From Opportunity to Placement
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              End-to-end business development lifecycle built for high scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-[24px] glass border border-app-border card-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-display font-bold text-brand-blue mb-4 block">
                    {step.number}
                  </span>
                  <h3 className="text-base font-bold mb-2 text-app-text">{step.title}</h3>
                  <p className="text-app-muted text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Why ARYX AI Section */}
      <section className="py-20 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              Why BDM Leaders Choose Aryx AI
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Built to help business development teams scale accounts efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valuePoints.map((vp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-[28px] glass border border-app-border card-shadow flex gap-5 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-brand-blue font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-app-text">{vp.title}</h3>
                  <p className="text-app-muted text-sm leading-relaxed">{vp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <SectionWrapper>
          <div className="relative rounded-[36px] overflow-hidden p-8 sm:p-12 lg:p-16 text-center border border-app-border glass card-shadow">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">
                Ready to Scale Your Business?
              </h2>
              <p className="text-lg text-app-muted mb-8 font-medium">
                Empower your network and grow your revenue with ARYX AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth?role=marketplace_bdm')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Get Started Now
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue font-bold rounded-full hover:bg-app-surface/60 transition-all cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>
    </div>
  );
}
