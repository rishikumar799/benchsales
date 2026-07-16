import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Lock,
  Check
} from 'lucide-react';
import { useRecruiter } from '../../../../context/RecruiterContext';

export default function SettingsTab() {
  const { recruiterProfile, updateSettings, theme, setTheme, loading } = useRecruiter();
  const [activeSubTab, setActiveSubTab] = useState('notifications');
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  const settings = recruiterProfile?.settings || {};

  const emailAlerts = settings.emailAlerts !== undefined ? settings.emailAlerts : true;
  const pushAlerts = settings.pushAlerts !== undefined ? settings.pushAlerts : true;
  const smsAlerts = settings.smsAlerts !== undefined ? settings.smsAlerts : false;

  const autoMatching = settings.autoMatching !== undefined ? settings.autoMatching : true;
  const priorityAlerts = settings.priorityAlerts !== undefined ? settings.priorityAlerts : true;

  const publicProfile = settings.publicProfile !== undefined ? settings.publicProfile : true;
  const bdmAcess = settings.bdmAcess !== undefined ? settings.bdmAcess : true;

  const handleToggleSetting = async (key: string, value: boolean) => {
    try {
      await updateSettings({ [key]: value });
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
    } catch (e) {
      console.error("Error updating settings in context:", e);
    }
  };

  const handleToggleTheme = async (newTheme: 'light' | 'dark') => {
    try {
      await setTheme(newTheme);
      setShowSavedMsg(true);
      setTimeout(() => setShowSavedMsg(false), 3000);
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-sm font-semibold">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-left max-w-5xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Settings</h1>
        <p className="text-app-muted text-sm mt-1">Configure your recruitment workflow, notification systems, and security preferences.</p>
      </div>

      {showSavedMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-500 text-xs font-bold flex items-center gap-2">
          <Check className="w-4.5 h-4.5 shrink-0" /> Settings updated successfully in realtime!
        </div>
      )}

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left pane selection rail (span 4) */}
        <div className="md:col-span-4 rounded-3xl bg-app-surface border border-app-border p-4 space-y-2">
          {[
            { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email, push & alert systems' },
            { id: 'preferences', label: 'Preferences', icon: Settings, desc: 'Matching & priority options' },
            { id: 'theme', label: 'Theme & Styling', icon: ShieldCheck, desc: 'Interface visual mode' },
            { id: 'privacy', label: 'Privacy & Security', icon: Lock, desc: 'Profile and access controls' }
          ].map((item) => {
            const isSel = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3.5 text-left transition-all cursor-pointer ${
                  isSel 
                    ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-sm' 
                    : 'border border-transparent text-app-muted hover:text-app-text hover:bg-app-bg/50'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isSel ? 'bg-brand-blue text-white' : 'bg-app-bg text-app-muted'}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black">{item.label}</div>
                  <div className="text-[10px] text-app-muted/80 mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right card settings body (span 8) */}
        <div className="md:col-span-8 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow min-h-[400px]">
          
          {/* Sub-tab 1: Notifications */}
          {activeSubTab === 'notifications' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-app-border/40">
                <h3 className="font-display font-black text-base text-app-text">Notification Settings</h3>
                <p className="text-xs text-app-muted mt-0.5">Control how and when you receive candidate updates and job alerts.</p>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'emailAlerts', title: 'Email Notifications', desc: 'Receive daily candidate summaries and BDM verification status updates directly.', val: emailAlerts },
                  { id: 'pushAlerts', title: 'Push Alerts', desc: 'Realtime in-app alerts on new matching job posts or approvals.', val: pushAlerts },
                  { id: 'smsAlerts', title: 'SMS Integration', desc: 'Receive instant alerts for high-priority matching assigned jobs.', val: smsAlerts }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-app-text">{item.title}</h4>
                      <p className="text-[11px] text-app-muted leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.val} 
                        onChange={(e) => handleToggleSetting(item.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-app-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Preferences */}
          {activeSubTab === 'preferences' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-app-border/40">
                <h3 className="font-display font-black text-base text-app-text">Workflow Preferences</h3>
                <p className="text-xs text-app-muted mt-0.5">Optimize how you interact with BDM owners and matching candidate pools.</p>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'autoMatching', title: 'AI Auto-Matching Suggestions', desc: 'Enable realtime machine-learning recommendations for your candidate roster.', val: autoMatching },
                  { id: 'priorityAlerts', title: 'High-Priority Alert Badges', desc: 'Highlight High Priority roles prominently in your job feeds.', val: priorityAlerts }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-app-text">{item.title}</h4>
                      <p className="text-[11px] text-app-muted leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.val} 
                        onChange={(e) => handleToggleSetting(item.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-app-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: Theme */}
          {activeSubTab === 'theme' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-app-border/40">
                <h3 className="font-display font-black text-base text-app-text">Visual Interface Mode</h3>
                <p className="text-xs text-app-muted mt-0.5">Choose your preferred visual presentation skin.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'light' as const, label: 'Modern Light Mode', desc: 'Crisp layouts and soft backgrounds' },
                  { id: 'dark' as const, label: 'Sleek Dark Mode', desc: 'Eye-safe high contrast dark themes' }
                ].map((themeOpt) => {
                  const isSel = theme === themeOpt.id;
                  return (
                    <button
                      key={themeOpt.id}
                      onClick={() => handleToggleTheme(themeOpt.id)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all cursor-pointer ${
                        isSel 
                          ? 'border-brand-blue bg-brand-blue/5' 
                          : 'border-app-border bg-app-bg hover:bg-app-bg/80'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-black text-app-text">{themeOpt.label}</span>
                        {isSel && (
                          <div className="w-4 h-4 bg-brand-blue rounded-full flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-app-muted leading-relaxed mt-2">{themeOpt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Privacy */}
          {activeSubTab === 'privacy' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-app-border/40">
                <h3 className="font-display font-black text-base text-app-text">Privacy Settings</h3>
                <p className="text-xs text-app-muted mt-0.5">Manage details visibility with BDMs and third-party companies.</p>
              </div>

              <div className="space-y-5">
                {[
                  { id: 'publicProfile', title: 'Public Roster Visibility', desc: 'Allow corporate recruiters to spot and request collaborations with you.', val: publicProfile },
                  { id: 'bdmAcess', title: 'Verified BDM Review Access', desc: 'Permit certified BDMs to review your subcollection rosters for verification matching.', val: bdmAcess }
                ].map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-app-text">{item.title}</h4>
                      <p className="text-[11px] text-app-muted leading-relaxed max-w-md">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={item.val} 
                        onChange={(e) => handleToggleSetting(item.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-app-bg peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
