import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Save,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

export default function EmployeeSettingsTab() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    profileVisibility: 'Public', // Public, Internal Only, Private
    language: 'English',
    themePreference: 'Dark', // Light, Dark, System
    timezone: 'GMT+5:30 (India Standard Time)',
  });

  // Keep track of any legacy or additional employee preferences
  const [allData, setAllData] = useState<any>({});

  // 1. Real-time listener for settings matching the specific employee document
  useEffect(() => {
    if (!userProfile?.organizationId || !userProfile?.uid) return;

    const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'employees', userProfile.uid);

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAllData(data);
        
        // Merge fetched properties with default settings
        setSettings({
          emailNotifications: data.emailNotifications !== undefined ? data.emailNotifications : true,
          pushNotifications: data.pushNotifications !== undefined ? data.pushNotifications : true,
          profileVisibility: data.profileVisibility || 'Public',
          language: data.language || 'English',
          themePreference: data.themePreference || 'Dark',
          timezone: data.timezone || 'GMT+5:30 (India Standard Time)',
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to employee settings:", error);
      setErrorMsg("Failed to connect to corporate database in real-time.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userProfile?.organizationId, userProfile?.uid]);

  // 2. Write settings using updateDoc
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.organizationId || !userProfile?.uid) return;

    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const docRef = doc(db, 'organizations_companies', userProfile.organizationId, 'employees', userProfile.uid);
      
      const payload = {
        ...settings,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(docRef, payload);

      setSuccessMsg('✓ Employee preferences updated successfully in real-time!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) {
      console.error("Error updating settings:", error);
      setErrorMsg(`Failed to save settings: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile?.organizationId || !userProfile?.uid) {
    return (
      <div className="p-8 text-center text-app-muted font-bold text-xs">
        Loading Corporate Workspace...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-app-muted text-xs font-bold">
        Connecting to ARYX AI Corporate Settings Engine...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div>
        <h2 className="text-2xl font-display font-black text-app-text">Workplace Settings</h2>
        <p className="text-xs text-app-muted mt-1 font-semibold">Manage your internal visibility, language, system theme, and notification preferences.</p>
      </div>

      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 text-xs font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column - Section Categories Info & Quick Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-3xl bg-app-surface border border-app-border card-shadow flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-app-text uppercase tracking-wider">Account Security</h3>
                <p className="text-[11px] text-app-muted font-semibold mt-1">
                  Your organizational boundary is fully isolated. Changes are propagated in real-time across your company portal.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-app-border space-y-2 text-[10px] text-app-muted font-bold">
              <div className="flex justify-between">
                <span>Employee UID:</span>
                <span className="font-mono text-app-text">{userProfile.uid.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Workspace ID:</span>
                <span className="font-mono text-app-text">{userProfile.organizationId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Role Class:</span>
                <span className="font-mono text-brand-blue">c_employee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns - Main Preference Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Notification Preferences */}
          <div className="p-6 md:p-8 rounded-3xl bg-app-surface border border-app-border card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-brand-blue" />
              <h3 className="text-sm font-bold text-app-text uppercase tracking-wider">Notification Preferences</h3>
            </div>

            <div className="space-y-4">
              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-app-bg/50 border border-app-border rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-app-text">Email Notifications</div>
                  <div className="text-[10px] text-app-muted font-semibold mt-0.5">Receive internal transfer status updates & job recommendations via email.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.emailNotifications ? 'bg-brand-blue' : 'bg-app-border'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between p-4 bg-app-bg/50 border border-app-border rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-app-text">Push Notifications</div>
                  <div className="text-[10px] text-app-muted font-semibold mt-0.5">Alerts when recruiters send comments, shortlist or move your application.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.pushNotifications ? 'bg-brand-blue' : 'bg-app-border'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & System Configuration */}
          <div className="p-6 md:p-8 rounded-3xl bg-app-surface border border-app-border card-shadow space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand-blue" />
              <h3 className="text-sm font-bold text-app-text uppercase tracking-wider">Privacy & System Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Visibility */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-1">Profile Visibility</label>
                <div className="relative">
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="Public">Public (Visible to all recruiters)</option>
                    <option value="Internal Only">Internal Only (Visible to my department only)</option>
                    <option value="Private">Private (Hidden from directory listings)</option>
                  </select>
                </div>
              </div>

              {/* System Language */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-1">Language</label>
                <div className="relative">
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="German">German (Deutsch)</option>
                    <option value="French">French (Français)</option>
                  </select>
                </div>
              </div>

              {/* Theme Preference */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-1">Theme Preference</label>
                <div className="relative">
                  <select
                    value={settings.themePreference}
                    onChange={(e) => setSettings(prev => ({ ...prev, themePreference: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="Dark">Dark Mode (Default)</option>
                    <option value="Light">Light Mode</option>
                    <option value="System">Use Device System settings</option>
                  </select>
                </div>
              </div>

              {/* Timezone Preference */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-app-muted ml-1">Workplace Timezone</label>
                <div className="relative">
                  <select
                    value={settings.timezone}
                    onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full bg-app-bg border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                  >
                    <option value="GMT+5:30 (India Standard Time)">GMT+5:30 (India Standard Time)</option>
                    <option value="GMT-7:00 (Pacific Daylight Time)">GMT-7:00 (Pacific Standard Time)</option>
                    <option value="GMT+0:00 (Coordinated Universal Time)">GMT+0:00 (Coordinated Universal Time)</option>
                    <option value="GMT+1:00 (Central European Time)">GMT+1:00 (Central European Time)</option>
                    <option value="GMT+8:00 (Singapore Standard Time)">GMT+8:00 (Singapore Standard Time)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving changes...' : 'Save Settings'}</span>
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
