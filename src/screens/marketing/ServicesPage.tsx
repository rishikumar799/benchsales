import React from 'react';
import { motion } from 'motion/react';
import { Users, Zap, Shield, Briefcase, BarChart3, Globe, Sparkles, Phone, CheckCircle2 } from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import AbstractUI from '../../components/marketing/common/AbstractUI';

export default function ServicesPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const services = [
    {
      role: 'For Users (Job Seekers)',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      variant: 'resume' as const,
      features: [
        'Automated Job Applications',
        'AI Resume Optimization',
        'Interview Scheduling Assistant',
        'Real-time Application Tracking',
        'Market Salary Insights'
      ]
    },
    {
      role: 'For Agents',
      icon: Zap,
      gradient: 'from-violet-500 to-purple-500',
      variant: 'dashboard' as const,
      features: [
        'Candidate Pipeline Management',
        'Automated Outreach Tools',
        'Performance Analytics',
        'Bulk Application Management',
        'Client Reporting Dashboard'
      ]
    },
    {
      role: 'For Managers',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-500',
      variant: 'evaluating' as const,
      features: [
        'Team Performance Oversight',
        'Global System Configuration',
        'Revenue & Billing Analytics',
        'Security & Access Control',
        'AI Model Fine-tuning'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      {/* Hero Section */}
      <div className="pt-40 pb-24 px-4 relative overflow-hidden bg-app-surface/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-brand-violet rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-blue rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tight">
              Comprehensive <span className="text-gradient">AI Services</span>
            </h1>
            <p className="text-xl text-app-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Tailored autonomous solutions designed to empower job seekers, recruitment agents, and hiring managers.
            </p>
          </motion.div>
        </div>
      </div>

      <SectionWrapper>
        <div className="space-y-32">
          {services.map((service, i) => (
            <div key={i} className={`flex flex-col lg:flex-row items-center gap-20 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white mb-8 shadow-xl`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-display font-bold mb-8 tracking-tight">{service.role}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-app-surface border border-app-border flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-brand-blue" />
                      </div>
                      <span className="text-sm font-bold text-app-muted uppercase tracking-widest">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative">
                <div className={`absolute -inset-4 bg-gradient-to-br ${service.gradient} opacity-10 blur-3xl rounded-full`} />
                <div className="relative glass border border-app-border rounded-[48px] p-8 card-shadow aspect-[16/10] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 p-6 flex items-center justify-center">
                    <AbstractUI variant={service.variant} className="w-full h-full scale-95" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-app-surface/50">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-display font-bold mb-4 tracking-tight">Enterprise Features</h2>
          <p className="text-app-muted max-w-2xl mx-auto">Scalable solutions for large organizations and recruitment firms.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Global Reach', icon: Globe, desc: 'Access job boards and talent pools across 50+ countries.', variant: 'creating' as const },
            { title: 'Advanced Analytics', icon: BarChart3, desc: 'Deep insights into market trends and team performance.', variant: 'dashboard' as const },
            { title: '24/7 Support', icon: Phone, desc: 'Dedicated account managers and technical support team.', variant: 'evaluating' as const },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[40px] glass border border-app-border card-shadow group hover:bg-app-surface/50 transition-all overflow-hidden">
              <div className="aspect-[16/10] rounded-3xl bg-app-surface/50 border border-app-border overflow-hidden mb-8 relative group-hover:border-brand-blue/30 transition-colors">
                <div className="absolute inset-0 p-4">
                  <AbstractUI variant={item.variant} className="w-full h-full" />
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-app-surface border border-app-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="text-xl font-bold mb-4">{item.title}</h4>
              <p className="text-app-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
