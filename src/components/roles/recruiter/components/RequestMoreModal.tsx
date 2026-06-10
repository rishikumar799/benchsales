import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  ClipboardList, 
  Compass, 
  UserPlus
} from 'lucide-react';

interface RequestMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSuccess: (count: string, jobName: string) => void;
}

export default function RequestMoreModal({ isOpen, onClose, onRequestSuccess }: RequestMoreModalProps) {
  
  if (!isOpen) return null;

  const [selectedJob, setSelectedJob] = useState('Frontend Developer - ABC Tech Pvt Ltd');
  const [candidateCount, setCandidateCount] = useState('10');
  const [reason, setReason] = useState('We need more candidates to meet client requirement.');
  const [sending, setSending] = useState(false);

  const activeRequirements = [
    'Frontend Developer - ABC Tech Pvt Ltd',
    'Java Developer - Infoswift Solutions',
    'Backend Developer - TechWave Systems',
    'QA Engineer - X Corp',
    'DevOps Engineer - CloudMatrix'
  ];

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    setTimeout(() => {
      setSending(false);
      onRequestSuccess(candidateCount, selectedJob.split(' - ')[0]);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="w-full max-w-4xl bg-[#090D1A] border border-app-border rounded-[32px] overflow-hidden shadow-2xl animate-scale-up text-app-text">
        
        {/* Header toolbar */}
        <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
          <div>
            <h3 className="font-display font-extrabold text-lg text-app-text flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-violet" />
              Request Additional Candidates
            </h3>
            <p className="text-[10px] text-app-muted font-semibold">Request more candidates from your BDM to expand your pool.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSendRequest}>
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-app-border/40">
            
            {/* Left Column: Request Form (7 cols) */}
            <div className="md:col-span-7 p-8 space-y-5">
              
              {/* Job selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Select Job</label>
                <select 
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                  required
                >
                  {activeRequirements.map((req, idx) => (
                    <option key={idx} value={req}>{req}</option>
                  ))}
                </select>
              </div>

              {/* Pool utilization gauge */}
              <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-yellow-500">
                  <span>Current Pool Usage</span>
                  <span>30 / 30 Candidates Used (100%)</span>
                </div>
                <div className="w-full bg-app-surface rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-full" />
                </div>
                <p className="text-[10px] text-app-muted font-semibold leading-relaxed">
                  Your allocated 30 candidates roster is fully exhausted for matching workflows.
                </p>
              </div>

              {/* Candidates volume count */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Additional Candidates Required</label>
                <select 
                  value={candidateCount}
                  onChange={(e) => setCandidateCount(e.target.value)}
                  className="w-2/3 bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                >
                  <option value="5">5 Candidates</option>
                  <option value="10">10 Candidates (Standard)</option>
                  <option value="15">15 Candidates</option>
                  <option value="20">20 Candidates</option>
                </select>
              </div>

              {/* Reason for inquiry */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Reason for Request (Optional)</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Summarize why extra candidates are needed..."
                  className="w-full h-28 bg-app-surface border border-app-border rounded-xl p-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none leading-relaxed"
                />
              </div>

            </div>

            {/* Right Column: Process & Guidelines Panels (5 cols) */}
            <div className="md:col-span-5 p-8 space-y-6 bg-app-surface/10">
              
              {/* Process */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-brand-violet uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-brand-violet" />
                  Process
                </h4>
                <ol className="space-y-2.5 text-xs text-app-text font-semibold pl-2">
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-violet text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span className="text-app-muted leading-relaxed">Submit request for additional candidates.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-violet text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span className="text-app-muted leading-relaxed">BDM will review your request.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="w-5 h-5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-violet text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span className="text-app-muted leading-relaxed">Once approved, new candidates will be added to your pool.</span>
                  </li>
                </ol>
              </div>

              {/* Request Guidelines */}
              <div className="space-y-3 pt-4 border-t border-app-border/40">
                <h4 className="text-xs font-extrabold text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-brand-blue" />
                  Request Guidelines
                </h4>
                <ul className="space-y-2.5 text-xs text-app-muted font-semibold pl-1 leading-relaxed">
                  <li className="flex gap-2 items-start">
                    <span className="text-brand-blue select-none font-extrabold mt-0.5">•</span>
                    <span>You can request additional candidates only when your current pool is fully used.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-brand-blue select-none font-extrabold mt-0.5">•</span>
                    <span>BDM approval is required for every new additional request.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-brand-blue select-none font-extrabold mt-0.5">•</span>
                    <span>Additional candidates will be added to your existing pool.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Footer actions */}
          <div className="h-18 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/10 gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-3 bg-app-surface border border-app-border text-app-text hover:bg-app-bg text-xs font-bold rounded-xl transition-colors"
              disabled={sending}
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              disabled={sending}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-[#0c244c]/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              {sending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Request...
                </>
              ) : (
                'Send Request'
              )}
            </button>
          </div>
        </form>

      </div>

    </div>
  );
}