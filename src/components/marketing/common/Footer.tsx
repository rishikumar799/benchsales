import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-app-bg border-t border-app-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1 - ARYX AI */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg premium-gradient flex items-center justify-center">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight">ARYX <span className="text-gradient">AI</span></span>
            </div>
            <p className="text-app-muted text-sm leading-relaxed font-medium">
              ARYX AI is an intelligent career platform that automates resume optimization, job discovery, applications, and recruitment workflows through enterprise-grade AI.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Twitter, href: 'https://twitter.com', label: 'X (Twitter)' },
                { icon: Github, href: 'https://github.com', label: 'GitHub' },
                { icon: Mail, href: 'mailto:support@aryxai.com', label: 'Email' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl glass border border-app-border flex items-center justify-center text-app-muted hover:text-brand-blue hover:border-brand-blue/40 transition-all hover:scale-105"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-app-text mb-6">Platform</h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/role/applicant" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Applicant
                </Link>
              </li>
              <li>
                <Link to="/role/recruiter" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Recruiter
                </Link>
              </li>
              <li>
                <Link to="/role/bdm" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  BDM
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-app-text mb-6">Support</h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/faq" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help-center" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-app-text mb-6">Legal</h4>
            <ul className="space-y-3.5">
              <li>
                <Link to="/privacy-policy" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-app-muted text-sm font-medium hover:text-brand-blue transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-app-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-app-muted">
          <p>© 2026 ARYX AI. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-brand-blue transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-brand-blue transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

