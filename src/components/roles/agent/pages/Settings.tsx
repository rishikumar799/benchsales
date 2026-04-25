import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, Bell, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

export default function AgentSettings() {
  const [activePart, setActivePart] = useState('profile');

  const menu = [
    { id: 'profile', label: 'Agent Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Alerts', icon: Bell },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Agent Settings</h1>
        <p className="text-app-muted">Manage your agent profile and platform preferences.</p>
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
            className="p-8 rounded-[40px] glass border-app-border card-shadow"
          >
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-app-surface rounded-full flex items-center justify-center mb-6 border border-app-border">
                <SettingsIcon className="w-8 h-8 text-brand-blue" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-app-text">{activePart.charAt(0).toUpperCase() + activePart.slice(1)} Module</h2>
              <p className="text-app-muted">Configure your agent identity and system preferences here.</p>
              <button className="mt-8 px-8 py-3 premium-gradient text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-blue/20">
                Update Settings
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
