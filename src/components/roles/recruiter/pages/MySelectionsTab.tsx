import React, { useState, useEffect } from 'react';
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
  HelpCircle,
  Clock,
  Edit2,
  Check,
  X,
  Sparkles,
  Download,
  Eye
} from 'lucide-react';
import { recruiterStorage, CandidateSelection, RecruiterJob } from '../utils/recruiterStorage';

interface MySelectionsTabProps {
  selectedCandidateIds: string[];
  onDeselect: (id: string) => void;
  onNavigate: (tab: string) => void;
  candidates?: any;
  onSubmitProfile?: any;
}

export default function MySelectionsTab({ 
  selectedCandidateIds, 
  onDeselect,
  onNavigate
}: MySelectionsTabProps) {

  const [selections, setSelections] = useState<CandidateSelection[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [editSelectionModal, setEditSelectionModal] = useState<CandidateSelection | null>(null);
  const [editJobId, setEditJobId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load from localStorage on mount and sync
  const loadData = () => {
    setSelections(recruiterStorage.getSelections());
    setJobs(recruiterStorage.getJobs());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  // Filter accessible jobs for edit dropdown
  const accessibleJobs = jobs.filter(j => j.jobType === 'open' || j.accessStatus === 'approved');

  // Recruiter info
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

  // Submit action: triggers the live BDM Submission process
  const handleSubmitToBdm = (sel: CandidateSelection) => {
    // 1. Remove from selections
    const remainingSelections = selections.filter(s => s.id !== sel.id);
    recruiterStorage.setSelections(remainingSelections);
    setSelections(remainingSelections);

    // 2. Trigger parent deselect to sync counter
    onDeselect(sel.candidateId);

    // 3. Create a live candidate submission record
    const currentSubmissions = recruiterStorage.getSubmissions();
    const newSubmission = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      jobId: sel.jobId,
      jobTitle: sel.jobTitle,
      companyName: sel.companyName,
      candidateId: sel.candidateId,
      candidateName: sel.candidateName,
      candidateResume: `${sel.candidateName.replace(' ', '_')}_Resume.pdf`,
      submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedBy: recruiterInfo.name,
      assignedBdm: 'John Mathew',
      status: 'Submitted' as const,
      lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: sel.notes || 'Submitted from curated selections queue.'
    };

    recruiterStorage.setSubmissions([newSubmission, ...currentSubmissions]);

    // Show success message
    setSuccessMessage(`Successfully submitted ${sel.candidateName} for ${sel.jobTitle} to BDM John Mathew!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Remove selection from queue
  const handleRemoveSelection = (selId: string, candId: string) => {
    const remaining = selections.filter(s => s.id !== selId);
    recruiterStorage.setSelections(remaining);
    setSelections(remaining);
    onDeselect(candId);
  };

  // Save edited job for a selection
  const handleSaveEditJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSelectionModal || !editJobId) return;

    const selectedJob = accessibleJobs.find(j => j.id === editJobId);
    if (selectedJob) {
      const updatedSelections = selections.map(s => {
        if (s.id === editSelectionModal.id) {
          return {
            ...s,
            jobId: selectedJob.id,
            jobTitle: selectedJob.title,
            companyName: selectedJob.company
          };
        }
        return s;
      });
      recruiterStorage.setSelections(updatedSelections);
      setSelections(updatedSelections);
      setEditSelectionModal(null);
      setSuccessMessage(`Successfully updated job alignment to ${selectedJob.title}!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Alert */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-[#0B1528] border-2 border-emerald-500 text-app-text px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
          <span className="font-bold text-sm">{successMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text font-display">Selected Candidates Queue</h1>
        <p className="text-app-muted mt-1">Review your Selected Candidates Queue. Edit alignment, remove, or submit queued candidates to start the live BDM review process.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Recruiter Card Panel */}
        <div className="xl:col-span-4 space-y-6">
          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow relative overflow-hidden">
            {/* Header backdrop gradient */}
            <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-r from-brand-blue/20 to-brand-violet/20" />
            
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
                <span>Selected Queue Size</span>
                <span className="text-app-text">{selections.length} / 18 Cap</span>
              </div>
              <div className="w-full bg-app-surface border border-app-border rounded-full h-2">
                <div 
                  className="bg-brand-blue h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((selections.length / 18) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-app-muted mt-2 leading-relaxed">
                You can select up to 18 candidates at once of your allocated pool to pipeline into active submissions.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Selections Queue List (Table & Controls) */}
        <div className="xl:col-span-8 p-6 rounded-[28px] glass border border-app-border card-shadow space-y-6">
          <div className="flex justify-between items-center border-b border-app-border pb-4">
            <div>
              <h3 className="font-display font-bold text-lg text-app-text">
                Selected Candidates Queue
              </h3>
              <p className="text-xs text-app-muted mt-0.5">Pipeline candidates into active job submittals.</p>
            </div>
            <span className="text-xs font-bold text-app-muted bg-app-bg px-3 py-1.5 rounded-full border border-app-border font-mono">
              Total Drafts: {selections.length}
            </span>
          </div>

          {selections.length > 0 ? (
            <div className="space-y-4">
              {selections.map((sel) => (
                <div 
                  key={sel.id} 
                  className="p-5 rounded-2xl bg-app-surface/60 border border-app-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-blue/30 transition-all group relative"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Circle Avatar */}
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-sm font-extrabold font-mono shrink-0">
                      {sel.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-app-text">{sel.candidateName}</h4>
                        <span className="text-[10px] bg-brand-violet/15 text-brand-violet px-2.5 py-0.5 rounded-full font-extrabold font-mono uppercase tracking-wider">
                          {sel.status}
                        </span>
                      </div>
                      
                      {/* Job specifications */}
                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-app-muted font-bold">
                        <Briefcase className="w-3.5 h-3.5 text-app-muted shrink-0" />
                        <span className="text-app-text">{sel.jobTitle}</span>
                        <span>at</span>
                        <span className="text-app-muted">{sel.companyName}</span>
                      </div>

                      {/* Date & Resume info */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-app-muted font-semibold mt-1.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-app-muted" /> Selected: {sel.selectionDate}
                        </span>
                        
                        {/* Resume representation */}
                        <span className="flex items-center gap-1 text-brand-blue font-bold cursor-pointer hover:underline">
                          <FileText className="w-3.5 h-3.5" /> {sel.candidateName.replace(' ', '_')}_Resume.pdf 
                          <Download className="w-3 h-3 text-brand-blue" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions segment */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-app-border/40 shrink-0">
                    <button 
                      onClick={() => alert(`Previewing Resume for ${sel.candidateName}`)}
                      className="px-3 py-2 bg-app-surface text-app-muted hover:text-brand-blue border border-app-border rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                      title="Preview Resume"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Resume</span>
                    </button>

                    <button 
                      onClick={() => {
                        setEditSelectionModal(sel);
                        setEditJobId(sel.jobId);
                      }}
                      className="px-3 py-2 bg-app-surface text-app-muted hover:text-brand-blue border border-app-border rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                      title="Change Job"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Change Job</span>
                    </button>

                    <button 
                      onClick={() => handleRemoveSelection(sel.id, sel.candidateId)}
                      className="px-3 py-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl border border-red-500/10 text-xs font-semibold transition-all flex items-center gap-1.5"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                    
                    <button 
                      onClick={() => handleSubmitToBdm(sel)}
                      className="px-4 py-2 bg-brand-blue text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-blue/15 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit</span>
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
                <p className="font-display font-bold text-lg text-app-text">Your selected roster queue is empty</p>
                <p className="text-xs text-app-muted mt-2 leading-relaxed">
                  Go to the <strong>Candidate Pool</strong> tab, select candidates and align them to jobs to add them here.
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

          {/* Work Info table */}
          <div className="mt-8 pt-8 border-t border-app-border/60">
            <h4 className="font-display font-extrabold text-sm text-app-text mb-4">Sourcing Verticals</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Preferred Verticals:</span>
                <span className="text-app-text">{recruiterInfo.preferredRoles}</span>
              </div>
              <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center">
                <span className="text-app-muted">Reporting Manager:</span>
                <span className="text-app-text">{recruiterInfo.bdm}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* EDIT ALIGNMENT POPUP */}
      {/* ---------------------------------------------------- */}
      {editSelectionModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <h3 className="font-display font-extrabold text-base text-app-text">
                Edit Alignment - {editSelectionModal.candidateName}
              </h3>
              <button 
                onClick={() => setEditSelectionModal(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditJob} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Change Assigned Job</label>
                <select 
                  value={editJobId}
                  onChange={(e) => setEditJobId(e.target.value)}
                  className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                  required
                >
                  {accessibleJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-app-muted">Selecting an alternative accessible requirement will update the queue row.</p>
              </div>

              <div className="pt-4 border-t border-app-border/40 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setEditSelectionModal(null)}
                  className="px-4 py-2 bg-app-surface border border-app-border hover:bg-app-bg text-app-text text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
