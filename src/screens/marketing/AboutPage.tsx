import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import AbstractUI from '../../components/marketing/common/AbstractUI';

export default function AboutPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="pt-40 pb-24 px-4 relative overflow-hidden bg-app-surface/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 premium-gradient rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-blue rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight">
              Pioneering the <span className="text-gradient">Future of Work</span>
            </h1>
            <p className="text-xl text-app-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              We are a team of AI researchers and recruitment experts dedicated to building the world's most intelligent autonomous job search ecosystem.
            </p>
          </motion.div>
        </div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white mb-8 shadow-xl shadow-brand-blue/20">
              <Target className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Strategic Purpose</h2>
            <p className="text-app-muted text-lg leading-relaxed mb-8">
              To bridge the gap between human potential and global opportunity. We aim to empower every professional with a personal AI agent that navigates the complex job market with precision, speed, and integrity.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-3xl font-display font-bold text-brand-blue mb-2">2.4M+</div>
                <div className="text-xs font-bold text-app-muted uppercase tracking-widest">Applications Optimized</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-brand-violet mb-2">15k+</div>
                <div className="text-xs font-bold text-app-muted uppercase tracking-widest">Career Breakthroughs</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 premium-gradient opacity-10 blur-3xl rounded-[64px] animate-pulse" />
            <div className="relative glass border border-app-border rounded-[48px] p-12 card-shadow overflow-hidden bg-white/40 dark:bg-app-surface/40 backdrop-blur-xl">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-[0.15] pointer-events-none">
                <AbstractUI variant="dashboard" className="w-full h-full rotate-12" />
              </div>
              
              <div className="relative z-10 space-y-12">
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-blue/20 transition-all duration-300">
                    <Eye className="w-8 h-8 text-brand-blue" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display font-bold mb-3">Transparency</h4>
                    <p className="text-app-muted text-base leading-relaxed font-medium">Full visibility into every application and AI decision, ensuring you're always in control of your journey.</p>
                  </div>
                </div>
                
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-brand-violet/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-violet/20 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-brand-violet" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display font-bold mb-3">Innovation</h4>
                    <p className="text-app-muted text-base leading-relaxed font-medium">Constantly evolving AI models that learn from market trends to keep you ahead of the global competition.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-app-surface/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: 'Operational Mandate', 
              desc: 'Democratizing access to high-tier career opportunities through advanced automation and ethical AI practices.',
              icon: ShieldAlert,
              color: 'text-brand-blue',
              bg: 'bg-brand-blue/10',
              variant: 'evaluating' as const
            },
            { 
              title: 'Future Aspirations', 
              desc: 'Evolving into a comprehensive career lifecycle partner, from first application to executive leadership.',
              icon: Sparkles,
              color: 'text-brand-violet',
              bg: 'bg-brand-violet/10',
              variant: 'creating' as const
            },
            { 
              title: 'Strategic Intelligence', 
              desc: 'Providing data-driven insights into why certain roles are a better fit for your unique profile.',
              icon: Cpu,
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10',
              variant: 'dashboard' as const
            },
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[48px] glass border border-app-border card-shadow text-center group hover:bg-app-surface/50 transition-all overflow-hidden relative">
              <div className="aspect-[16/10] rounded-[32px] bg-app-surface/50 border border-app-border overflow-hidden mb-10 relative group-hover:border-brand-blue/30 transition-colors">
                <div className="absolute inset-0 p-8">
                  <AbstractUI variant={item.variant} className="w-full h-full" />
                </div>
              </div>
              <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}>
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">{item.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

import { Clock } from 'lucide-react';
