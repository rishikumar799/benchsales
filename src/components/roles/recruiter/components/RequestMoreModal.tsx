import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  ClipboardList, 
  Compass, 
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BdmProfile {
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

const BDM_PROFILES: BdmProfile[] = [
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

interface RequestMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSuccess: (count: string, jobName: string) => void;
}

export default function RequestMoreModal({ isOpen, onClose, onRequestSuccess }: RequestMoreModalProps) {
  if (!isOpen) return null;

  const [selectedJob, setSelectedJob] = useState('Frontend Developer - ABC Tech Pvt Ltd');
  const [candidateCount, setCandidateCount] = useState('10');
  const [selectedBdmId, setSelectedBdmId] = useState('bdm-1');
  const [reason, setReason] = useState('We need more candidates to meet client requirement.');
  const [sending, setSending] = useState(false);
  const [hoveredBdm, setHoveredBdm] = useState<string | null>(null);
  
  // State for nested BDM Profile popup
  const [selectedBdmForPopup, setSelectedBdmForPopup] = useState<BdmProfile | null>(null);

  const activeRequirements = [
    { name: 'Frontend Developer - ABC Tech Pvt Ltd', bdmId: 'bdm-1' },
    { name: 'Java Developer - Infoswift Solutions', bdmId: 'bdm-1' },
    { name: 'Backend Developer - TechWave Systems', bdmId: 'bdm-1' },
    { name: 'QA Engineer - X Corp', bdmId: 'bdm-2' },
    { name: 'DevOps Engineer - CloudMatrix', bdmId: 'bdm-2' }
  ];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const bdm = BDM_PROFILES.find(b => b.id === selectedBdmId) || BDM_PROFILES[0];

    setTimeout(() => {
      setSending(false);
      onRequestSuccess(candidateCount, selectedJob.split(' - ')[0] + ` (Assigned to BDM: ${bdm.name})`);
      onClose();
    }, 1200);
  };

  // Auto update BDM selection when job selection changes
  const handleJobChange = (jobName: string) => {
    setSelectedJob(jobName);
    const matched = activeRequirements.find(req => req.name === jobName);
    if (matched) {
      setSelectedBdmId(matched.bdmId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="w-full max-w-5xl bg-[#0a0f24] border border-app-border rounded-[32px] overflow-hidden shadow-2xl animate-scale-up text-app-text relative">
        
        {/* Header toolbar */}
        <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
          <div>
            <h3 className="font-display font-extrabold text-lg text-app-text flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-violet shrink-0" />
              Request Additional Candidates from BDM
            </h3>
            <p className="text-[10px] text-app-muted font-semibold">Coordinate with dedicated Business Development Managers to expand candidate limits.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendRequest}>
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-app-border/40">
            
            {/* Left Column: Request Form (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 space-y-5">
              
              {/* Job selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Select Active Job Recruitment</label>
                <select 
                  value={selectedJob}
                  onChange={(e) => handleJobChange(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                  required
                >
                  {activeRequirements.map((req, idx) => (
                    <option key={idx} value={req.name}>{req.name}</option>
                  ))}
                </select>
              </div>

              {/* Pool usage gauge */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-yellow-500">
                  <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Limit Reached</span>
                  <span>30 / 30 Candidates Sourced (100%)</span>
                </div>
                <div className="w-full bg-app-surface/60 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full w-full" />
                </div>
                <p className="text-[10px] text-app-muted font-bold leading-relaxed">
                  The standard matching pool roster limit of 30 profiles is exhausted. Request supplemental credentials below.
                </p>
              </div>

              {/* Candidates volume count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Additional Candidates Volume</label>
                <select 
                  value={candidateCount}
                  onChange={(e) => setCandidateCount(e.target.value)}
                  className="w-full sm:w-2/3 bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                >
                  <option value="5">5 Candidates</option>
                  <option value="10">10 Candidates (Standard Allocation)</option>
                  <option value="15">15 Candidates</option>
                  <option value="20">20 Candidates</option>
                </select>
              </div>

              {/* Reason for inquiry */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Operational Cover Note (Optional)</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Summarize operational urgency for quicker approvals..."
                  className="w-full h-24 bg-app-surface border border-app-border rounded-xl p-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none leading-relaxed"
                />
              </div>

            </div>

            {/* Right Column: BDM Showcase Selection (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 space-y-5 bg-app-surface/5">
              
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-app-muted uppercase tracking-wider">Assigned Business Development Managers (BDM)</h4>
                <p className="text-[10px] text-app-muted font-medium">Click on a BDM's card to view their complete profile in a popup.</p>
              </div>

              <div className="space-y-3">
                {BDM_PROFILES.map((bdm) => {
                  const isSelected = selectedBdmId === bdm.id;
                  
                  return (
                    <div
                      key={bdm.id}
                      onClick={() => setSelectedBdmId(bdm.id)}
                      onMouseEnter={() => setHoveredBdm(bdm.id)}
                      onMouseLeave={() => setHoveredBdm(null)}
                      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-brand-blue/10 border-brand-blue shadow-md' 
                          : 'bg-app-bg/60 border-app-border hover:border-app-border/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${bdm.avatarBg} flex items-center justify-center text-white text-xs font-bold shadow`}>
                          {bdm.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-extrabold text-app-text truncate">{bdm.name}</span>
                            <span className="text-[9px] text-[#3b82f6] hover:underline font-extrabold shrink-0" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBdmForPopup(bdm);
                            }}>
                              View Profile
                            </span>
                          </div>
                          <span className="text-[10px] text-app-muted font-semibold block truncate">{bdm.title}</span>
                          <span className="text-[9px] text-brand-violet font-bold block mt-0.5">{bdm.region}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono font-bold text-app-muted mt-3 pt-2.5 border-t border-app-border/30">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> response: {bdm.responseTime}</span>
                        <div className="flex items-center gap-1.5">
                          {isSelected && (
                            <span className="text-emerald-500 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[8px] uppercase">
                              Active Recipient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Safety notice */}
              <div className="p-3.5 bg-brand-violet/5 border border-brand-violet/10 rounded-2xl text-[9px] leading-relaxed text-app-muted font-semibold flex gap-2 items-start">
                <Sparkles className="w-4.5 h-4.5 text-brand-violet shrink-0" />
                <span>
                  By assigning this request to the selected BDM, they will receive your credentials and job requisition profile to quickly verify and enable direct matching workflows.
                </span>
              </div>

            </div>

          </div>

          {/* Footer actions */}
          <div className="h-18 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/10 gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-app-surface border border-app-border text-app-text hover:bg-app-bg text-xs font-bold rounded-xl transition-colors cursor-pointer"
              disabled={sending}
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              disabled={sending}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-[#0c244c]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              {sending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Request to BDM...
                </>
              ) : (
                'Send Request for Review'
              )}
            </button>
          </div>
        </form>

      </div>

      {/* Nested BDM Detailed Profile Modal Popup */}
      <AnimatePresence>
        {selectedBdmForPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-app-bg border border-app-border rounded-[32px] overflow-hidden card-shadow text-app-text"
            >
              {/* Header profile banner */}
              <div className="relative p-6 bg-gradient-to-br from-purple-950/20 via-app-bg to-app-bg border-b border-app-border/40 pb-5">
                <button 
                  onClick={() => setSelectedBdmForPopup(null)} 
                  className="absolute right-5 top-5 p-1.5 rounded-full bg-app-surface/80 hover:bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedBdmForPopup.avatarBg} flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0`}>
                    {selectedBdmForPopup.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-display font-black text-lg text-app-text">{selectedBdmForPopup.name}</h4>
                      <span className="text-[8px] bg-brand-violet/10 text-brand-violet font-extrabold px-2 py-0.5 rounded uppercase">
                        BDM Team
                      </span>
                    </div>
                    <p className="text-xs text-brand-blue font-extrabold">
                      {selectedBdmForPopup.title}
                    </p>
                    <span className="text-[10px] text-app-muted font-bold block mt-0.5">
                      Region Coverage: <span className="text-brand-violet">{selectedBdmForPopup.region}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* BDM Profile Details */}
              <div className="p-6 space-y-5">
                
                {/* Expert Focus / Bios */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block">Operational Bio</span>
                  <p className="text-xs text-app-text font-medium leading-relaxed bg-app-surface/65 p-3.5 rounded-2xl border border-app-border/40 italic">
                    "{selectedBdmForPopup.bio}"
                  </p>
                </div>

                {/* Sourcing portfolios matched */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block">Active Sourcing Accounts</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBdmForPopup.activeAccounts.map((account, idx) => (
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
                    <span className="text-app-text font-extrabold">{selectedBdmForPopup.experience}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-app-muted">Work email contact:</span>
                    <span className="text-app-text font-mono text-brand-blue">{selectedBdmForPopup.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-app-muted">Average response rate:</span>
                    <span className="text-[#ec4899] font-bold">{selectedBdmForPopup.responseTime}</span>
                  </div>
                </div>

                {/* Select / Close actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedBdmForPopup(null)}
                    className="w-1/2 py-2.5 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                  >
                    Back to Form
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBdmId(selectedBdmForPopup.id);
                      setSelectedBdmForPopup(null);
                    }}
                    className="w-1/2 py-2.5 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-xl text-xs font-extrabold cursor-pointer transition shadow"
                  >
                    Select as Handshake Recipient
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
