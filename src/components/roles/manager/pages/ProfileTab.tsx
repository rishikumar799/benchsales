import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Building2, 
  CheckCircle, 
  Briefcase, 
  Award, 
  Users, 
  Lock, 
  Key,
  Database
} from 'lucide-react';

export default function ProfileTab() {
  const [isCopied, setIsCopied] = useState(false);

  const mockProfile = {
    name: 'Rohit Kumar',
    role: 'BDM Manager',
    email: 'rohit.kumar@aryx.ai',
    org: 'Aryx AI (Ecosystem 1)',
    joinDate: 'Jan 2026',
    status: 'Verified Administrator',
    metrics: [
      { label: 'Requirements Created', value: '32 Active', icon: Briefcase },
      { label: 'Partners Supervised', value: '16 Agencies', icon: Users },
      { label: 'Marketplace Deals', value: '78 Placed', icon: Award },
    ]
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText('BDM-MGR-879812A');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in text-app-text">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Profile</h1>
        <p className="text-app-muted mt-1">Review your business development manager status and system details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card Info Box (8 Columns) */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img 
              src="https://picsum.photos/seed/manager/150/150" 
              alt={mockProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] object-cover border-2 border-brand-blue/30 p-1 bg-app-surface/50 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="text-center sm:text-left space-y-1.5">
              <span className="text-[10px] font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 px-3 py-1 rounded-full uppercase tracking-wider">
                {mockProfile.status}
              </span>
              <h2 className="text-2xl font-display font-bold text-app-text mt-1.5">{mockProfile.name}</h2>
              <div className="text-xs text-app-muted font-semibold flex items-center justify-center sm:justify-start gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{mockProfile.org}</span>
              </div>
            </div>
          </div>

          {/* Core Metrics Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-app-border/40">
            {mockProfile.metrics.map((met, idx) => (
              <div key={idx} className="p-4 bg-app-surface/50 border border-app-border/50 rounded-2xl flex items-center gap-3">
                <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl shrink-0">
                  <met.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">{met.label}</span>
                  <span className="text-sm font-extrabold text-app-text block mt-0.5">{met.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Form details mock parameters */}
          <div className="space-y-4 pt-4 border-t border-app-border/40 text-xs font-semibold text-app-muted">
            <div className="flex justify-between items-center py-2 border-b border-app-border/30">
              <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Security Email Address</span>
              <span className="text-app-text">{mockProfile.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/30">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Clearance Rank</span>
              <span className="text-app-text">Level 4 Partner Overseer</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-app-border/30">
              <span className="flex items-center gap-2"><Key className="w-3.5 h-3.5" /> Marketplace BDM ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-app-text bg-app-bg px-2.5 py-1 rounded border border-app-border">BDM-MGR-879812A</span>
                <button 
                  onClick={handleCopyId}
                  className="text-[10px] font-bold text-brand-blue hover:underline"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security / System panel Info Box (4 Columns) */}
        <div className="md:col-span-4 p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/5 to-brand-blue/5 border border-brand-violet/10 card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-brand-violet" />
              <h3 className="font-display font-bold text-base text-app-text">Administrative Access</h3>
            </div>
            
            <p className="text-xs text-app-muted leading-relaxed font-semibold">
              Your account has full write clearance on job vacancy publication, recruiter pool verification, and submission review pipelines.
            </p>

            <div className="p-4 bg-app-bg/50 border border-app-border rounded-2xl space-y-2">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Connected Services</span>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                <CheckCircle className="w-4 h-4" />
                <span>Ecosystem Datastore</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 mt-1">
                <CheckCircle className="w-4 h-4" />
                <span>Partner Sync Tunnel</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-app-border/40 mt-6">
            <span className="text-[10px] text-app-muted font-bold block">CURRENT ECOSYSTEM VERSION</span>
            <span className="font-mono text-xs text-app-text font-bold block mt-1">v4.1.2-Stable Build</span>
          </div>
        </div>

      </div>

    </div>
  );
}
