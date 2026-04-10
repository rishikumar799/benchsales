import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ArrowLeft, Mail, Lock, User, Github } from 'lucide-react';
import { UserRole } from '../types';

interface AuthPageProps {
  onBack: () => void;
  onLogin: (role: UserRole) => void;
}

export default function AuthPage({ onBack, onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 blue-gradient p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] border-[40px] border-white rounded-full" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] border-[20px] border-white rounded-full" />
        </div>

        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors z-10"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </button>

        <div className="z-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <Zap className="text-brand-blue w-10 h-10" />
          </div>
          <h1 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
            Join the future of <br /> job searching.
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Experience the power of autonomous AI agents working 24/7 to land your dream role.
          </p>
        </div>

        <div className="z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-blue bg-gray-800 overflow-hidden">
                <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt="User" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <span className="text-white/60 text-sm font-medium">Joined by 2,400+ students</span>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 p-8 md:p-20 flex flex-col justify-center bg-dark-bg">
        <div className="max-w-md mx-auto w-full">
          <div className="md:hidden flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Zap className="text-brand-blue w-6 h-6" />
              <span className="text-xl font-display font-bold">Bench Sales AI</span>
            </div>
            <button onClick={onBack} className="text-gray-400"><ArrowLeft className="w-6 h-6" /></button>
          </div>

          <h2 className="text-3xl font-display font-bold mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-gray-400 mb-8">
            {isLogin ? 'Enter your details to access your dashboard' : 'Start your journey with Bench Sales AI today'}
          </p>

          {!isLogin && (
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(['student', 'agent', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`py-3 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                    selectedRole === role 
                      ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' 
                      : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(isLogin ? (selectedRole || 'student') : selectedRole); }}>
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue transition-colors"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-blue transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-4 blue-gradient text-white font-bold rounded-2xl shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-transform active:scale-[0.98] mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-dark-bg px-4 text-gray-500 font-bold tracking-widest">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5" /> <span className="text-sm font-bold">GitHub</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-4 glass rounded-2xl hover:bg-white/10 transition-colors">
              <Zap className="w-5 h-5 text-yellow-500" /> <span className="text-sm font-bold">Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-blue font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
