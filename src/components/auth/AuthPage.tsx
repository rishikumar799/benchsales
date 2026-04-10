import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowLeft, Mail, Lock, User, Phone, ShieldCheck, Key, ArrowRight } from 'lucide-react';
import { UserRole } from '../../types';
import ThemeToggle from '../common/ThemeToggle';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (role: UserRole, isApproved: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function AuthPage({ onBack, onLogin, theme, toggleTheme }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [showApprovalPending, setShowApprovalPending] = useState(false);
  const [secretCode, setSecretCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const SECRET_SUBADMIN_CODE = "BENCH_ADMIN_2024"; 
  
  const ADMIN_EMAIL = "admin@benchsales.ai";
  const ADMIN_PASS = "admin123";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRole === 'manager' && secretCode !== SECRET_SUBADMIN_CODE) {
      setError('Invalid manager secret code.');
      return;
    }

    if (!isLogin) {
      // Signup logic
      setShowApprovalPending(true);
    } else {
      // Login logic
      if (selectedRole === 'admin') {
        if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
          onLogin('admin', true);
        } else {
          setError('Invalid admin credentials.');
        }
        return;
      }

      // For UI purpose, allow login
      onLogin(selectedRole, true);
    }
  };

  if (showApprovalPending) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-md w-full p-8 md:p-12 rounded-[40px] glass border-app-border text-center card-shadow"
        >
          <div className="w-20 h-20 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="w-10 h-10 text-brand-blue" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Approval Pending</h2>
          <p className="text-app-muted mb-8 leading-relaxed">
            Thank you for signing up! Your request has been sent to our administrators. 
            We will contact you at the provided phone number for a quick follow-up before approving your access.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-4 premium-gradient text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
          >
            Back to Home <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 premium-gradient p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-20%] w-[100%] h-[100%] border-[60px] border-white/20 rounded-full" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-30%] left-[-20%] w-[120%] h-[120%] border-[30px] border-white/10 rounded-full" 
          />
        </div>

        <div className="flex items-center justify-between z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-all hover:-translate-x-1"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-2xl"
          >
            <Zap className="text-brand-blue w-12 h-12" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-display font-bold text-white mb-8 leading-tight tracking-tight"
          >
            The Future of <br /> Job Search is <br /> <span className="text-white/60 italic">Autonomous.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 text-xl max-w-md leading-relaxed"
          >
            Join thousands of professionals using AI to automate their career growth.
          </motion.p>
        </div>

        <div className="z-10 flex items-center gap-6">
          <div className="flex -space-x-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, zIndex: 10 }}
                className="w-12 h-12 rounded-full border-4 border-white/20 bg-gray-800 overflow-hidden cursor-pointer"
              >
                <img src={`https://picsum.photos/seed/${i+20}/100/100`} alt="User" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
          <div className="text-white/80">
            <div className="text-lg font-bold">2,400+</div>
            <div className="text-xs font-medium uppercase tracking-widest opacity-60">Active Agents</div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-6 md:p-12 lg:p-24 flex flex-col justify-center bg-app-bg relative overflow-y-auto">
        <div className="max-w-md mx-auto w-full py-12">
          <div className="lg:hidden flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Zap className="text-brand-blue w-8 h-8" />
              <span className="text-2xl font-display font-bold tracking-tight">Bench Sales</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              <button onClick={onBack} className="text-app-muted"><ArrowLeft className="w-6 h-6" /></button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-4xl font-display font-bold mb-3 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-app-muted mb-10 text-lg">
              {isLogin ? 'Sign in to manage your AI agents' : 'Start your autonomous job search today'}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8"
          >
            {(['student', 'agent', 'manager', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => { setSelectedRole(role); setError(''); }}
                className={`py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.1em] border-2 transition-all ${
                  selectedRole === role 
                    ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-lg shadow-brand-blue/5' 
                    : 'border-app-border bg-app-surface text-app-muted hover:border-brand-blue/30'
                }`}
              >
                {role}
              </button>
            ))}
          </motion.div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      className="w-full bg-app-surface border-2 border-app-border rounded-2xl py-5 pl-14 pr-5 text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted group-focus-within:text-brand-blue transition-colors" />
                    <input 
                      type="tel" 
                      required
                      placeholder="Phone Number"
                      className="w-full bg-app-surface border-2 border-app-border rounded-2xl py-5 pl-14 pr-5 text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedRole === 'manager' && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group"
              >
                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-violet group-focus-within:text-brand-violet transition-colors" />
                <input 
                  type="password" 
                  required
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  placeholder="Manager Secret Code"
                  className="w-full bg-brand-violet/5 border-2 border-brand-violet/20 rounded-2xl py-5 pl-14 pr-5 text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand-violet transition-all"
                />
              </motion.div>
            )}

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-app-surface border-2 border-app-border rounded-2xl py-5 pl-14 pr-5 text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-app-muted group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-app-surface border-2 border-app-border rounded-2xl py-5 pl-14 pr-5 text-app-text placeholder:text-app-muted focus:outline-none focus:border-brand-blue transition-all"
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm font-bold pl-2"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full py-5 premium-gradient text-white font-bold rounded-2xl shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 text-lg"
            >
              {isLogin ? 'Sign In' : 'Request Access'} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <p className="mt-10 text-center text-app-muted font-medium">
            {isLogin ? "New to Bench Sales?" : "Already have an account?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-brand-blue font-bold hover:underline transition-all"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
