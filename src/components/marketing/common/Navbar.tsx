import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Sparkles, Moon, Sun, Zap, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const roles = [
    { name: 'User (Job Seeker / Student)', path: '/role/user' },
    { name: 'Agent', path: '/role/agent' },
    { name: 'Manager', path: '/role/manager' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight hidden sm:block">Bench Sales <span className="text-brand-blue">AI</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-all relative ${
                    active 
                      ? 'text-gradient' 
                      : 'text-app-muted hover:text-brand-blue'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="activeTabCap"
                      className="absolute -top-3 -right-3 rotate-[25deg] pointer-events-none"
                    >
                      <GraduationCap className="w-4 h-4 text-brand-blue" />
                    </motion.div>
                  )}
                </Link>
              );
            })}

            <div className="relative">
              <button
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-app-surface border border-app-border text-sm font-bold text-app-text hover:border-brand-blue transition-all"
              >
                Choose Role
                <ChevronDown className={`w-4 h-4 transition-transform ${isRoleOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isRoleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 glass border border-app-border rounded-2xl shadow-2xl overflow-hidden"
                  >
                    {roles.map((role) => (
                      <Link
                        key={role.name}
                        to={role.path}
                        onClick={() => setIsRoleOpen(false)}
                        className="block px-6 py-4 text-sm font-bold text-app-muted hover:text-brand-blue hover:bg-app-surface transition-all border-b border-app-border last:border-0"
                      >
                        {role.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl glass border border-app-border text-app-text hover:text-brand-blue transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 premium-gradient text-white text-sm font-bold rounded-full shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all active:scale-95"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-4">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl glass border border-app-border text-app-text"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl glass border border-app-border text-app-text"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-app-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-lg font-bold transition-all ${
                      active 
                        ? 'text-gradient' 
                        : 'text-app-muted hover:text-brand-blue'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-app-border">
                <p className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">Choose Role</p>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <Link
                      key={role.name}
                      to={role.path}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 rounded-xl bg-app-surface border border-app-border text-sm font-bold text-app-text hover:border-brand-blue transition-all"
                    >
                      {role.name}
                    </Link>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { navigate('/auth'); setIsOpen(false); }}
                className="w-full py-4 premium-gradient text-white font-bold rounded-full shadow-xl shadow-brand-blue/20"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
