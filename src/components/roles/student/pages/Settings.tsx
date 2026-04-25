import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Lock, 
  User, 
  Shield, 
  Globe, 
  Zap, 
  Settings as SettingsIcon,
  Check,
  ChevronRight
} from 'lucide-react';

export default function StudentSettings() {
  const [activePart, setActivePart] = useState('account');

  const menu = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'agent', label: 'AI Agent Config', icon: Zap },
    { id: 'billing', label: 'Subscription', icon: Shield },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
        <p className="text-app-muted">Manage your account preferences and agent behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
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

        {/* Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activePart}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-8 rounded-[40px] glass border-app-border card-shadow space-y-8"
          >
            {activePart === 'account' && (
              <>
                <h3 className="text-2xl font-display font-bold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-app-muted ml-1">Full Name</label>
                    <input type="text" defaultValue="Rishi Kumar" className="w-full bg-app-bg/50 border border-app-border rounded-xl px-4 py-3 text-sm focus:border-brand-blue outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-app-muted ml-1">Email Address</label>
                    <input type="email" defaultValue="rishi@example.com" className="w-full bg-app-bg/50 border border-app-border rounded-xl px-4 py-3 text-sm focus:border-brand-blue outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-app-muted ml-1">Profile Bio</label>
                    <textarea defaultValue="Frontend Engineer & UI UX Designer with 4 years of experience." rows={4} className="w-full bg-app-bg/50 border border-app-border rounded-xl px-4 py-3 text-sm focus:border-brand-blue outline-none transition-all resize-none" />
                  </div>
                </div>
                <div className="pt-6 border-t border-app-border flex justify-end">
                  <button className="px-8 py-3 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20">
                    Save Changes
                  </button>
                </div>
              </>
            )}

            {activePart === 'notifications' && (
              <>
                <h3 className="text-2xl font-display font-bold">Notification Preferences</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Email Notifications', desc: 'Receive daily updates and application status via email.' },
                    { title: 'Push Notifications', desc: 'Get instant alerts when an interview is scheduled.' },
                    { title: 'Weekly Reports', desc: 'Summarized analytics of your job search progress.' }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-app-surface border border-app-border">
                      <div>
                        <div className="font-bold mb-1">{notif.title}</div>
                        <div className="text-xs text-app-muted font-medium">{notif.desc}</div>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-brand-blue relative cursor-pointer p-1">
                        <div className="w-4 h-4 rounded-full bg-white absolute right-1 shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activePart !== 'account' && activePart !== 'notifications' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-app-surface rounded-full flex items-center justify-center mb-6 border border-app-border">
                  <span className="text-4xl text-brand-blue">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-app-text">Module Active</h2>
                <p className="text-app-muted">This specific settings module is being managed by your AI Agent.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
