import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Moon, Sun, Zap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

interface NavItemProps {
  name: string;
  path: string;
  active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const NavItem: React.FC<NavItemProps> = React.memo(({ name, path, active, onClick }) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      className="px-3.5 py-2 flex items-center justify-center relative cursor-pointer"
    >
      <span className={`text-sm transition-all duration-300 ${
        active 
          ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
          : 'font-medium text-app-muted hover:bg-gradient-to-r hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:via-indigo-400 dark:hover:to-purple-400 hover:bg-clip-text hover:text-transparent'
      }`}>
        {name}
      </span>
    </Link>
  );
});

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-app-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}>
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-brand-blue/20">
              <Zap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight hidden sm:block">Aryx <span className="text-gradient">AI</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <NavItem 
              name="Home" 
              path="/" 
              active={isActive('/')} 
              onClick={handleHomeClick}
            />

            <NavItem 
              name="Applicant" 
              path="/role/applicant" 
              active={isActive('/role/applicant')} 
            />

            <NavItem 
              name="Recruiter" 
              path="/role/recruiter" 
              active={isActive('/role/recruiter')} 
            />

            <NavItem 
              name="BDM" 
              path="/role/bdm" 
              active={isActive('/role/bdm')} 
            />

            <NavItem 
              name="Contact Us" 
              path="/contact" 
              active={isActive('/contact')} 
            />

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl glass border border-app-border text-app-text hover:text-brand-blue transition-all cursor-pointer"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2.5 premium-gradient text-white text-sm font-bold rounded-full shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all active:scale-95 cursor-pointer"
            >
              Get Started
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
              <Link
                to="/"
                onClick={(e) => {
                  setIsOpen(false);
                  if (location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`block text-lg transition-all ${
                  isActive('/') 
                    ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                    : 'text-app-muted font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Home
              </Link>

              <Link
                to="/role/applicant"
                onClick={() => setIsOpen(false)}
                className={`block text-lg transition-all ${
                  isActive('/role/applicant') 
                    ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                    : 'text-app-muted font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Applicant
              </Link>

              <Link
                to="/role/recruiter"
                onClick={() => setIsOpen(false)}
                className={`block text-lg transition-all ${
                  isActive('/role/recruiter') 
                    ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                    : 'text-app-muted font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Recruiter
              </Link>

              <Link
                to="/role/bdm"
                onClick={() => setIsOpen(false)}
                className={`block text-lg transition-all ${
                  isActive('/role/bdm') 
                    ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                    : 'text-app-muted font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                BDM
              </Link>

              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={`block text-lg transition-all ${
                  isActive('/contact') 
                    ? 'font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent' 
                    : 'text-app-muted font-medium hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Contact Us
              </Link>

              <button
                onClick={() => { navigate('/auth'); setIsOpen(false); }}
                className="w-full py-4 premium-gradient text-white font-bold rounded-full shadow-xl shadow-brand-blue/20"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
