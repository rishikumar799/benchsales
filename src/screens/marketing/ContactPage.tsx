import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';
import SectionWrapper from '../../components/marketing/common/SectionWrapper';
import CTAButton from '../../components/marketing/common/CTAButton';
import Navbar from '../../components/marketing/common/Navbar';
import Footer from '../../components/marketing/common/Footer';

export default function ContactPage({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
    alert('Thank you for your message! We will get back to you soon.');
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <div className="pt-32 pb-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-8 tracking-tight">Get In Touch</h1>
          <p className="text-xl text-app-muted leading-relaxed font-medium">
            Have questions? We're here to help you automate your career success.
          </p>
        </motion.div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 tracking-tight">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, label: 'Email Us', value: 'support@benchsales.ai', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                  { icon: Phone, label: 'Call Us', value: '+1 (555) 000-0000', color: 'text-violet-500', bg: 'bg-violet-500/10' },
                  { icon: MapPin, label: 'Visit Us', value: '123 AI Way, Silicon Valley, CA', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-app-muted uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-lg font-bold text-app-text">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[32px] glass border border-app-border card-shadow relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-brand-blue/5 rounded-full blur-3xl" />
              <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-blue" />
                Live Chat
              </h3>
              <p className="text-app-muted text-sm leading-relaxed mb-6">
                Our AI support agent is available 24/7 to answer your immediate questions.
              </p>
              <button className="text-brand-blue font-bold text-sm hover:underline flex items-center gap-2">
                Start Chatting <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="glass border border-app-border rounded-[48px] p-8 md:p-12 card-shadow">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-app-muted uppercase tracking-widest ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="John Doe"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-app-surface border border-app-border rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-blue transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-app-muted uppercase tracking-widest ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="john@example.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-app-surface border border-app-border rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-blue transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-app-muted uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="How can we help you?"
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-app-surface border border-app-border rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-brand-blue transition-all resize-none"
                />
              </div>
              <CTAButton type="submit" className="w-full py-5">Send Message</CTAButton>
            </form>
          </div>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
