import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Zap, Shield, CheckCircle2, ArrowRight, Sparkles, Trophy, Target, BarChart3 } from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import CTAButton from '../../components/marketing/common/CTAButton';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';

interface RolePageProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function RolePage({ theme, toggleTheme }: RolePageProps) {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

  const roleContent: Record<string, any> = {
    user: {
      title: 'For Job Seekers & Students',
      subtitle: 'Your personal AI career agent.',
      description: 'Stop spending hours on job boards. Let our AI handle the search, matching, and applications. Focus on your skills while we focus on your placement.',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      benefits: [
        { title: 'Skills Gap Analyzer', desc: 'Get smart recommendations for certifications or training based on your target roles.', icon: Target },
        { title: 'AI Interview Prep', desc: 'Mock interviews with AI feedback modules to sharpen your communication before the real call.', icon: Sparkles },
        { title: 'Placement Dashboard', desc: 'Real-time tracking of applications sent, responses received, and your interview pipeline.', icon: BarChart3 },
      ],
      features: [
        'AI Resume Tailoring',
        'Document Management (Visa/Certs)',
        'Skill Gap Analysis',
        'Auto-Apply Automation',
        'Interview Pipeline Tracking',
        'Training Records Vault'
      ]
    },
    agent: {
      title: 'For Recruitment Agents',
      subtitle: 'Scale your placement pipeline.',
      description: 'Build intelligence into your agent workflow. Automate screening, matching, and outreach to scale your operations.',
      icon: Zap,
      gradient: 'from-violet-500 to-purple-500',
      benefits: [
        { title: 'Hot-Lead Scoring', desc: 'Vendor and client list management with AI-powered fit scoring before you even run a campaign.', icon: Trophy },
        { title: 'Bulk Campaigns', desc: 'Run automated job application campaigns with tracking across vendor lists and job boards.', icon: Zap },
        { title: 'Outreach Templates', desc: 'Seamless Email and SMS templates for automated vendor outreach and candidate engagement.', icon: Users },
      ],
      features: [
        'AI-Powered Fit Scoring',
        'Bulk Outreach Engine',
        'Email/SMS Automation',
        'Performance Dashboards',
        'Vendor List Management',
        'Hot-Lead Analytics'
      ]
    },
    manager: {
      title: 'For Platform Managers',
      subtitle: 'Global oversight & bench control.',
      description: 'The command center for staffing firms. Manage bench metrics, aging, and costs with surgical precision.',
      icon: Shield,
      gradient: 'from-emerald-500 to-teal-500',
      benefits: [
        { title: 'Key Bench Metrics', desc: 'Monitor headcount, bench cost, and time-to-placement—the numbers staffing firms live and die by.', icon: BarChart3 },
        { title: 'Revenue Forecasting', desc: 'Scale with confidence using advanced revenue forecasting and automated commission tracking.', icon: Target },
        { title: 'Operational Suite', desc: 'Integrated invoicing, timesheet management, and financial oversight in one place.', icon: Shield },
      ],
      features: [
        'Bench Aging Distribution',
        'Timesheet Management',
        'Revenue Forecasting',
        'Commission Tracking',
        'Invoicing & Billing',
        'Team Performance Metrics'
      ]
    }
  };

  const content = roleContent[role || 'user'] || roleContent.user;

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="pt-32 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto"
        >
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${content.gradient} flex items-center justify-center text-white mx-auto mb-8 shadow-2xl`}>
            <content.icon className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 tracking-tight">{content.title}</h1>
          <p className="text-2xl text-brand-blue font-bold mb-8">{content.subtitle}</p>
          <p className="text-xl text-app-muted leading-relaxed font-medium max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.benefits.map((benefit: any, i: number) => (
            <div key={i} className="p-8 rounded-[32px] glass border border-app-border card-shadow group hover:bg-app-surface/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-app-surface border border-app-border flex items-center justify-center mb-6 group-hover:border-brand-blue transition-colors">
                <benefit.icon className="w-6 h-6 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-app-muted text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-app-surface/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-display font-bold mb-8 tracking-tight">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {content.features.map((feature: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-sm font-bold text-app-text uppercase tracking-widest">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-6">
              <CTAButton onClick={() => navigate('/auth')}>Get Started Now</CTAButton>
              <CTAButton variant="outline" onClick={() => navigate('/contact')}>Contact Sales</CTAButton>
            </div>
          </div>
          <div className="relative">
            <div className={`absolute -inset-4 bg-gradient-to-br ${content.gradient} opacity-10 blur-3xl rounded-full`} />
            <div className="relative glass border border-app-border rounded-[48px] p-12 card-shadow aspect-square flex items-center justify-center">
              <Trophy className="w-32 h-32 text-app-muted/10" />
            </div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}

import { Settings } from 'lucide-react';
