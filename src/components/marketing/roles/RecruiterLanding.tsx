import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, 
  Layers, 
  Cpu, 
  Calendar, 
  Users, 
  Award, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight, 
  CheckCircle2, 
  UserCheck, 
  Zap, 
  Clock, 
  CheckSquare, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';

interface RecruiterLandingProps {
  theme?: 'light' | 'dark';
}

export default function RecruiterLanding({ theme }: RecruiterLandingProps) {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: 'Smart Candidate Search',
      desc: 'Discover pre-screened candidates filtered by skills, experience, and role compatibility.',
      icon: Search,
    },
    {
      title: 'Pipeline Management',
      desc: 'Track candidates seamlessly at every stage of your hiring pipeline with clean visual boards.',
      icon: Layers,
    },
    {
      title: 'AI Insights',
      desc: 'Leverage predictive AI fit scoring to evaluate candidates before launching outreach.',
      icon: Cpu,
    },
    {
      title: 'Interview Scheduler',
      desc: 'Schedule interviews seamlessly with candidate calendar sync and automated reminders.',
      icon: Calendar,
    },
    {
      title: 'Team Collaboration',
      desc: 'Share candidate scorecards, notes, and feedback across your recruiting team in real time.',
      icon: Users,
    },
    {
      title: 'Offer Management',
      desc: 'Create, send, and track candidate offer letters and agreements in one place.',
      icon: Award,
    },
    {
      title: 'Candidate Representation',
      desc: 'Receive, evaluate, and manage candidate representation requests with full transparency.',
      icon: ShieldCheck,
    },
    {
      title: 'Analytics & Insights',
      desc: 'Track candidate conversion rates, sourcing velocity, and placement metrics.',
      icon: BarChart3,
    },
  ];

  const pipelineStages = [
    { stage: 'Applied', count: 120, label: 'New Applicants' },
    { stage: 'Screening', count: 45, label: 'Under Review' },
    { stage: 'Interview', count: 18, label: 'Scheduled' },
    { stage: 'Offer', count: 6, label: 'Offer Sent' },
    { stage: 'Hired', count: 3, label: 'Completed' },
  ];

  const valueProps = [
    {
      title: 'Save Time',
      desc: 'Automate repetitive sourcing and screening workflows to focus on closing top talent.',
      icon: Clock,
    },
    {
      title: 'Better Quality',
      desc: 'AI matching ensures candidate profiles closely align with your specific job requisitions.',
      icon: Zap,
    },
    {
      title: 'Data Driven',
      desc: 'Insights and analytics empower you to continuously optimize your recruitment funnel.',
      icon: TrendingUp,
    },
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
                <Zap className="w-3.5 h-3.5" />
                <span>FOR RECRUITERS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Find, Engage & <br className="hidden sm:inline" />
                Hire <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Top Talent
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-app-muted font-medium mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Discover verified candidates, track pipelines, and close hiring faster with AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => navigate('/auth?role=marketplace_recruiter')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white text-base font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue text-base font-bold rounded-full hover:bg-app-surface/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book a Demo</span>
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
                          <UserCheck className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Search Mockup */}
                  <div className="p-4 rounded-2xl bg-app-bg/60 border border-app-border mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-brand-blue font-bold text-sm">
                          SJ
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-app-text">Sarah Jenkins</h4>
                          <p className="text-xs text-app-muted">Lead Full-Stack Architect</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                        96% Fit Score
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-app-muted pt-2 border-t border-app-border/40">
                      <span>Representation</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Accepted
                      </span>
                    </div>
                  </div>

                  {/* Pipeline Quick Overview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-app-bg/40 border border-app-border text-center">
                      <p className="text-xs text-app-muted">Active Pipeline</p>
                      <p className="text-lg font-bold text-app-text">5 Candidates</p>
                    </div>
                    <div className="p-3 rounded-xl bg-app-bg/40 border border-app-border text-center">
                      <p className="text-xs text-app-muted">Offers Pending</p>
                      <p className="text-lg font-bold text-brand-blue">2 Offers</p>
                    </div>
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
              Powerful Tools for Modern Recruiters
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Streamline candidate sourcing, representation, and pipeline management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="p-6 rounded-[24px] glass border border-app-border card-shadow group hover:border-brand-blue/40 hover:bg-app-surface/70 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 text-brand-blue group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-app-text">{feature.title}</h3>
                <p className="text-app-muted text-xs leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Recruitment Pipeline Section */}
      <section className="py-20 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              Recruitment Pipeline
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Visual, real-time pipeline management from application to offer.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 relative">
            {pipelineStages.map((stage, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-[24px] glass border border-app-border card-shadow text-center relative group hover:border-brand-blue/50"
              >
                <p className="text-xs font-bold text-app-muted uppercase tracking-wider mb-2">{stage.stage}</p>
                <p className="text-3xl sm:text-4xl font-display font-bold text-app-text mb-1 group-hover:text-brand-blue transition-colors">
                  {stage.count}
                </p>
                <p className="text-xs text-app-muted">{stage.label}</p>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* Why Recruiters Love ARYX AI */}
      <section className="py-20 bg-app-surface/30 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              Why Recruiters Love Aryx AI
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Designed to help you close talent faster with less friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valueProps.map((vp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-[28px] glass border border-app-border card-shadow flex flex-col justify-between"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 text-brand-blue">
                  <vp.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-app-text">{vp.title}</h3>
                <p className="text-app-muted text-sm leading-relaxed">{vp.desc}</p>
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
                Ready to Build Your Dream Team?
              </h2>
              <p className="text-lg text-app-muted mb-8 font-medium">
                Join top recruiters who hire smarter and close deals faster with ARYX AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth?role=marketplace_recruiter')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Get Started Now
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue font-bold rounded-full hover:bg-app-surface/60 transition-all cursor-pointer"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>
    </div>
  );
}
