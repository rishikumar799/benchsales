import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckSquare, 
  CheckCircle, 
  AlertCircle, 
  Briefcase, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CandidateProfile } from '../pages/CandidatePoolTab';

interface SubmitProfileModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (candidateName: string, jobTitle: string) => void;
}

export default function SubmitProfileModal({ 
  candidate, 
  isOpen, 
  onClose, 
  onSubmitSuccess 
}: SubmitProfileModalProps) {
  
  if (!isOpen || !candidate) return null;

  // Selected job requirement
  const [selectedJob, setSelectedJob] = useState('Frontend Developer - ABC Tech Pvt Ltd');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Available jobs options from image #2
  const requirementJobs = [
    'Frontend Developer - ABC Tech Pvt Ltd',
    'Java Developer - Infoswift Solutions',
    'Backend Developer - TechWave Systems',
    'QA Engineer - X Corp',
    'DevOps Engineer - CloudMatrix'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      setSubmitting(false);
      onSubmitSuccess(candidate.name, selectedJob.split(' - ')[0]);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="w-full max-w-4xl bg-[#090D1A] border border-app-border rounded-[32px] overflow-hidden shadow-2xl animate-scale-up text-app-text">
        
        {/* Header */}
        <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
          <div>
            <h3 className="font-display font-extrabold text-lg text-app-text flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-blue" />
              Submit Candidate Profile
            </h3>
            <p className="text-[10px] text-app-muted font-semibold">Submit the selected candidate to a active job requirement.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Grid split to match Image #5 */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-app-border/40">
            
            {/* Left Column: Candidate Overview (5 cols) */}
            <div className="md:col-span-5 p-8 space-y-6">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Candidate to Submit</span>
              
              <div className="p-6 rounded-2xl bg-app-surface border border-app-border space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-sm font-extrabold font-mono shrink-0">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-app-text">{candidate.name}</h4>
                    <p className="text-xs text-app-muted mt-0.5">{candidate.experience} Experience</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-app-border/40 space-y-3 text-xs">
                  <div>
                    <span className="text-app-muted block">Experience</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.years} Years</span>
                  </div>
                  <div>
                    <span className="text-app-muted block">Current Company</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.currentCompany}</span>
                  </div>
                  <div>
                    <span className="text-app-muted block">Current Role</span>
                    <span className="font-bold text-app-text mt-0.5 block">{candidate.details.currentRole}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-3 border-t border-app-border/30">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="text-[9px] font-mono font-semibold bg-app-bg px-2 py-0.5 rounded-md border border-app-border text-app-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Submission details form (7 cols) */}
            <div className="md:col-span-7 p-8 space-y-6">
              
              {/* Select Job Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Select Job Requirement</label>
                <select 
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                  required
                >
                  {requirementJobs.map((job, idx) => (
                    <option key={idx} value={job}>{job}</option>
                  ))}
                </select>
                <p className="text-[10px] text-app-muted font-bold">Only open requirements with approved recruiter access are shown.</p>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the candidate (strengths, comments, references etc.). This will be shared directly with the BDM."
                  maxLength={500}
                  className="w-full h-44 bg-app-surface border border-app-border rounded-xl p-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-app-muted font-bold">
                  <span>Honesty assessment is recommended.</span>
                  <span>{notes.length}/500 letters</span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Controls */}
          <div className="h-18 border-t border-app-border/40 px-6 flex items-center justify-between bg-app-surface/10">
            <div className="flex items-center gap-1.5 text-[10px] text-app-muted font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-brand-blue" /> Secure submission tunnel
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-app-surface border border-app-border text-app-text hover:bg-app-bg text-xs font-bold rounded-xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Profile...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>

    </div>
  );
}