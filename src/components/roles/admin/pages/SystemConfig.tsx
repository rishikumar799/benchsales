import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Database, 
  Lock, 
  Zap, 
  Globe, 
  ShieldCheck,
  ChevronRight,
  Save
} from 'lucide-react';

export default function SystemConfig() {
  const [activePart, setActivePart] = useState('general');

  const menu = [
    { id: 'general', label: 'General Config', icon: Settings },
    { id: 'database', label: 'Database & Storage', icon: Database },
    { id: 'security', label: 'Security Protocols', icon: Lock },
    { id: 'ai', label: 'AI Engine Settings', icon: Zap },
    { id: 'network', label: 'API & Network', icon: Globe },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">System Configuration</h1>
          <p className="text-app-muted">Fine-tune platform parameters and security thresholds.</p>
        </div>
        <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Global Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePart(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
                activePart === item.id 
                  ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                  : 'text-app-muted hover:bg-app-surface hover:text-app-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activePart === item.id ? 'translate-x-1' : ''}`} />
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          <motion.div
            key={activePart}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[40px] glass border-app-border card-shadow space-y-8"
          >
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-app-surface rounded-full flex items-center justify-center mb-6 border border-app-border">
                <ShieldCheck className="w-8 h-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-app-text">{activePart.charAt(0).toUpperCase() + activePart.slice(1)} Controller</h2>
              <p className="text-app-muted mb-8">This module allows you to manually override core system behaviors.</p>
              
              <div className="w-full max-w-md space-y-4 text-left">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-app-bg border border-app-border/50">
                    <span className="text-sm font-bold text-app-muted">Threshold Parameter {i}</span>
                    <div className="w-10 h-5 rounded-full bg-brand-blue relative">
                       <div className="w-3 h-3 rounded-full bg-white absolute right-1 top-1 shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
