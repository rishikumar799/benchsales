import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, MousePointer2, FileText, CheckCircle2, BarChart3 } from 'lucide-react';

interface AbstractUIProps {
  variant: 'creating' | 'evaluating' | 'refining' | 'resume' | 'letter' | 'dashboard';
  className?: string;
}

export default function AbstractUI({ variant, className = "" }: AbstractUIProps) {
  const renderContent = () => {
    switch (variant) {
      case 'creating':
        return (
          <div className="w-full h-full bg-emerald-50/50 dark:bg-emerald-500/5 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="w-24 h-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-2" />
            <div className="bg-white dark:bg-app-surface border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-3 mb-4">
                <span className="text-emerald-400 font-bold text-xs">B</span>
                <span className="text-emerald-400 italic text-xs">I</span>
                <span className="text-emerald-400 underline text-xs">S</span>
                <div className="w-px h-3 bg-emerald-100 dark:bg-emerald-900" />
                <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900" />
              </div>
              <div className="space-y-3">
                <div className="w-full h-4 bg-emerald-400/20 rounded-lg" />
                <div className="w-3/4 h-4 bg-emerald-400/20 rounded-lg" />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl" />
          </div>
        );
      case 'evaluating':
        return (
          <div className="w-full h-full bg-blue-50/50 dark:bg-blue-500/5 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="space-y-2 mb-4">
              <div className="w-2/3 h-4 bg-blue-400/20 rounded-lg" />
              <div className="w-full h-4 bg-blue-400/20 rounded-lg" />
              <div className="w-1/2 h-4 bg-blue-400/20 rounded-lg" />
            </div>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full w-3/4" />
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="w-12 h-2 bg-blue-100 dark:bg-blue-900/50 rounded-full" />
            </div>
          </div>
        );
      case 'refining':
        return (
          <div className="w-full h-full bg-violet-50/50 dark:bg-violet-500/5 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="bg-violet-100/50 dark:bg-violet-900/20 rounded-2xl p-4 mb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="w-8 h-1 bg-violet-300 rounded-full" />
                <div className="w-4 h-4 text-violet-400">×</div>
              </div>
              <div className="w-full h-1 bg-violet-200 rounded-full" />
            </div>
            <div className="bg-white dark:bg-app-surface border border-violet-100 dark:border-violet-900/30 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-3">
                  <span className="text-violet-400 font-bold text-xs">B</span>
                  <span className="text-violet-400 italic text-xs">I</span>
                  <span className="text-violet-400 underline text-xs">S</span>
                </div>
                <div className="w-3 h-3 text-violet-300">✎</div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-violet-100 dark:bg-violet-900/50 rounded-full" />
                <div className="w-3/4 h-2 bg-violet-100 dark:bg-violet-900/50 rounded-full" />
              </div>
            </div>
          </div>
        );
      case 'resume':
        return (
          <div className="w-full h-full bg-app-surface/50 rounded-3xl p-8 flex gap-6 relative overflow-hidden">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-blue" />
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-app-border rounded-full" />
                <div className="w-full h-2 bg-app-border rounded-full" />
                <div className="w-3/4 h-2 bg-app-border rounded-full" />
              </div>
              <div className="pt-4 flex gap-2">
                <div className="px-3 py-1 rounded-full bg-brand-blue/10 text-[10px] font-bold text-brand-blue uppercase tracking-wider">React</div>
                <div className="px-3 py-1 rounded-full bg-brand-blue/10 text-[10px] font-bold text-brand-blue uppercase tracking-wider">Node.js</div>
              </div>
            </div>
            <div className="w-px h-full bg-app-border" />
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-2 border-dashed border-brand-blue/30 flex items-center justify-center mb-4"
              >
                <Sparkles className="w-8 h-8 text-brand-blue" />
              </motion.div>
              <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest">AI Optimization</div>
            </div>
          </div>
        );
      case 'letter':
        return (
          <div className="w-full h-full bg-brand-violet/5 rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <div className="w-full h-full bg-white dark:bg-app-surface border border-app-border rounded-2xl p-6 shadow-xl relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <div className="w-24 h-3 bg-brand-violet/20 rounded-full" />
                  <div className="w-16 h-2 bg-app-border rounded-full" />
                </div>
                <div className="w-10 h-10 rounded-full bg-brand-violet/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-brand-violet" />
                </div>
              </div>
              <div className="space-y-3">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  className="h-2 bg-app-border rounded-full" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '90%' }}
                  transition={{ delay: 0.1 }}
                  className="h-2 bg-app-border rounded-full" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '95%' }}
                  transition={{ delay: 0.2 }}
                  className="h-2 bg-brand-violet/30 rounded-full" 
                />
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  transition={{ delay: 0.3 }}
                  className="h-2 bg-app-border rounded-full" 
                />
              </div>
              <div className="mt-8 flex justify-end">
                <div className="w-20 h-8 rounded-lg bg-brand-violet text-white text-[10px] font-bold flex items-center justify-center uppercase tracking-widest">Sign AI</div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-violet/10 rounded-full blur-3xl" />
          </div>
        );
      case 'dashboard':
        return (
          <div className="w-full h-full bg-app-surface/30 rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-app-surface border border-app-border shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div className="text-[8px] font-bold text-app-muted uppercase tracking-wider">Status</div>
                  </div>
                  <div className="w-full h-1.5 bg-app-border rounded-full" />
                </div>
              ))}
            </div>
            <div className="mt-auto p-4 rounded-2xl bg-brand-blue text-white shadow-lg shadow-brand-blue/20">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-bold uppercase tracking-widest">Success Rate</div>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-end gap-2">
                <div className="text-2xl font-display font-bold">94%</div>
                <div className="text-[10px] opacity-70 mb-1">+12% this week</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {renderContent()}
    </div>
  );
}
