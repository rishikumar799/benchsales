import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Shield, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Play, 
  Target, 
  Eye, 
  Lock, 
  Cpu, 
  FileText, 
  Bell, 
  ChevronDown, 
  Layers, 
  TrendingUp, 
  Building2, 
  Globe, 
  Award,
  Upload,
  Search,
  Send,
  Calendar,
  BarChart3,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import CTAButton from '../../components/marketing/common/CTAButton';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import AbstractUI from '../../components/marketing/common/AbstractUI';

export default function LandingPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 4. Everything You Need
  const capabilities = [
    {
      title: 'AI Resume Tailoring',
      desc: 'Auto-customize resumes for every job description. Dynamically rewrites bullet points for maximum keyword relevance.',
      icon: FileText,
      variant: 'resume' as const,
      tag: 'Core AI'
    },
    {
      title: 'AI Fit Scoring',
      desc: 'Proprietary job matching that scores candidate fit before applying, ensuring high interview conversion rates.',
      icon: Zap,
      variant: 'evaluating' as const,
      tag: 'Intelligence'
    },
    {
      title: 'Automated Outreach',
      desc: 'Strategic outreach to vendor lists, client managers, and job boards to build pipeline directly into your workflow.',
      icon: Users,
      variant: 'dashboard' as const,
      tag: 'Automation'
    },
    {
      title: 'Agent Oversight',
      desc: 'Human-in-the-loop validation monitoring your automated agent for 100% accuracy and quality control.',
      icon: Shield,
      variant: 'evaluating' as const,
      tag: 'Quality Assurance'
    },
    {
      title: 'Smart Notifications',
      desc: 'Instant alerts via Email or WhatsApp the moment an employer reaches out or schedules an interview.',
      icon: Bell,
      variant: 'dashboard' as const,
      tag: 'Real-time'
    },
    {
      title: 'Anti-Ban Protection',
      desc: 'Proprietary rate-limiting and browser simulation logic preventing account bans across LinkedIn, Indeed, and glassdoor.',
      icon: Lock,
      variant: 'refining' as const,
      tag: 'Security'
    }
  ];

  // 5. How ARYX Works (6 Steps)
  const steps = [
    {
      number: '01',
      title: 'Upload Resume',
      desc: 'Import your master resume, career preferences, and target job roles in seconds.',
      icon: Upload,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      number: '02',
      title: 'AI Optimizes',
      desc: 'Our neural engine parses your profile and builds optimized resume variants for each industry.',
      icon: Sparkles,
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      number: '03',
      title: 'Finds Matching Jobs',
      desc: 'Scours 100+ global job boards and vendor databases for high-confidence matches.',
      icon: Search,
      gradient: 'from-teal-500 to-emerald-500'
    },
    {
      number: '04',
      title: 'AI Applies',
      desc: 'Autonomously submits tailored applications, answers screening questions, and attaches custom cover letters.',
      icon: Send,
      gradient: 'from-indigo-500 to-violet-500'
    },
    {
      number: '05',
      title: 'Interview Alerts',
      desc: 'Receive immediate notifications when employers request interviews, with pre-generated prep briefs.',
      icon: Calendar,
      gradient: 'from-violet-500 to-purple-500'
    },
    {
      number: '06',
      title: 'Dashboard Tracking',
      desc: 'Track every application state, recruiter response rate, and interview stage in a unified command center.',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  // 6. Why ARYX (Reorganized About Content)
  const whyAryxItems = [
    {
      title: 'Strategic Purpose',
      desc: 'Bridge the gap between human potential and global opportunity, giving every candidate a dedicated AI career agent.',
      icon: Target,
      color: 'text-brand-blue',
      bg: 'bg-brand-blue/10',
      variant: 'evaluating' as const
    },
    {
      title: 'Transparency',
      desc: 'Complete visibility into every submitted application, resume mutation, and AI decision with audit logs.',
      icon: Eye,
      color: 'text-brand-violet',
      bg: 'bg-brand-violet/10',
      variant: 'dashboard' as const
    },
    {
      title: 'Continuous Innovation',
      desc: 'Evolving neural algorithms trained on millions of successful hiring cycles and real-time market trends.',
      icon: Sparkles,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      variant: 'creating' as const
    },
    {
      title: 'Operational Mandate',
      desc: 'Democratizing top-tier career access through high-speed automation while upholding zero-spam ethical standards.',
      icon: Shield,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      variant: 'refining' as const
    },
    {
      title: 'Future Aspirations',
      desc: 'Evolving from an initial application automation engine into a lifelong career development partner.',
      icon: TrendingUp,
      color: 'text-cyan-500',
      bg: 'bg-cyan-500/10',
      variant: 'dashboard' as const
    },
    {
      title: 'Strategic Intelligence',
      desc: 'Granular analytical reports explaining exactly why specific job roles fit your skill topology.',
      icon: Cpu,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
      variant: 'resume' as const
    }
  ];

  // 9. Enterprise Security
  const securityFeatures = [
    { title: 'End-to-End Encryption', desc: 'AES-256 encryption at rest and TLS 1.3 in transit protects all candidate & client data.', icon: Lock },
    { title: 'Anti-Ban Protection', desc: 'Proprietary rate-limiting logic ensures full compliance with job board anti-bot policies.', icon: Shield },
    { title: 'Human Oversight', desc: 'Optional human verification loops review edge-case application forms before submission.', icon: Users },
    { title: 'AI Transparency', desc: 'Clear explainability logs behind every fit score, resume edit, and match recommendation.', icon: Eye },
    { title: 'GDPR & CCPA Ready', desc: 'Strict data privacy controls allowing full data export or complete account deletion anytime.', icon: CheckCircle2 },
    { title: 'Zero Data Selling', desc: 'Your personal career data is strictly yours. We never sell or monetize user profile info.', icon: Award }
  ];

  // 12. FAQ
  const faqs = [
    {
      q: 'How does ARYX AI automate my job applications?',
      a: 'ARYX AI connects with major job boards and career sites. Using neural language models, it analyzes job descriptions, adapts your resume bullet points for high keyword alignment, fills out application forms, and submits them automatically.'
    },
    {
      q: 'Will my LinkedIn or job board accounts get flagged or banned?',
      a: 'No. ARYX uses proprietary Anti-Ban Technology that mimics natural human browsing behavior, applies intelligent time delays between submissions, and stays strictly within platform rate limits.'
    },
    {
      q: 'Can I review my tailored resumes before the AI submits them?',
      a: 'Yes! You can choose between Full Autopilot or Human Approval mode. In Approval mode, ARYX pre-generates tailored applications and waits for your single-tap confirmation.'
    },
    {
      q: 'How does ARYX support Recruiters and Business Development Managers (BDMs)?',
      a: 'ARYX provides dedicated portals for Recruiters (candidate sourcing, bulk submissions, match scoring) and BDMs (client requisition management, bench tracking, revenue forecasting) in one unified platform.'
    },
    {
      q: 'Is my personal information and resume data secure?',
      a: 'Absolutely. We use enterprise-grade AES-256 encryption, comply with GDPR/CCPA, and never sell or share your personal information with third-party advertisers.'
    },
    {
      q: 'How do I get started with ARYX AI?',
      a: 'Simply click "Get Started", create your account, upload your resume, and set your career preferences. Your AI agent can begin matching and applying in less than 3 minutes.'
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* 1. HERO SECTION */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-app-bg pt-36 pb-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
               style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-xl shadow-brand-blue/5">
              <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              <Sparkles className="w-3.5 h-3.5" /> 
              <span>The World's First Autonomous Job Agent</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 tracking-tight leading-[1.05]">
              Your Job Search. <br />
              <span className="text-gradient">Fully Automated.</span>
            </h1>

            <p className="text-app-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Stop wasting hours on manual job applications. Our AI agent sources, tailors resumes, and applies to top roles daily while you focus on interview prep.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-9 py-4.5 premium-gradient text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/25 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-9 py-4.5 glass border border-app-border text-app-text font-bold rounded-2xl hover:bg-app-surface transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-brand-blue text-brand-blue" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </motion.div>

          {/* Floating Agent Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9 }}
            className="mt-16 max-w-5xl mx-auto relative group"
          >
            <div className="absolute -inset-1 premium-gradient opacity-10 blur-3xl rounded-[40px] group-hover:opacity-20 transition-opacity" />
            <div className="relative glass border border-app-border rounded-[36px] overflow-hidden shadow-2xl bg-white/40 dark:bg-app-surface/40">
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-app-border bg-app-surface/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <div className="mx-auto text-[11px] font-bold text-app-muted uppercase tracking-[0.2em]">Autonomous Agent Command Center</div>
              </div>
              <div className="aspect-[21/9] md:aspect-[3/1]">
                <AbstractUI variant="dashboard" className="p-8" />
              </div>
            </div>

            {/* Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 glass border border-app-border px-5 py-3.5 rounded-2xl shadow-xl z-30 hidden md:block bg-white dark:bg-app-surface"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Status</div>
                  <div className="text-sm font-bold text-app-text">15 Applications Sent Today</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 glass border border-app-border px-5 py-3.5 rounded-2xl shadow-xl z-30 hidden md:block bg-white dark:bg-app-surface"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-blue" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">AI Insight</div>
                  <div className="text-sm font-bold text-app-text">98.4% Match Score</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* 2. TRUSTED BY COMPANIES */}
      <div className="py-14 border-y border-app-border bg-app-surface/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-app-muted uppercase tracking-[0.25em]">Trusted by professionals placing candidates at</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-60">
            {['Google', 'Meta', 'Stripe', 'Vercel', 'Workday', 'Netflix', 'OpenAI', 'Notion'].map(brand => (
              <span key={brand} className="text-2xl font-display font-semibold text-app-text tracking-tight hover:text-brand-blue transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. PLATFORM STATISTICS */}
      <SectionWrapper>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '2.4M+', label: 'Applications Sent', sub: 'Across 100+ global job boards' },
            { value: '18%', label: 'Interview Rate', sub: '3x higher than industry average' },
            { value: '25h', label: 'Time Saved', sub: 'Per week for every candidate' },
            { value: '99.4%', label: 'Resume Accuracy', sub: 'Keyword matching precision' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl glass border border-app-border text-center card-shadow"
            >
              <div className="text-4xl lg:text-5xl font-display font-bold text-brand-blue mb-2">{stat.value}</div>
              <div className="text-base font-bold mb-1">{stat.label}</div>
              <div className="text-xs text-app-muted font-medium">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* 4. EVERYTHING YOU NEED */}
      <SectionWrapper className="bg-app-surface/20" id="capabilities">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Everything You Need</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Built to beat the ATS and land interviews
          </h2>
          <p className="text-app-muted text-lg font-medium">
            From deep resume customization to anti-ban security, our platform gives candidates, recruiters, and managers total career leverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-8 rounded-3xl glass border border-app-border card-shadow group hover:border-brand-blue/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-app-surface border border-app-border text-app-muted">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
                <p className="text-app-muted text-sm leading-relaxed mb-6">{item.desc}</p>
              </div>
              <div className="aspect-[16/9] rounded-2xl bg-app-surface/50 border border-app-border overflow-hidden p-4 relative">
                <AbstractUI variant={item.variant} className="w-full h-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* 5. HOW ARYX WORKS */}
      <SectionWrapper id="how-it-works">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Simple 6-Step Workflow</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            How ARYX AI Works
          </h2>
          <p className="text-app-muted text-lg font-medium">
            Set up your agent in under 3 minutes. Sit back as ARYX handles sourcing, tailoring, and applications end-to-end.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl glass border border-app-border card-shadow relative group hover:border-brand-blue/30 transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.gradient} flex items-center justify-center text-white shadow-lg`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="text-3xl font-display font-bold text-app-muted/30 group-hover:text-brand-blue/40 transition-colors">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{step.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* 6. WHY ARYX */}
      <SectionWrapper className="bg-app-surface/20" id="why-aryx">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Why Choose ARYX</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Driven by Purpose, Intelligence, & Integrity
          </h2>
          <p className="text-app-muted text-lg font-medium">
            Our architectural principles ensure you receive maximum career leverage without ever sacrificing trust or transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyAryxItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-8 rounded-3xl glass border border-app-border card-shadow group hover:bg-app-surface/50 transition-all"
            >
              <div className="aspect-[16/10] rounded-2xl bg-app-surface/50 border border-app-border overflow-hidden mb-6 p-4">
                <AbstractUI variant={item.variant} className="w-full h-full" />
              </div>
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{item.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* 7. MEET YOUR AI CAREER AGENT */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Unified Ecosystem</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6 leading-tight">
              Meet Your AI Career Agent & Staffing Command Center
            </h2>
            <p className="text-app-muted text-lg leading-relaxed mb-8 font-medium">
              Whether you are an individual job applicant, a recruitment agent scaling placements, or a BDM managing client accounts, ARYX provides tailored workflows for every stakeholder.
            </p>

            <div className="space-y-6">
              {[
                { title: 'For Applicants', desc: 'Autonomous job search, resume tailoring, and instant interview scheduling.', path: '/role/applicant' },
                { title: 'For Recruiters', desc: 'AI fit scoring, bulk candidate submissions, and vendor outreach automation.', path: '/role/recruiter' },
                { title: 'For BDMs', desc: 'Client requisition management, bench tracking, and revenue forecasting.', path: '/role/bdm' },
              ].map((role, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(role.path)}
                  className="p-5 rounded-2xl glass border border-app-border hover:border-brand-blue/40 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div>
                    <h4 className="font-display font-bold text-lg mb-1 group-hover:text-brand-blue transition-colors">{role.title}</h4>
                    <p className="text-app-muted text-sm font-medium">{role.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-app-muted group-hover:text-brand-blue group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 premium-gradient opacity-10 blur-3xl rounded-[40px]" />
            <div className="relative glass border border-app-border rounded-[36px] p-8 card-shadow bg-white/40 dark:bg-app-surface/40">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-app-surface/60 border border-app-border p-6">
                <AbstractUI variant="dashboard" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 8. TESTIMONIALS */}
      <SectionWrapper className="bg-app-surface/20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Success Stories</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Trusted by Candidates & Professionals Global
          </h2>
          <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            <span className="ml-2 text-sm font-bold text-app-text">4.9/5 from over 12,000+ candidates</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Alex Johnson', 
              role: 'Software Engineer @ Stripe', 
              text: 'ARYX applied to 45 targeted tech roles in 3 days. I received 6 interview invites in my first week and accepted a staff role within 3 weeks.' 
            },
            { 
              name: 'Sarah Miller', 
              role: 'Product Manager @ Vercel', 
              text: 'The AI resume tailoring feature is insane. It tweaked my bullet points for every JD perfectly, doubling my callback response rate overnight.' 
            },
            { 
              name: 'David Chen', 
              role: 'Data Scientist @ Meta', 
              text: 'As a busy professional, I didn’t have 20 hours a week for job boards. ARYX ran seamlessly in the background and delivered interviews straight to my inbox.' 
            },
          ].map((t, i) => (
            <div key={i} className="p-8 rounded-3xl glass border border-app-border card-shadow flex flex-col justify-between">
              <p className="text-app-muted italic text-base leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full premium-gradient flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-bold text-app-text">{t.name}</div>
                  <div className="text-xs font-semibold text-app-muted">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 9. ENTERPRISE SECURITY */}
      <SectionWrapper>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Enterprise Security & Compliance</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Security & Privacy by Design
          </h2>
          <p className="text-app-muted text-lg font-medium">
            Your career data is sensitive. We employ multi-layered security protocols, transparent AI reasoning, and strict data governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((sec, i) => (
            <div key={i} className="p-8 rounded-3xl glass border border-app-border card-shadow">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6">
                <sec.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-display font-bold mb-2">{sec.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{sec.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 10. ABOUT ARYX */}
      <SectionWrapper className="bg-app-surface/20" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white mb-6 shadow-xl shadow-brand-blue/20">
              <Target className="w-7 h-7" />
            </div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">About ARYX AI</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight leading-tight">
              Pioneering the <span className="text-gradient">Future of Work</span>
            </h2>
            <p className="text-app-muted text-lg leading-relaxed mb-8 font-medium">
              Founded by AI researchers and recruitment industry veterans, ARYX AI was built to solve the modern hiring mismatch. By empowering every candidate with an intelligent, autonomous agent, we level the playing field in global recruitment.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-brand-blue" />
                </div>
                <p className="text-app-text font-medium text-base">Bridging human potential with global career opportunities.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0 mt-1">
                  <Check className="w-4 h-4 text-brand-blue" />
                </div>
                <p className="text-app-text font-medium text-base">Combining autonomous speed with strict human quality validation.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-8 premium-gradient opacity-10 blur-3xl rounded-[48px]" />
            <div className="relative glass border border-app-border rounded-[36px] p-10 card-shadow bg-white/40 dark:bg-app-surface/40">
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                    <Eye className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold mb-1">Full Candidate Control</h4>
                    <p className="text-app-muted text-sm leading-relaxed font-medium">Complete audit logs of every application, tailored resume, and recruiter interaction.</p>
                  </div>
                </div>
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-violet/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-brand-violet" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-bold mb-1">Adaptive Neural Learning</h4>
                    <p className="text-app-muted text-sm leading-relaxed font-medium">Continuous model updates reflecting shifting market demands and employer preferences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 11. VISION METRICS */}
      <SectionWrapper>
        <div className="p-12 rounded-[40px] glass border border-app-border card-shadow relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Global Scale</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">System Vision & Global Impact</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-display font-bold text-brand-blue mb-2">2.4M+</div>
              <div className="text-xs font-bold text-app-muted uppercase tracking-widest">Applications Optimized</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-brand-violet mb-2">15k+</div>
              <div className="text-xs font-bold text-app-muted uppercase tracking-widest">Career Breakthroughs</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-emerald-500 mb-2">99.8%</div>
              <div className="text-xs font-bold text-app-muted uppercase tracking-widest">System Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-display font-bold text-amber-500 mb-2">100+</div>
              <div className="text-xs font-bold text-app-muted uppercase tracking-widest">Partner Networks</div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 12. FAQ */}
      <SectionWrapper className="bg-app-surface/20" id="faq">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-3 block">Frequently Asked Questions</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Everything You Need to Know
          </h2>
          <p className="text-app-muted text-lg font-medium">
            Have questions about how ARYX operates? Here are answers to our most common inquiries.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="rounded-2xl glass border border-app-border overflow-hidden card-shadow transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex items-center justify-between font-display font-bold text-lg cursor-pointer hover:text-brand-blue transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-app-muted transition-transform duration-300 shrink-0 ml-4 ${openFaq === i ? 'rotate-180 text-brand-blue' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-app-muted text-sm leading-relaxed font-medium border-t border-app-border/50 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* 13. FINAL CTA */}
      <SectionWrapper containerClassName="text-center">
        <div className="p-14 md:p-20 rounded-[48px] premium-gradient text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 relative z-10 tracking-tight">
            Ready to Land Your Next Job?
          </h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto relative z-10 font-medium">
            Join thousands of candidates, recruiters, and managers accelerating their career growth with ARYX AI today.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="px-10 py-5 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-[1.02] transition-all active:scale-95 relative z-10 cursor-pointer text-base"
          >
            Get Started
          </button>
        </div>
      </SectionWrapper>

      {/* 14. FOOTER */}
      <Footer />
    </div>
  );
}
