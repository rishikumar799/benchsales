import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, HelpCircle, Sparkles, ArrowRight, Shield, Zap, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';

export default function FaqPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    { id: 'all', label: 'All Questions' },
    { id: 'general', label: 'General & Platform' },
    { id: 'automation', label: 'Job Search & Automation' },
    { id: 'recruitment', label: 'Recruiter & BDM' },
    { id: 'security', label: 'Security & Anti-Ban' },
  ];

  const faqItems = [
    {
      category: 'general',
      question: 'What is ARYX AI and how does it work?',
      answer: 'ARYX AI is an autonomous career agent that handles job sourcing, resume customization, application submissions, and candidate tracking end-to-end. You upload your master resume and set career preferences, and your AI agent automatically finds and applies to top matching roles.'
    },
    {
      category: 'general',
      question: 'Can I use ARYX AI for free?',
      answer: 'Yes! ARYX AI offers a free tier that allows candidates to experience autonomous job matching and resume tailoring. You can upgrade anytime for higher application volume, advanced recruiter tools, or dedicated BDM workflows.'
    },
    {
      category: 'automation',
      question: 'How does ARYX AI tailor my resume for each job?',
      answer: 'Our neural language model parses the target job description to extract key skill requirements, ATS keywords, and required qualifications. It then dynamically rewrites bullet points from your master profile to maximize keyword alignment without exaggerating your experience.'
    },
    {
      category: 'automation',
      question: 'Can I review applications before they are submitted?',
      answer: 'Yes. You can switch between Full Autopilot mode (where the AI submits matches automatically) and Approval mode (where ARYX pre-generates tailored applications and waits for your single-tap approval).'
    },
    {
      category: 'security',
      question: 'Will my LinkedIn or job board accounts get flagged or banned?',
      answer: 'No. ARYX AI utilizes proprietary Anti-Ban Technology that mimics natural human browsing behavior, randomized application pacing, and rate-limiting to stay strictly within platform guidelines.'
    },
    {
      category: 'security',
      question: 'How is my personal data protected?',
      answer: 'We enforce enterprise-grade AES-256 encryption for data at rest and TLS 1.3 in transit. We comply with GDPR and CCPA standards, and we never sell candidate personal data to third parties.'
    },
    {
      category: 'recruitment',
      question: 'How does ARYX AI benefit recruiters and agencies?',
      answer: 'Recruiters use ARYX to automate candidate sourcing, run bulk submission campaigns, score candidate fit before client outreach, and track pipeline metrics in real-time.'
    },
    {
      category: 'recruitment',
      question: 'What features are available for Business Development Managers (BDMs)?',
      answer: 'BDMs get access to account requisition tracking, candidate submission approvals, client billing oversight, bench aging analytics, and automated revenue forecasting.'
    }
  ];

  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Hero */}
      <div className="pt-36 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Breadcrumbs */}
          <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-app-muted mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <span className="text-app-text">FAQ</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-widest mb-6">
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-app-muted text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-10">
              Find instant answers regarding ARYX AI features, resume tailoring, account security, and recruiter automation.
            </p>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. resume tailoring, anti-ban, pricing)..."
                className="w-full bg-app-surface border border-app-border rounded-2xl py-4.5 pl-14 pr-6 text-sm focus:outline-none focus:border-brand-blue/50 transition-all card-shadow"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <SectionWrapper>
        {/* Category Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {faqCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                  : 'glass border border-app-border text-app-muted hover:text-app-text'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 glass border border-app-border rounded-3xl p-8">
              <p className="text-app-muted font-medium mb-4">No matching questions found for "{searchQuery}".</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-brand-blue font-bold text-sm hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index}
                className="rounded-2xl glass border border-app-border overflow-hidden card-shadow transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between font-display font-bold text-lg cursor-pointer hover:text-brand-blue transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-app-muted transition-transform duration-300 shrink-0 ml-4 ${openIndex === index ? 'rotate-180 text-brand-blue' : ''}`} />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-app-muted text-sm leading-relaxed font-medium border-t border-app-border/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-20 max-w-3xl mx-auto text-center p-10 rounded-3xl glass border border-app-border card-shadow relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-6 h-6 text-brand-blue" />
          </div>
          <h3 className="text-2xl font-display font-bold mb-2">Still have questions?</h3>
          <p className="text-app-muted text-sm font-medium mb-6">Can't find what you're looking for? Reach out directly to our support team.</p>
          <button 
            onClick={() => navigate('/contact')}
            className="px-6 py-3 premium-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/20 hover:scale-105 transition-transform cursor-pointer"
          >
            Contact Support Team
          </button>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
