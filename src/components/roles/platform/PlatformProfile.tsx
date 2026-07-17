import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Key, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Smartphone,
  BellRing,
  Globe
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { usePlatformAdmin } from '../../../context/PlatformAdminContext';

export default function PlatformProfile() {
  const { userProfile } = useAuth();
  const { loginLogs } = usePlatformAdmin();
  const [passphraseResetSent, setPassphraseResetSent] = useState(false);

  const profile = {
    name: userProfile?.fullName || userProfile?.displayName || 'Platform Admin',
    email: userProfile?.email || 'admin@AryxAI.com',
    phone: userProfile?.phoneNumber || '+91 98765 43210',
    role: 'Platform Administrator',
    joined: userProfile?.createdAt 
      ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      : '01 Jan 2024'
  };

  const [permissions] = useState([
    { name: 'Manage Organizations', desc: 'SaaS tenant dynamic database cluster provisioning' },
    { name: 'Manage Users', desc: 'Secure control over universal credentials list' },
    { name: 'View All Analytics', desc: 'Aggregated cross-boundary ecosystem analytics metrics' },
    { name: 'Manage Billing', desc: 'Enterprise SaaS invoice ledger & cycles' },
    { name: 'System Configuration', desc: 'Root microservices and API gateways settings' },
    { name: 'Manage AI Services', desc: 'L1 to L8 algorithm routing parameters' },
    { name: 'View System Logs', desc: 'Real-time database and security event streams' },
  ]);

  const defaultLoginHistory = [
    { date: '30 May 2024, 10:30 AM', location: 'New Delhi, India', device: 'Chrome on macOS (192.168.1.10)' },
    { date: '30 May 2024, 08:15 AM', location: 'New Delhi, India', device: 'Safari on iPhone (192.168.1.11)' },
    { date: '29 May 2024, 11:20 PM', location: 'Bengaluru, India', device: 'Chrome on Windows (10.0.0.45)' },
  ];

  const userEmail = profile.email;
  const filteredLogs = loginLogs ? loginLogs.filter(log => log.email === userEmail) : [];
  
  const dynamicLoginHistory = filteredLogs.length > 0
    ? filteredLogs.map(log => ({
        date: new Date(log.timestamp).toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        location: log.location || 'Authorized Node',
        device: `${log.device || log.browser || 'Web Browser'} (IP: ${log.ip || 'Unknown'})`
      })).slice(0, 5)
    : [];

  return (
    <div id="platform-profile-view" className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Platform Authorization</span>
        <h2 className="text-3xl font-display font-medium mt-1">Platform Admin Profile</h2>
        <p className="text-app-muted text-sm mt-1">Manage root administrative details, view permissions checklist, configure security parameters, and analyze access logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Info */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Administrative Account</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-violet-500/10 border-2 border-brand-violet/20 flex items-center justify-center text-brand-violet font-bold text-2xl shadow-indigo-500/10">
                {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div>
                <div className="text-lg font-bold text-app-text">{profile.name}</div>
                <div className="text-xs text-brand-violet font-bold mt-0.5">{profile.role}</div>
              </div>
            </div>

            <div className="space-y-3.5 pt-4 text-xs">
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/40">
                <span className="text-app-muted font-semibold">Primary Mailbox</span>
                <span className="font-bold text-app-text">{profile.email}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/40">
                <span className="text-app-muted font-semibold">Contact Number</span>
                <span className="font-bold text-app-text">{profile.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/40">
                <span className="text-app-muted font-semibold">Assigned Role</span>
                <span className="font-bold text-brand-blue">{profile.role}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-app-border/40">
                <span className="text-app-muted font-semibold">System Onboarding</span>
                <span className="font-mono text-app-muted font-semibold">{profile.joined}</span>
              </div>
            </div>
          </div>

          <button className="w-full text-center py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl cursor-not-allowed opacity-60 border border-brand-blue/50 transition-all font-semibold mt-4">
            Edit Administrative Info
          </button>
        </div>

        {/* Permissions Checklist dashboard */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Administrative Access Permissions
          </h3>
          <p className="text-xs text-app-muted">Verify secure root access parameters allocated to this profile.</p>

          <div className="space-y-2.5 pt-2 select-none max-h-72 overflow-y-auto pr-1">
            {permissions.map((perm, idx) => (
              <div key={idx} className="p-3 bg-app-surface/60 border border-app-border rounded-xl flex items-start gap-2.5 hover:bg-app-surface/90 transition-all">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-bold text-app-text">{perm.name}</div>
                  <div className="text-[10px] text-app-muted font-medium mt-0.5">{perm.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security parameters */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-violet" /> Security Core settings
            </h3>
            <p className="text-xs text-app-muted">Strengthen administrative account controls against intruder vector potentials.</p>

            <div className="space-y-3">
              {/* password change trigger */}
              <div className="p-3.5 bg-app-surface/40 border border-app-border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4 text-app-muted" />
                  <div>
                    <span className="font-bold text-app-text block">Change Passphrase</span>
                    {passphraseResetSent && (
                      <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">Dispatched to security mailbox!</span>
                    )}
                  </div>
                </div>
                {passphraseResetSent ? (
                  <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded font-bold">Sent</span>
                ) : (
                  <button 
                    className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 font-bold hover:bg-slate-700 cursor-pointer transition" 
                    onClick={() => {
                      setPassphraseResetSent(true);
                      setTimeout(() => setPassphraseResetSent(false), 5000);
                    }}
                  >
                    Configure
                  </button>
                )}
              </div>

              {/* 2fa toggle */}
              <div className="p-3.5 bg-app-surface/40 border border-app-border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-app-muted" />
                  <div>
                    <span className="font-bold text-app-text block">Two-Factor Authentication</span>
                    <span className="text-[9px] text-emerald-500 block font-semibold mt-0.5">Enabled & Authorized</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Enabled</span>
              </div>

              {/* Alerts configuration */}
              <div className="p-3.5 bg-app-surface/40 border border-app-border rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <BellRing className="w-4 h-4 text-app-muted" />
                  <div>
                    <span className="font-bold text-app-text block">System Security Alerts</span>
                    <span className="text-[9px] text-emerald-500 block font-semibold mt-0.5">Dispatched instantly</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login History list */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-brand-blue" /> Administrative Login Logs
        </h3>
        <p className="text-xs text-app-muted">Recent login records validated for this Super Admin profile.</p>

        <div className="space-y-2">
          {dynamicLoginHistory.length === 0 ? (
            <div className="p-8 text-center text-app-muted font-bold text-sm bg-app-surface border border-app-border rounded-2xl">
              No Login History
            </div>
          ) : (
            dynamicLoginHistory.map((hist, idx) => (
              <div key={idx} className="p-4 bg-app-surface border border-app-border rounded-2xl flex justify-between items-center text-xs text-app-text">
                <div className="space-y-1">
                  <div className="font-mono font-bold text-app-text">{hist.date}</div>
                  <div className="text-[11px] text-app-muted font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {hist.device}
                  </div>
                </div>
                <span className="text-[10px] text-brand-blue bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-xl font-bold font-mono tracking-wide flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {hist.location}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
