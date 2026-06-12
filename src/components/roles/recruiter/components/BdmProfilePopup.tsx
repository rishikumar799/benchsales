import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, Clock, MapPin, Sparkles, Building } from 'lucide-react';

export interface BdmProfile {
  id: string;
  name: string;
  title: string;
  region: string;
  email: string;
  phone: string;
  avatarBg: string;
  experience: string;
  activeAccounts: string[];
  bio: string;
  responseTime: string;
}

export const BDM_PROFILES: BdmProfile[] = [
  {
    id: 'bdm-1',
    name: 'John Mathew',
    title: 'Senior Business Development Manager',
    region: 'North America / East Coast',
    email: 'john.mathew@aryx.ai',
    phone: '+1 (555) 0192',
    avatarBg: 'bg-[#a855f7]',
    experience: '9 Years of Enterprise Account Sourcing',
    activeAccounts: ['ABC Tech Pvt Ltd', 'Infoswift Solutions', 'TechWave Systems'],
    bio: 'Dedicated coordinator linking enterprise-tier employers with specialist tech pipelines. Known for optimizing fast turnarounds and premium resume matching.',
    responseTime: '< 3 Hours'
  },
  {
    id: 'bdm-2',
    name: 'Arjun Patil',
    title: 'Enterprise Account Director',
    region: 'APAC & West Coast US',
    email: 'arjun.patil@aryx.ai',
    phone: '+1 (555) 0148',
    avatarBg: 'bg-[#ec4899]',
    experience: '6 Years in Technical Sourcing Lead',
    activeAccounts: ['X Corp', 'CloudMatrix Solution'],
    bio: 'Developing strategic relations with disruptive tech hubs. Focused on design accuracy, React architecture and backend specialist allocations.',
    responseTime: '< 6 Hours'
  },
  {
    id: 'bdm-3',
    name: 'Neha Sharma',
    title: 'Director of Partner Relations',
    region: 'EMEA / Western Europe',
    email: 'neha.sharma@aryx.ai',
    phone: '+1 (555) 0165',
    avatarBg: 'bg-[#f59e0b]',
    experience: '5 Years in Startup Talent Operations',
    activeAccounts: ['Aura Digital', 'Infiniloop Networks'],
    bio: 'Fostering developer communities across startup verticals. Helping hyper-growth corporations deploy elite teams at scale.',
    responseTime: '< 2 Hours'
  }
];

interface BdmProfilePopupProps {
  bdmNameOrId: string | null;
  onClose: () => void;
}

export default function BdmProfilePopup({ bdmNameOrId, onClose }: BdmProfilePopupProps) {
  if (!bdmNameOrId) return null;

  // Search by name or ID
  const bdm = BDM_PROFILES.find(b => 
    b.id === bdmNameOrId || 
    b.name.toLowerCase() === bdmNameOrId.toLowerCase() ||
    b.name.toLowerCase().includes(bdmNameOrId.toLowerCase())
  ) || BDM_PROFILES[0]; // Fallback to first

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-[#0a0f24] border border-app-border rounded-[32px] overflow-hidden card-shadow text-app-text"
        >
          {/* Header profile banner */}
          <div className="relative p-6 bg-gradient-to-br from-purple-950/20 via-[#0a0f24] to-[#0a0f24] border-b border-app-border/40 pb-5">
            <button 
              onClick={onClose} 
              className="absolute right-5 top-5 p-1.5 rounded-full bg-app-surface/80 hover:bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl ${bdm.avatarBg} flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0`}>
                {bdm.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-display font-black text-lg text-app-text">{bdm.name}</h4>
                  <span className="text-[8px] bg-brand-violet/10 text-brand-violet font-extrabold px-2 py-0.5 rounded uppercase">
                    BDM Team
                  </span>
                </div>
                <p className="text-xs text-brand-blue font-extrabold">
                  {bdm.title}
                </p>
                <span className="text-[10px] text-app-muted font-bold block mt-0.5">
                  Region Coverage: <span className="text-brand-violet">{bdm.region}</span>
                </span>
              </div>
            </div>
          </div>

          {/* BDM Profile Details */}
          <div className="p-6 space-y-5">
            
            {/* Operational Bio */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block font-sans">Operational Bio</span>
              <p className="text-xs text-app-text font-medium leading-relaxed bg-[#0a0f24]/60 p-3.5 border border-app-border rounded-2xl italic">
                "{bdm.bio}"
              </p>
            </div>

            {/* Sourcing portfolios matched */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block font-sans">Active Sourcing Accounts</span>
              <div className="flex flex-wrap gap-1.5">
                {bdm.activeAccounts.map((account, idx) => (
                  <span key={idx} className="text-[10px] font-bold px-2.5 py-1 bg-brand-blue/5 text-brand-blue border border-brand-blue/15 rounded-lg">
                    {account}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact parameters */}
            <div className="p-4 bg-app-surface/40 border border-app-border rounded-[20px] text-xs space-y-2 font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-app-muted">Experience Level:</span>
                <span className="text-app-text font-extrabold">{bdm.experience}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-app-muted">Work email contact:</span>
                <span className="text-app-text font-mono text-brand-blue">{bdm.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-app-muted">Average response rate:</span>
                <span className="text-[#ec4899] font-bold">{bdm.responseTime}</span>
              </div>
            </div>

            {/* Close action */}
            <div className="flex pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-2xl text-xs font-semibold cursor-pointer transition shadow"
              >
                Close Profile
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
