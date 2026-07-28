import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, User, Users, Shield, Zap, MessageSquare, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';

export default function HelpCenterPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      title: 'Getting Started',
      desc: 'Learn how to create your account, configure settings, and launch your first AI agent.',
      icon: Zap,
      articleCount: 6,
      articles: [
        'Quickstart Guide for Candidates',
        'How to Upload & Parse Your Master Resume',
        'Setting Up Career Preferences & Target Titles'
      ]
    },
    {
      title: 'Candidate Automation',
      desc: 'Master AI resume tailoring, job matching parameters, and application pacing.',
      icon: User,
      articleCount: 8,
      articles: [
        'Understanding AI Resume Tailoring & Fit Scoring',
        'Autopilot Mode vs. Approval Mode',
        'Managing Submitted Applications & Responses'
      ]
    },
    {
      title: 'Recruiter & BDM Portal',
      desc: 'Tools for talent acquisition agencies, candidate pipelines, and account management.',
      icon: Users,
      articleCount: 7,
      articles: [
        'Bulk Candidate Submission Workflows',
        'Managing Client Requisitions & Bench Aging',
        'Setting Up Automated Vendor Outreach'
      ]
    },
    {
      title: 'Security & Anti-Ban',
      desc: 'Understand platform security protocols, rate-limiting rules, and data privacy.',
      icon: Shield,
      articleCount: 5,
      articles: [
        'How Anti-Ban Technology Protects Your Accounts',
        'Data Encryption & GDPR Compliance Specs',
        'Managing Connected Account Permissions'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <div className="pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-app-muted mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-app-text">Help Center</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Documentation & Guides</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              How Can We <span className="text-gradient">Help You?</span>
            </h1>
            <p className="text-app-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              Explore step-by-step guides, troubleshooting articles, and system documentation for ARYX AI.
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles (e.g. resume upload, anti-ban, recruiter portal)..."
                className="w-full bg-app-surface border border-app-border rounded-2xl py-4.5 pl-14 pr-6 text-sm focus:outline-none focus:border-brand-blue/50 transition-all card-shadow"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <SectionWrapper>
        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {helpCategories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl glass border border-app-border card-shadow hover:border-brand-blue/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center">
                    <cat.icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <span className="text-xs font-bold text-app-muted px-3 py-1 rounded-full bg-app-surface border border-app-border">
                    {cat.articleCount} Articles
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold mb-3">{cat.title}</h3>
                <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">{cat.desc}</p>

                <div className="space-y-3 pt-4 border-t border-app-border/50">
                  {cat.articles.map((art, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-app-text hover:text-brand-blue cursor-pointer transition-colors group">
                      <FileText className="w-4 h-4 text-brand-blue shrink-0" />
                      <span className="font-medium group-hover:underline">{art}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl glass border border-app-border card-shadow text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-500" />
            </div>
            <h4 className="font-display font-bold text-xl mb-2">24/7 Live Support</h4>
            <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">Chat directly with our automated AI assistant or request human agent assistance.</p>
            <button onClick={() => navigate('/contact')} className="text-brand-blue font-bold text-sm hover:underline inline-flex items-center gap-1">
              Start Live Chat <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 rounded-3xl glass border border-app-border card-shadow text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-violet-500" />
            </div>
            <h4 className="font-display font-bold text-xl mb-2">Frequently Asked Questions</h4>
            <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">Browse our categorized FAQ database for quick self-service solutions.</p>
            <button onClick={() => navigate('/faq')} className="text-brand-blue font-bold text-sm hover:underline inline-flex items-center gap-1">
              View FAQ Page <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-8 rounded-3xl glass border border-app-border card-shadow text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-display font-bold text-xl mb-2">System Status</h4>
            <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">All systems operational with 99.8% monthly uptime across job networks.</p>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
