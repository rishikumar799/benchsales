import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-app-bg border-t border-app-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">Bench Sales</span>
            </div>
            <p className="text-app-muted text-sm leading-relaxed mb-6">
              Revolutionizing the job market with AI-powered automation. Connecting students, agents, and managers in a seamless ecosystem.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl glass border border-app-border flex items-center justify-center text-app-muted hover:text-brand-blue hover:border-brand-blue transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-app-text mb-6">Platform</h4>
            <ul className="space-y-4">
              {['Home', 'About Us', 'Services', 'Contact'].map((item) => (
                <li key={item}>
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-app-muted text-sm hover:text-brand-blue transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-app-text mb-6">Roles</h4>
            <ul className="space-y-4">
              {['Job Seeker', 'Agent', 'Manager'].map((item) => (
                <li key={item}>
                  <Link to={`/role/${item.toLowerCase().replace(' ', '-')}`} className="text-app-muted text-sm hover:text-brand-blue transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-bold uppercase tracking-widest text-app-text mb-6">Connect</h4>
            <p className="text-app-muted text-sm leading-relaxed mb-6">
              Stay updated with our latest features and community stories. Follow us on social media for the latest news.
            </p>
            <div className="p-6 rounded-2xl bg-brand-blue/5 border border-brand-blue/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center shadow-lg shadow-brand-blue/20">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-bold">Innovation first</span>
              </div>
              <p className="text-xs text-app-muted leading-relaxed">
                Join our platform and experience the future of recruitment automation. Built for the modern professional.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-app-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-app-muted text-xs font-medium">
            © 2024 Bench Sales AI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-app-muted text-xs hover:text-brand-blue transition-colors">Privacy Policy</a>
            <a href="#" className="text-app-muted text-xs hover:text-brand-blue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
