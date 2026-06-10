import { useState } from 'react';
import { 
  CheckCircle2, 
  Trash2, 
  Briefcase, 
  MapPin, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Send,
  PlusCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { CandidateProfile } from './CandidatePoolTab';

interface MySelectionsTabProps {
  selectedCandidateIds: string[];
  candidates: CandidateProfile[];
  onDeselect: (id: string) => void;
  onSubmitProfile: (candidate: CandidateProfile) => void;
  onNavigate: (tab: string) => void;
}

export default function MySelectionsTab({ 
  selectedCandidateIds, 
  candidates, 
  onDeselect, 
  onSubmitProfile,
  onNavigate
}: MySelectionsTabProps) {

  // Recruiter info matching image #4 exactly
  const recruiterInfo = {
    name: 'Rohit Kumar',
    role: 'Recruiter',
    id: 'REC-2026-045',
    since: 'Member since May 2026',
    email: 'rohit.kumar@aryaxai.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    bdm: 'John Mathew (BDM)',
    team: 'Frontend Recruitment',
    recExp: '3 Years',
    preferredRoles: 'Frontend, Full Stack, Backend',
    preferredLocations: 'Bangalore, Remote'
  };

  // Filter only candidate elements that are selected
  const selectedCandidates = candidates.filter(cand => selectedCandidateIds.includes(cand.id));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">My Selections</h1>
        <p className="text-app-muted mt-1">Candidates you have selected from your pool. Submit them to jobs.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Recruiter Card Panel (Hign Fidelity Representation of Image #4 left side) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow relative overflow-hidden">
            {/* Header backdrop gradient */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-r from-brand-blue/30 to-brand-violet/30" />
            
            <div className="relative pt-8 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-app-bg bg-brand-blue/10 p-0.5 shadow-xl">
                <img 
                  src="https://picsum.photos/seed/rohit/150/150" 
                  alt="Rohit Kumar" 
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-display font-extrabold text-xl text-app-text mt-4">{recruiterInfo.name}</h3>
              <p className="text-brand-blue font-bold text-sm tracking-wider uppercase mt-1">{recruiterInfo.role}</p>
              <span className="text-xs text-brand-violet font-semibold bg-brand-violet/10 border border-brand-violet/20 px-3 py-1 rounded-full mt-2 font-mono">
                ID: {recruiterInfo.id}
              </span>
              <p className="text-xs text-app-muted mt-2">{recruiterInfo.since}</p>
            </div>

            {/* Direct Contact specs */}
            <div className="mt-8 pt-6 border-t border-app-border/60 space-y-4 text-xs font-semibold text-app-text">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-app-muted shrink-0" />
                <span>{recruiterInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-app-muted shrink-0" />
                <span>{recruiterInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-app-muted shrink-0" />
                <span>{recruiterInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats on current recruitment limits */}
          <div className="p-6 rounded-[24px] bg-brand-blue/5 border border-brand-blue/20 card-shadow">
            <h4 className="font-display font-extrabold text-sm text-app-text mb-4">Sourcing Limits</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-app-muted font-bold">
                <span>Selected Roster Size</span>
                <span className="text-app-text">{selectedCandidates.length} / 18 Cap</span>
              </div>
              <div className="w-full bg-app-surface border border-app-border rounded-full h-2">
                <div 
                  className="bg-brand-blue h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((selectedCandidates.length / 18) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-app-muted mt-2 leading-relaxed">
                You can select up to 18 candidates at once of your allocated pool to submit to various BDMs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Candidates Selection List (High Fidelity Representative of Image #4 right side) */}
        <div className="xl:col-span-8 p-6 rounded-[28px] glass border border-app-border card-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-app-border pb-4">
            <h3 className="font-display font-bold text-lg text-app-text">
              Submit Selection ({selectedCandidates.length})
            </h3>
            <span className="text-xs font-bold text-app-muted bg-app-bg px-3 py-1 rounded-full border border-app-border">
              Total Roster Pool: {candidates.length}
            </span>
          </div>

          {selectedCandidates.length > 0 ? (
            <div className="space-y-4">
              {selectedCandidates.map((cand) => (
                <div 
                  key={cand.id} 
                  className="p-5 rounded-2xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-blue/30 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-sm font-extrabold font-mono shrink-0">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-app-text flex items-center gap-1.5">
                        {cand.name}
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                      </h4>
                      <p className="text-xs text-app-muted mt-0.5">{cand.details.role} • {cand.experience} Exp</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {cand.skills.map((skill, index) => (
                          <span key={index} className="text-[10px] font-mono font-semibold bg-app-bg px-2 py-0.5 rounded-md border border-app-border text-app-text">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-app-border/40 shrink-0">
                    <button 
                      onClick={() => onDeselect(cand.id)}
                      className="px-3.5 py-3 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl transition-all"
                      title="Remove from selection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => onSubmitProfile(cand)}
                      className="flex-1 md:flex-initial px-5 py-3 bg-brand-blue text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/15 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mx-auto text-brand-blue">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <p className="font-display font-bold text-lg text-app-text">Your selected roster is blank</p>
                <p className="text-xs text-app-muted mt-2 leading-relaxed">
                  Go to the <strong>Candidate Pool</strong> tab and click "Select" to draft candidates into your active submittals roster.
                </p>
                <button 
                  onClick={() => onNavigate('candidates')}
                  className="mt-5 px-5 py-3 bg-brand-blue text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-blue/15"
                >
                  Open Candidate Pool
                </button>
              </div>
            </div>
          )}

          {/* Work Info table representation matching Image #4 center metrics */}
          <div className="mt-8 pt-8 border-t border-app-border/60">
            <h4 className="font-display font-extrabold text-sm text-app-text mb-4">Work & Alignment Profile</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Reporting Manager:</span>
                <span className="text-app-text">{recruiterInfo.bdm}</span>
              </div>
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Assigned Team:</span>
                <span className="text-app-text">{recruiterInfo.team}</span>
              </div>
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Recruitment Experience:</span>
                <span className="text-app-text">{recruiterInfo.recExp}</span>
              </div>
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Preferred Verticals:</span>
                <span className="text-app-text">{recruiterInfo.preferredRoles}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}