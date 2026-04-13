import React from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Users, ArrowRight, Sparkles, CheckCircle2, Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import CTAButton from '../../components/marketing/common/CTAButton';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import AbstractUI from '../../components/marketing/common/AbstractUI';

export default function LandingPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const navigate = useNavigate();

  const steps = [
    { title: 'Create Profile', desc: 'Upload your resume and let our AI analyze your skills.', icon: Sparkles },
    { title: 'AI Matching', desc: 'Our engine finds the perfect roles across 100+ job boards.', icon: Zap },
    { title: 'Auto Apply', desc: 'Sit back as our AI handles applications and follow-ups.', icon: Shield },
  ];

  const whyChoose = [
    {
      title: 'Agent Oversight',
      desc: 'Human experts monitor your automated agent for 100% accuracy and quality control.',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      variant: 'evaluating' as const
    },
    {
      title: 'Smart Notifications',
      desc: 'Instant alerts via Email or WhatsApp the second an employer reaches out.',
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      variant: 'dashboard' as const
    },
    {
      title: 'Anti-Ban Protection',
      desc: 'Proprietary logic mimics human browsing patterns to prevent LinkedIn/Indeed bans.',
      icon: Shield,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      variant: 'refining' as const
    }
  ];

  const premiumCapabilities = [
    {
      title: 'AI Resume Tailoring',
      desc: 'Dynamically rewrites bullet points to match job descriptions perfectly using Gemini 1.5 Pro.',
      icon: Sparkles,
      variant: 'resume' as const
    },
    {
      title: 'Cover Letter Generation',
      desc: 'Unique, persuasive letters for every application that bypass ATS filters with ease.',
      icon: Zap,
      variant: 'letter' as const
    },
    {
      title: 'Live Application Dashboard',
      desc: 'See exactly where you applied, when, and the current status in real-time.',
      icon: Users,
      variant: 'dashboard' as const
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-app-bg pt-32 pb-24">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 right-0 h-full overflow-hidden pointer-events-none opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-violet/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-10">
              <Sparkles className="w-3.5 h-3.5" /> The World's First Autonomous Job Agent
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-display font-bold text-app-text mb-8 tracking-tight leading-[1.05]">
              Your Job Search. <br />
              <span className="text-gradient">Fully Automated.</span>
            </h1>

            {/* Subtext */}
            <p className="text-app-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Stop wasting hours on manual applications. Our AI agent sources, tailors, and applies to 10-15 roles daily while you focus on interviews.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="px-10 py-4 premium-gradient text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2"
              >
                Start Free Today <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-4 bg-white dark:bg-app-surface border border-app-border text-app-text font-bold rounded-2xl hover:bg-app-surface transition-all flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-app-bg flex items-center justify-center group-hover:bg-app-border transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                Watch Demo
              </button>
            </div>
          </motion.div>

          {/* Floating Premium UI Element */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-24 max-w-5xl mx-auto relative group"
          >
            <div className="absolute -inset-1 premium-gradient opacity-10 blur-3xl rounded-[40px] group-hover:opacity-20 transition-opacity" />
            <div className="relative glass border border-app-border rounded-[40px] overflow-hidden shadow-2xl bg-white/40 dark:bg-app-surface/40">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-app-border bg-app-surface/30">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <div className="mx-auto text-[10px] font-bold text-app-muted uppercase tracking-[0.2em]">Autonomous Agent Dashboard</div>
              </div>
              <div className="aspect-[21/9] md:aspect-[3/1]">
                <AbstractUI variant="dashboard" className="p-8" />
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-8 glass border border-app-border px-6 py-4 rounded-3xl shadow-2xl z-30 hidden md:block bg-white dark:bg-app-surface"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Status</div>
                  <div className="text-base font-bold text-app-text">12 Applications Sent</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -left-8 glass border border-app-border px-6 py-4 rounded-3xl shadow-2xl z-30 hidden md:block bg-white dark:bg-app-surface"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider">AI Insight</div>
                  <div className="text-base font-bold text-app-text">98% Match Found</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-12 border-b border-app-border bg-app-surface/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all">
            {['Google', 'Meta', 'Stripe', 'Vercel', 'Netflix'].map(brand => (
              <span key={brand} className="text-2xl font-display font-bold text-app-text tracking-tighter">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { value: '2.4M+', label: 'Applications Sent', sub: 'Across all active users' },
            { value: '18%', label: 'Interview Rate', sub: 'Average increase in velocity' },
            { value: '25h', label: 'Time Saved', sub: 'Per week per candidate' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 rounded-[48px] glass border border-app-border text-center card-shadow"
            >
              <div className="text-5xl font-display font-bold text-brand-blue mb-4">{stat.value}</div>
              <div className="text-xl font-bold mb-2">{stat.label}</div>
              <div className="text-sm text-app-muted font-medium">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Premium Capabilities (Access Onboarding Style) */}
      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-brand-blue font-bold uppercase tracking-widest text-xs mb-4 block">Premium Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight leading-tight">
              Everything you need to <br /> beat the bots.
            </h2>
          </div>
          <div className="text-app-muted text-lg leading-relaxed max-w-xl">
            From deep AI customization to bulletproof anti-ban measures, we've thought of everything to keep your search safe and successful.
          </div>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-8 pb-8 lg:pb-0 snap-x snap-mandatory no-scrollbar">
          {premiumCapabilities.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="min-w-[85%] lg:min-w-0 snap-center rounded-[48px] glass border border-app-border overflow-hidden card-shadow group"
            >
              <div className="p-10">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-12">
                  <item.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
                <p className="text-app-muted text-sm leading-relaxed mb-8">{item.desc}</p>
              </div>
              <div className="px-10 pb-10">
                <div className="aspect-[16/10] rounded-3xl bg-app-surface/50 border border-app-border overflow-hidden relative group-hover:border-brand-blue/30 transition-colors">
                  <div className="absolute inset-0 p-4">
                    <AbstractUI variant={item.variant} className="w-full h-full" />
                  </div>
                  {/* Onboarding Style Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-app-bg/20 to-transparent flex items-end p-6 pointer-events-none">
                    <div className="w-full h-1 bg-brand-blue/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '70%' }}
                        className="h-full bg-brand-blue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Features Section (Built for Every Stakeholder) */}
      <SectionWrapper className="bg-app-surface/30">
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar">
          {whyChoose.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[85%] md:min-w-0 snap-center p-10 rounded-[40px] glass border border-app-border card-shadow group hover:bg-app-surface/50 transition-all overflow-hidden"
            >
              <div className="aspect-[16/10] rounded-3xl bg-app-surface/50 border border-app-border overflow-hidden mb-8 relative group-hover:border-brand-blue/30 transition-colors">
                <div className="absolute inset-0 p-4">
                  <AbstractUI variant={item.variant} className="w-full h-full" />
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper className="bg-app-surface/20">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Trusted By Professionals</h2>
          <div className="flex items-center justify-center gap-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          </div>
        </div>
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-8 pb-8 md:pb-0 snap-x snap-mandatory no-scrollbar">
          {[
            { name: 'Alex Johnson', role: 'Software Engineer', text: 'The AI applied to 50 jobs in 2 days. I got 5 interviews within a week!' },
            { name: 'Sarah Miller', role: 'Product Manager', text: 'Finally, a tool that understands my career goals and takes the grunt work out.' },
            { name: 'David Chen', role: 'Data Scientist', text: 'The resume optimization feature is a game changer. My response rate doubled.' },
          ].map((t, i) => (
            <div key={i} className="min-w-[85%] md:min-w-0 snap-center p-10 rounded-[40px] glass border border-app-border card-shadow">
              <p className="text-app-muted italic mb-10 text-lg">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full premium-gradient shadow-lg" />
                <div>
                  <div className="font-bold text-app-text text-lg">{t.name}</div>
                  <div className="text-xs font-bold text-app-muted uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Final CTA */}
      <SectionWrapper containerClassName="text-center">
        <div className="p-16 rounded-[48px] premium-gradient text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 relative z-10">Ready to Automate Your Success?</h2>
          <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of professionals who have transformed their job search with Bench Sales AI.
          </p>
          <CTAButton variant="secondary" className="relative z-10" onClick={() => navigate('/auth')}>Get Started For Free</CTAButton>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
