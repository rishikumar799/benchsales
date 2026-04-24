import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, Moon, Sun, Zap, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

interface NavItemProps {
  name: string;
  path: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = React.memo(({ name, path, active, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={path}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="px-6 py-3 flex items-center justify-center group relative cursor-pointer"
    >
      <div className={`text-sm font-bold transition-all duration-300 relative ${
        active 
          ? 'bg-gradient-to-r from-brand-blue to-brand-violet bg-clip-text text-transparent scale-105' 
          : 'text-app-muted group-hover:text-brand-blue group-hover:scale-105'
      }`}>
        {/* The "Sticks" Animation - Corner L-shape on Bottom Right - Shorter lines */}
        <div className="absolute -right-2 -bottom-2 -left-2 -top-2 pointer-events-none overflow-hidden">
          <AnimatePresence>
            {(active || isHovered) && (
              <>
                {/* Vertical Line (Bottom Right rising up - half height) */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: '40%' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 bottom-0 w-[2px] bg-brand-blue z-10"
                />
                {/* Horizontal Line (Bottom Right going left - half width) */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40%' }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 bottom-0 h-[2px] bg-brand-blue z-10"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {name}

        {/* Graduation Cap - TOP LEFT with Zoom/Pop Animation - Tilted Left More */}
        <AnimatePresence>
          {(active || isHovered) && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -40 }}
              animate={{ opacity: 1, scale: 1, rotate: -25 }}
              exit={{ opacity: 0, scale: 0, rotate: -40 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20
              }}
              style={{ position: 'absolute', top: '-18px', left: '-16px' }}
              className="pointer-events-none z-30"
            >
              <div className="relative">
                <GraduationCap className="w-5 h-5 text-brand-blue drop-shadow-[0_4px_12px_rgba(59,130,246,0.6)]" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-brand-blue/20 blur-md rounded-full -z-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
});

export default function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ], []);

  const morePages = useMemo(() => [
    { name: 'How it works', path: '/how-it-works' },
    { name: 'Community', path: '/community' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ], []);

  const roles = useMemo(() => [
    { name: 'User (Job Seeker / Student)', path: '/role/user' },
    { name: 'Agent', path: '/role/agent' },
    { name: 'Manager', path: '/role/manager' },
  ], []);

  const isActive = useCallback((path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const pagesTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const rolesTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePagesEnter = () => {
    if (pagesTimeout.current) clearTimeout(pagesTimeout.current);
    setIsPagesOpen(true);
  };

  const handlePagesLeave = () => {
    pagesTimeout.current = setTimeout(() => setIsPagesOpen(false), 150);
  };

  const handleRolesEnter = () => {
    if (rolesTimeout.current) clearTimeout(rolesTimeout.current);
    setIsRoleOpen(true);
  };

  const handleRolesLeave = () => {
    rolesTimeout.current = setTimeout(() => setIsRoleOpen(false), 150);
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
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavItem 
                key={link.name} 
                name={link.name} 
                path={link.path} 
                active={isActive(link.path)} 
              />
            ))}

            <div 
              className="relative"
              onMouseEnter={handlePagesEnter}
              onMouseLeave={handlePagesLeave}
            >
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-app-surface border transition-all relative group overflow-visible ${
                  morePages.some(p => isActive(p.path)) 
                    ? 'border-brand-blue/30 bg-brand-blue/5 shadow-inner' 
                    : 'text-app-text border-app-border hover:border-brand-blue shadow-sm'
                }`}
              >
                <span className={`relative z-10 flex items-center gap-2 font-bold tracking-wide ${
                  morePages.some(p => isActive(p.path)) ? 'text-gradient' : ''
                }`}>
                  Pages
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isPagesOpen ? 'rotate-180' : ''} ${morePages.some(p => isActive(p.path)) ? 'text-brand-blue' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {isPagesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute left-0 mt-2 w-60 glass border border-app-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-2"
                  >
                    {morePages.map((page) => (
                      <Link
                        key={page.name}
                        to={page.path}
                        onClick={() => setIsPagesOpen(false)}
                        className={`block px-5 py-3.5 text-sm font-bold transition-all rounded-xl mb-1 last:mb-0 ${
                          isActive(page.path) 
                            ? 'text-brand-blue bg-brand-blue/10' 
                            : 'text-app-muted hover:text-brand-blue hover:bg-app-surface'
                        }`}
                      >
                        {page.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div 
              className="relative"
              onMouseEnter={handleRolesEnter}
              onMouseLeave={handleRolesLeave}
            >
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl bg-app-surface border transition-all relative group overflow-visible ${
                  roles.some(r => isActive(r.path))
                    ? 'border-brand-blue/30 bg-brand-blue/5 shadow-inner'
                    : 'text-app-text border-app-border hover:border-brand-blue shadow-sm'
                }`}
              >
                <span className={`relative z-10 flex items-center gap-2 font-bold tracking-wide ${
                  roles.some(r => isActive(r.path)) ? 'text-gradient' : ''
                }`}>
                  Choose Role
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''} ${roles.some(r => isActive(r.path)) ? 'text-brand-blue' : ''}`} />
                </span>
              </button>

              <AnimatePresence>
                {isRoleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-64 glass border border-app-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-50 p-2"
                  >
                    <div className="py-1">
                      {roles.map((role) => (
                        <Link
                          key={role.name}
                          to={role.path}
                          onClick={() => setIsRoleOpen(false)}
                          className={`block px-5 py-3.5 text-sm font-bold transition-all rounded-xl mb-1 last:mb-0 ${
                            isActive(role.path) 
                              ? 'text-brand-blue bg-brand-blue/10' 
                              : 'text-app-muted hover:text-brand-blue hover:bg-app-surface'
                          }`}
                        >
                          {role.name}
                        </Link>
                      ))}
                    </div>
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
                <p className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">More Pages</p>
                <div className="grid grid-cols-2 gap-2">
                  {morePages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.path}
                      onClick={() => setIsOpen(false)}
                      className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                        isActive(page.path) 
                          ? 'bg-brand-blue/10 border-brand-blue/30 text-brand-blue' 
                          : 'bg-app-surface border-app-border text-app-text'
                      }`}
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-app-border">
                <p className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">Choose Role</p>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <Link
                      key={role.name}
                      to={role.path}
                      onClick={() => setIsOpen(false)}
                      className={`block p-4 rounded-xl bg-app-surface border border-app-border text-sm font-bold transition-all ${
                        isActive(role.path)
                          ? 'border-brand-blue bg-brand-blue/10 text-brand-blue shadow-inner shadow-brand-blue/10'
                          : 'text-app-text hover:border-brand-blue'
                      }`}
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
