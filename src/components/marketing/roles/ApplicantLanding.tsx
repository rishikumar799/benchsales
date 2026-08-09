import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Target, 
  FileText, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  User, 
  Zap, 
  Briefcase, 
  Award, 
  Check, 
  Search,
  Building2,
  ChevronRight
} from 'lucide-react';
import SectionWrapper from '../common/SectionWrapper';

interface ApplicantLandingProps {
  theme?: 'light' | 'dark';
}

export default function ApplicantLanding({ theme }: ApplicantLandingProps) {
  const navigate = useNavigate();

  const handleScrollToFeatures = () => {
    const el = document.getElementById('features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: 'AI Job Matching',
      desc: 'Get personalized job recommendations based on your skills, experience, and career goals.',
      icon: Target,
    },
    {
      title: 'Resume Builder',
      desc: 'Create ATS-friendly resumes engineered to pass automated screening and get you noticed.',
      icon: FileText,
    },
    {
      title: 'AI Interview Prep',
      desc: 'Practice with AI-powered mock interviews and receive real-time feedback on your answers.',
      icon: Sparkles,
    },
    {
      title: 'Application Tracker',
      desc: 'Track your applications, interview schedules, and response status in one clean dashboard.',
      icon: BarChart3,
    },
    {
      title: 'Skill Gap Analyzer',
      desc: 'Discover missing skills for target roles and receive tailored recommendations to upskill.',
      icon: TrendingUp,
    },
    {
      title: 'Recruiter Representation',
      desc: 'Connect with verified recruiters who can represent your candidate profile directly to employers.',
      icon: Users,
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      desc: 'Add your skills, experience, education, and career preferences in a few simple steps.',
      icon: User,
    },
    {
      number: '02',
      title: 'Get AI Matches',
      desc: 'Our neural matching engine discovers top job opportunities aligned with your profile.',
      icon: Zap,
    },
    {
      number: '03',
      title: 'Apply & Track',
      desc: 'Apply in one click with tailored resume variants and track every application in real time.',
      icon: Briefcase,
    },
    {
      number: '04',
      title: 'Get Hired',
      desc: 'Ace your interviews with AI practice tools and land your dream job with confidence.',
      icon: Award,
    },
  ];

  const valueBlocks = [
    {
      title: 'AI-Powered Discovery',
      desc: 'Find opportunities aligned with your actual profile automatically, eliminating hours of manual job searching.',
      icon: Search,
    },
    {
      title: 'Career Intelligence',
      desc: 'Understand market salary ranges, in-demand skills, and actionable advice to boost your profile strength.',
      icon: TrendingUp,
    },
    {
      title: 'Application Management',
      desc: 'Keep your entire job search organized with status tracking, interview reminders, and document storage.',
      icon: BarChart3,
    },
    {
      title: 'Recruiter Network',
      desc: 'Connect with expert recruiters who actively represent your profile to top hiring teams and companies.',
      icon: Users,
    },
  ];

  const metrics = [
    { label: 'Jobs Available', value: '10K+' },
    { label: 'Companies Hiring', value: '5K+' },
    { label: 'Active Applicants', value: '25K+' },
    { label: 'Success Rate', value: '98%' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Ambient Glow */}
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
                <Sparkles className="w-3.5 h-3.5" />
                <span>FOR APPLICANTS</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Your Career, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Supercharged
                </span> by AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-app-muted font-medium mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                From smart job matches to interview prep and resume tailoring — everything you need to land your dream role.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => navigate('/auth?role=marketplace_jobseeker')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white text-base font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleScrollToFeatures}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue text-base font-bold rounded-full hover:bg-app-surface/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Features</span>
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
                {/* Glowing Glass Orb Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[40px] opacity-20 blur-xl animate-pulse" />
                
                {/* Main Glass Orb & Card Container */}
                <div className="relative glass border border-app-border rounded-[36px] p-6 sm:p-8 card-shadow bg-app-surface/80 backdrop-blur-xl">
                  
                  {/* Top Glowing 3D Glass Icon Orb */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 p-[1px] shadow-2xl shadow-blue-500/30">
                      <div className="w-full h-full bg-[#0B1120] rounded-[23px] flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-500/10 blur-md" />
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
                          <User className="w-8 h-8" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Card Mockup */}
                  <div className="p-4 rounded-2xl bg-app-bg/60 border border-app-border mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-brand-blue font-bold text-sm">
                          AR
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-app-text">Alex Rivers</h4>
                          <p className="text-xs text-app-muted">Senior AI Engineer</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        98% Match
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs text-app-muted">
                        <span>ATS Resume Score</span>
                        <span className="text-blue-400 font-bold">96/100</span>
                      </div>
                      <div className="w-full h-2 bg-app-surface rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full w-[96%]" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge Tags */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-app-bg/40 border border-app-border text-center">
                      <p className="text-xs text-app-muted">Applied Jobs</p>
                      <p className="text-lg font-bold text-app-text">12</p>
                    </div>
                    <div className="p-3 rounded-xl bg-app-bg/40 border border-app-border text-center">
                      <p className="text-xs text-app-muted">Interviews</p>
                      <p className="text-lg font-bold text-brand-blue">3 Active</p>
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
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Comprehensive tools designed to accelerate every step of your career journey.
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

      {/* How It Works Section */}
      <section className="py-20 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Four simple steps from profile setup to landing your dream role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative p-6 sm:p-8 rounded-[28px] glass border border-app-border card-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-display font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-app-surface border border-app-border flex items-center justify-center text-brand-blue">
                      <step.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-app-text">{step.title}</h3>
                  <p className="text-app-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      </section>

      {/* AI Career Advantage Section */}
      <section className="py-20 bg-app-surface/30 relative">
        <SectionWrapper>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 tracking-tight">
              A Smarter Way to Build Your Career
            </h2>
            <p className="text-base sm:text-lg text-app-muted font-medium">
              Leverage artificial intelligence to unlock opportunities matched to your unique profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valueBlocks.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-8 rounded-[28px] glass border border-app-border card-shadow flex gap-6 items-start"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex-shrink-0 flex items-center justify-center text-brand-blue">
                  <block.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-app-text">{block.title}</h3>
                  <p className="text-app-muted text-sm leading-relaxed">{block.desc}</p>
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
                Ready to Accelerate Your Career?
              </h2>
              <p className="text-lg text-app-muted mb-8 font-medium">
                Join thousands of job seekers who found their dream jobs with ARYX AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/auth?role=marketplace_jobseeker')}
                  className="w-full sm:w-auto px-8 py-3.5 premium-gradient text-white font-bold rounded-full shadow-lg shadow-brand-blue/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                >
                  Get Started Now
                </button>
                <button
                  onClick={handleScrollToFeatures}
                  className="w-full sm:w-auto px-8 py-3.5 glass border border-app-border text-app-text hover:text-brand-blue font-bold rounded-full hover:bg-app-surface/60 transition-all cursor-pointer"
                >
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </SectionWrapper>
      </section>

      {/* Metrics Section */}
      <section className="py-16 border-t border-app-border/40">
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {metrics.map((metric, i) => (
              <div key={i} className="p-4">
                <div className="text-3xl sm:text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  {metric.value}
                </div>
                <div className="text-sm font-semibold text-app-muted uppercase tracking-wider">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      </section>
    </div>
  );
}
