import { 
  X, 
  ArrowLeft, 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  Sparkles,
  MapPin,
  Compass
} from 'lucide-react';
import { CandidateProfile } from '../pages/CandidatePoolTab';

interface CandidatePreviewModalProps {
  candidate: CandidateProfile | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onSelectToggle: () => void;
}

export default function CandidatePreviewModal({ 
  candidate, 
  isOpen, 
  onClose, 
  isSelected, 
  onSelectToggle 
}: CandidatePreviewModalProps) {
  
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      <div className="w-full max-w-4xl bg-[#090D1A] border border-app-border rounded-[32px] overflow-hidden shadow-2xl animate-scale-up text-app-text">
        
        {/* Top bar control */}
        <div className="h-16 border-b border-app-border/60 px-6 flex items-center justify-between bg-app-surface/20">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-app-muted hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Pool
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                onSelectToggle();
              }}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                isSelected 
                  ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                  : 'bg-white/5 text-brand-blue border-brand-blue/30 hover:bg-brand-blue hover:text-white'
              }`}
            >
              {isSelected ? '✓ Selected Candidate' : 'Select Candidate'}
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content body split to match Image #8 exactly */}
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-app-border/40">
          
          {/* Left Panel: Profile summary (4 cols) */}
          <div className="md:col-span-5 p-8 text-center space-y-6 flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-brand-blue/10 border-4 border-app-border flex items-center justify-center text-brand-blue font-extrabold text-3xl font-mono relative shrink-0">
              {candidate.name.split(' ').map(n => n[0]).join('')}
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#090D1A] flex items-center justify-center">
                <CheckCircle className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-extrabold text-app-text">{candidate.name}</h3>
              <p className="text-xs font-mono font-extrabold text-brand-blue uppercase tracking-wider bg-brand-blue/5 border border-brand-blue/10 px-3 py-1 rounded-full inline-block">
                {candidate.experience} Experience
              </p>
              <p className="text-sm font-semibold text-app-muted mt-2">{candidate.details.role}</p>
            </div>

            {/* List of Skills tags */}
            <div className="w-full pt-4 border-t border-app-border/40">
              <h4 className="text-left text-xs font-bold text-app-muted uppercase tracking-wider mb-3">Skills Stack</h4>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {candidate.details.skillsFull.map((skill, index) => (
                  <span key={index} className="text-[10px] font-mono font-semibold bg-app-surface border border-app-border px-2.5 py-1 rounded-lg text-app-text">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: High fidelity particulars (7 cols) */}
          <div className="md:col-span-7 p-8 space-y-8">
            <div>
              <h4 className="font-display font-extrabold text-base text-app-text mb-4">Professional Record</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-app-surface/60 rounded-xl border border-app-border">
                  <span className="text-[10px] font-bold text-app-muted uppercase block">Experience</span>
                  <span className="text-sm font-extrabold text-app-text mt-1 block">{candidate.details.years} Years</span>
                </div>
                <div className="p-4 bg-app-surface/60 rounded-xl border border-app-border">
                  <span className="text-[10px] font-bold text-app-muted uppercase block">Current Company</span>
                  <span className="text-sm font-extrabold text-app-text mt-1 block">{candidate.details.currentCompany}</span>
                </div>
                <div className="p-4 bg-app-surface/60 rounded-xl border border-app-border">
                  <span className="text-[10px] font-bold text-app-muted uppercase block">Current Role</span>
                  <span className="text-sm font-extrabold text-app-text mt-1 block">{candidate.details.currentRole}</span>
                </div>
                <div className="p-4 bg-app-surface/60 rounded-xl border border-app-border">
                  <span className="text-[10px] font-bold text-app-muted uppercase block">Availability</span>
                  <span className="text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 px-2.5 py-1 rounded-full inline-block mt-1">
                    {candidate.details.availabilityDetails}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated resume / background sections */}
            <div className="space-y-3">
              <h4 className="font-display font-extrabold text-xs text-app-muted uppercase tracking-wider">Candidate Background</h4>
              <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2 text-xs text-app-muted leading-relaxed">
                <p>• Proven record of leading enterprise architectures and client facing interfaces.</p>
                <p>• Highly structured workflow adhering to modular guidelines, git safety and production builds.</p>
                <p>• Recommended for senior requirements and high priority positions due to fast learning cycles.</p>
              </div>
            </div>

            {/* Note banner matching Screen #9 exact color theme and text */}
            <div className="p-4 bg-brand-violet/5 border border-brand-violet/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
              <p className="text-xs text-app-muted leading-relaxed font-semibold">
                <strong className="text-brand-violet block mb-0.5">Note: Limited Preview</strong>
                This is a limited preview. Full profile resume download, contact credentials and background screenings will be accessible on BDM manager approval of the submittal.
              </p>
            </div>

          </div>

        </div>

        {/* Footer controls */}
        <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/10 gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-app-surface border border-app-border text-app-text hover:bg-app-bg text-xs font-bold rounded-xl transition-colors"
          >
            Close Detail
          </button>
          
          <button 
            onClick={() => {
              onSelectToggle();
              onClose();
            }}
            className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-extrabold shadow-lg shadow-brand-blue/15"
          >
            {isSelected ? 'Deselect & Close' : 'Select & Close'}
          </button>
        </div>

      </div>

    </div>
  );
}