import React from 'react';
import { motion } from 'motion/react';
import { 
  UserPlus, 
  FileSearch, 
  Zap, 
  Calendar, 
  Target, 
  Trophy,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Play
} from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import CTAButton from '../../components/marketing/common/CTAButton';
import AbstractUI from '../../components/marketing/common/AbstractUI';

export default function HowItWorksPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const steps = [
    {
      step: 'Step 1',
      title: 'Create your profile & upload resume',
      description: 'Start by creating your account and uploading your current resume. Our AI immediately begins analyzing your skills and experience.',
      icon: UserPlus,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-app-surface border border-app-border flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-brand-blue" />
            </div>
            <div className="h-4 w-32 bg-app-surface rounded-full" />
          </div>
          <div className="space-y-3">
            <div className="h-2 w-full bg-app-surface rounded-full" />
            <div className="h-2 w-5/6 bg-app-surface rounded-full" />
            <div className="h-2 w-4/6 bg-app-surface rounded-full" />
          </div>
          <div className="mt-6 flex justify-end">
            <div className="h-8 w-24 premium-gradient rounded-lg" />
          </div>
        </div>
      )
    },
    {
      step: 'Step 2',
      title: 'AI optimization & agent review',
      description: 'Our AI optimizes your resume for ATS compatibility while a dedicated recruitment agent reviews your profile for quality assurance.',
      icon: FileSearch,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow">
          <div className="flex justify-between items-center mb-6">
            <div className="text-xs font-bold text-app-muted uppercase tracking-widest">AI Analysis</div>
            <div className="text-xs font-bold text-emerald-500">98% Match</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
            <div className="flex items-center gap-3 opacity-50">
              <div className="w-4 h-4 rounded-full border border-app-border" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      step: 'Step 3',
      title: 'Automated applications',
      description: 'Your AI agent sources relevant jobs and applies to 10-15 roles daily, tailoring every cover letter and application to the specific role.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow">
          <div className="text-center mb-4">
            <div className="text-3xl font-display font-bold text-brand-blue">15</div>
            <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest">Applications Today</div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-2 rounded-lg bg-app-surface/50 border border-app-border flex items-center justify-between">
                <div className="h-2 w-20 bg-app-border rounded-full" />
                <div className="text-[8px] font-bold text-emerald-500">SENT</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      step: 'Step 4',
      title: 'Interview scheduling',
      description: 'When recruiters respond, our system helps coordinate schedules and ensures you never miss a follow-up or an interview request.',
      icon: Calendar,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-xs font-bold">New Interview</div>
          </div>
          <div className="p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
            <div className="text-[10px] font-bold text-brand-blue mb-1">TOMORROW @ 10:00 AM</div>
            <div className="h-2 w-24 bg-app-border rounded-full" />
          </div>
        </div>
      )
    },
    {
      step: 'Step 5',
      title: 'Interview preparation',
      description: 'Receive AI-generated prep notes, common questions, and company insights for every interview scheduled through the platform.',
      icon: Target,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow">
          <div className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">Prep Notes</div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-blue mt-1.5" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-blue mt-1.5" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
            <div className="flex gap-2">
              <div className="w-1 h-1 rounded-full bg-brand-blue mt-1.5" />
              <div className="h-2 flex-1 bg-app-surface rounded-full" />
            </div>
          </div>
        </div>
      )
    },
    {
      step: 'Step 6',
      title: 'Get hired',
      description: 'With a consistent pipeline of interviews and expert support, you reach your career goals faster than ever before.',
      icon: Trophy,
      color: 'text-brand-violet',
      bg: 'bg-brand-violet/10',
      card: (
        <div className="glass border border-app-border rounded-3xl p-6 card-shadow text-center">
          <div className="w-12 h-12 rounded-full bg-brand-violet/10 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-6 h-6 text-brand-violet" />
          </div>
          <div className="text-lg font-display font-bold text-app-text mb-1">Offer Received!</div>
          <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Congratulations</div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="pt-40 pb-24 px-4 relative overflow-hidden bg-app-surface/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-blue rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-violet rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight leading-[1.1]">
              The Science of <br />
              <span className="text-gradient">Automation</span>
            </h1>
            <p className="text-xl text-app-muted leading-relaxed font-medium mb-10">
              From profile creation to final offer. We've engineered a multi-step autonomous journey that handles the grunt work while you focus on what matters.
            </p>
            <CTAButton className="px-10 py-5">Get Started Now</CTAButton>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute -inset-4 premium-gradient opacity-10 blur-3xl rounded-full" />
            <div className="relative aspect-[16/10] rounded-[48px] overflow-hidden glass border border-app-border card-shadow flex items-center justify-center group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-current" />
                  </div>
                  <p className="text-sm font-bold text-white uppercase tracking-widest">Watch the process</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Journey Section */}
      <SectionWrapper className="bg-app-surface/30">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 tracking-tight">Your journey in 6 steps</h2>
          
          {/* Progress Line */}
          <div className="hidden lg:flex max-w-5xl mx-auto justify-between relative mb-20">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-app-border -translate-y-1/2 -z-10" />
            {steps.map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20">
                  {i + 1}
                </div>
                <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest whitespace-nowrap">
                  {_.title.split(' ')[0]}...
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-32">
          {steps.map((item, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-32 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className="text-brand-blue font-bold mb-4 flex items-center gap-2">
                  <span className="text-sm uppercase tracking-widest">{item.step}</span>
                </div>
                <h3 className="text-4xl font-display font-bold mb-6 tracking-tight">{item.title}</h3>
                <p className="text-app-muted text-lg leading-relaxed mb-8">
                  {item.description}
                </p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="text-sm font-bold text-app-text uppercase tracking-widest">Key Action</div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-md">
                <div className="relative">
                  <div className={`absolute -inset-4 ${item.bg} opacity-20 blur-2xl rounded-full`} />
                  <div className="relative">
                    {item.card}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* What You'll Do Section */}
      <SectionWrapper>
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">What you'll do</h2>
          <p className="text-app-muted max-w-2xl mx-auto">
            Our platform simplifies the complex job market into three core activities for our users.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Creating',
              desc: 'Build your professional profile and define your career goals for the AI.',
              icon: UserPlus,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
              variant: 'creating' as const
            },
            {
              title: 'Evaluating',
              desc: 'Review the job matches and application strategies proposed by your AI agent.',
              icon: FileSearch,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10',
              variant: 'evaluating' as const
            },
            {
              title: 'Refining',
              desc: 'Fine-tune your resume and interview skills with AI-driven feedback.',
              icon: Sparkles,
              color: 'text-violet-500',
              bg: 'bg-violet-500/10',
              variant: 'refining' as const
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[40px] glass border border-app-border card-shadow flex flex-col group hover:bg-app-surface/50 transition-all">
              <div className="aspect-[16/10] rounded-3xl bg-app-surface/50 border border-app-border overflow-hidden mb-8 relative group-hover:border-app-border/80 transition-colors">
                <div className="absolute inset-0 p-6">
                  <AbstractUI variant={item.variant} className="w-full h-full" />
                </div>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <h4 className="text-2xl font-display font-bold mb-4">{item.title}</h4>
                <p className="text-app-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Active Projects Section (from screenshot) */}
      <SectionWrapper className="bg-app-surface/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Active projects</h2>
            <p className="text-app-muted mb-8">Explore opportunities that match your expertise to get started.</p>
            <CTAButton variant="outline">View all projects</CTAButton>
          </div>
          <div className="lg:col-span-2 space-y-4">
            {[
              { title: 'Senior Software Engineer', pay: '$120k - $180k', status: 'Open' },
              { title: 'AI Research Scientist', pay: '$150k - $220k', status: 'Open' },
              { title: 'Product Manager (SaaS)', pay: '$110k - $160k', status: 'Open' },
              { title: 'Frontend Developer (React)', pay: '$90k - $140k', status: 'Open' },
              { title: 'Backend Architect', pay: '$140k - $200k', status: 'Open' },
              { title: 'Data Engineer', pay: '$100k - $150k', status: 'Open' },
            ].map((project, i) => (
              <div key={i} className="glass border border-app-border rounded-2xl p-6 flex items-center justify-between group hover:border-brand-blue transition-all">
                <div>
                  <h4 className="font-bold text-lg mb-1">{project.title}</h4>
                  <div className="text-xs font-bold text-app-muted uppercase tracking-widest">up to {project.pay}</div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-app-muted uppercase tracking-widest">{project.status}</span>
                  </div>
                  <button className="px-6 py-2 bg-app-text text-app-bg text-xs font-bold rounded-full hover:bg-brand-blue hover:text-white transition-all">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
