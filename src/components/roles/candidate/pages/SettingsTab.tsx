import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  User,
  Smartphone,
  Mail
} from 'lucide-react';

export default function SettingsTab() {
  const [activeSubTab, setActiveSubTab] = useState('AccountSettings');

  const [fullName, setFullName] = useState('Rishi Kumar');
  const [email, setEmail] = useState('rishi.kumar@email.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2500);
    setCurrentPassword('');
    setNewPassword('');
  };

  const tabs = [
    { id: 'AccountSettings', label: 'Account Settings', icon: User },
    { id: 'Security', label: 'Security', icon: Lock },
    { id: 'Notifications', label: 'Notification Settings', icon: Bell },
    { id: 'Privacy', label: 'Privacy & Permissions', icon: ShieldCheck },
    { id: 'DeleteAccount', label: 'Delete Account', icon: Trash2, destructive: true }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Settings</h1>
        <p className="text-app-muted text-sm mt-1">Configure your personal preferences, security keys, and alerts toggles.</p>
      </div>

      <AnimatePresence>
        {showSavedMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center gap-2"
          >
            <CheckCircle2 className="w-4.5 h-4.5" /> Settings changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings categories navigation list (Left Column) */}
        <div className="lg:col-span-4 space-y-2">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveSubTab(tb.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl text-left text-xs font-bold border transition-all ${
                activeSubTab === tb.id
                  ? 'bg-brand-blue border-brand-blue text-white shadow-md shadow-brand-blue/15'
                  : tb.destructive 
                    ? 'bg-red-500/5 hover:bg-red-500/10 border-red-500/10 text-red-500'
                    : 'bg-app-surface border-app-border text-app-muted hover:text-app-text'
              }`}
            >
              <div className="flex items-center gap-3">
                <tb.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{tb.label}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </div>

        {/* Content detail form configurations (Right Column) */}
        <div className="lg:col-span-8 p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow h-fit space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeSubTab === 'AccountSettings' && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-app-text">Account Settings</h2>
                    <p className="text-xs text-app-muted mt-0.5">Primary information used to communicate with hirers.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  {/* Password reset section nested at bottom of settings */}
                  <div className="border-t border-app-border/40 pt-5 mt-5 space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-app-text">Change Password</h3>
                      <p className="text-xs text-app-muted mt-0.5">Ensure your account is protected with a secure credential.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">New Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-app-bg border border-app-border rounded-xl p-3 text-xs focus:ring-1 focus:ring-brand-blue focus:outline-none focus:border-brand-blue transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-app-border/40">
                    <button type="submit" className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-md uppercase tracking-wide">
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeSubTab !== 'AccountSettings' && (
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto text-brand-blue">
                    <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-app-text">{tabs.find(s => s.id === activeSubTab)?.label} Control Panel</h3>
                    <p className="text-xs text-app-muted mt-1 max-w-xs mx-auto">This preference control module is integrated directly with the Marketplace candidate profile database parameters.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
