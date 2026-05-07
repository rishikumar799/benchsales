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
      desc: 'Auto-customize resumes to match JDs perfectly. Dynamically rewrites bullet points for maximum relevance.',
      icon: Sparkles,
      variant: 'resume' as const
    },
    {
      title: 'AI Fit Scoring',
      desc: 'Proprietary job matching that scores fit before you even apply, ensuring high-quality placement opportunities.',
      icon: Zap,
      variant: 'evaluating' as const
    },
    {
      title: 'Automated Outreach',
      desc: 'Strategic outreach to vendor lists and job boards, building intelligence directly into your workflow.',
      icon: Users,
      variant: 'dashboard' as const
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-app-bg pt-40 pb-32">
        {/* Advanced Premium Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mesh Gradients */}
          <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-violet-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0066FF 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          {/* Noise effect */}
          <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
               style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Pill - Premium Redesign */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-brand-blue/20 text-brand-blue text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] mb-12 relative group overflow-hidden shadow-2xl shadow-brand-blue/5"
            >
              {/* Shine effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 pointer-events-none"
              />
              
              <div className="relative flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                <Sparkles className="w-3.5 h-3.5" /> 
                <span className="relative z-10">The World's First Autonomous Job Agent</span>
              </div>
            </motion.div>

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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => navigate('/auth')}
                className="px-10 py-5 premium-gradient text-white font-bold rounded-2xl shadow-2xl shadow-brand-blue/30 hover:scale-[1.02] hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 relative group overflow-hidden"
              >
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Start Free Today</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 glass border border-app-border text-app-text font-bold rounded-2xl hover:bg-app-bg transition-all flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
                  <Play className="w-4 h-4 fill-brand-blue text-brand-blue" />
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

      {/* Trusted By Section - Refined */}
      <div className="py-20 border-b border-app-border bg-app-surface/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-[0.3em]">Empowering candidates from top companies</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-32 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['Google', 'Meta', 'Stripe', 'Vercel', 'Netflix'].map(brand => (
              <span key={brand} className="text-3xl font-display font-medium text-app-text tracking-tighter hover:text-brand-blue transition-colors cursor-default">{brand}</span>
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
              <div className="px-10 pb-12">
                <div className="aspect-[16/10] rounded-3xl bg-app-surface/50 border border-app-border overflow-hidden relative group-hover:border-brand-blue/30 transition-colors">
                  <div className="absolute inset-0 p-6">
                    <AbstractUI variant={item.variant} className="w-full h-full" />
                  </div>
                  {/* Onboarding Style Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-app-bg/10 to-transparent flex items-end p-6 pointer-events-none">
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
            Join thousands of professionals who have transformed their job search with Aryx AI.
          </p>
          <CTAButton variant="secondary" className="relative z-10" onClick={() => navigate('/auth')}>Get Started For Free</CTAButton>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
