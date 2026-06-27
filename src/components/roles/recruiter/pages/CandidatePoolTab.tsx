import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  AlertCircle,
  Sparkles,
  UserCheck,
  Check,
  X,
  Briefcase,
  Layers,
  HelpCircle,
  FileClock,
  ExternalLink,
  Users
} from 'lucide-react';
import { recruiterStorage, RecruiterCandidate, RecruiterJob, CandidateAccessRequest, CandidateSelection } from '../utils/recruiterStorage';

export type CandidateProfile = RecruiterCandidate;

interface CandidatePoolTabProps {
  selectedCandidates: string[];
  onToggleSelect: (id: string) => void;
  onPreviewCandidate: (id: string) => void;
}

export default function CandidatePoolTab({ 
  selectedCandidates, 
  onToggleSelect, 
  onPreviewCandidate 
}: CandidatePoolTabProps) {
  
  // Storage state
  const [candidates, setCandidates] = useState<RecruiterCandidate[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [accessRequests, setAccessRequests] = useState<CandidateAccessRequest[]>([]);
  
  // Page UI tabs
  const [activeSubTab, setActiveSubTab] = useState<'available' | 'assigned' | 'pending' | 'suggested'>('available');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');

  // Popup / Job Selection state
  const [selectCandidateModal, setSelectCandidateModal] = useState<RecruiterCandidate | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmittingSelection, setIsSubmittingSelection] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Load datasets
  useEffect(() => {
    setCandidates(recruiterStorage.getCandidates());
    setJobs(recruiterStorage.getJobs());
    setAccessRequests(recruiterStorage.getAccessRequests());

    const handleStorageChange = () => {
      setCandidates(recruiterStorage.getCandidates());
      setJobs(recruiterStorage.getJobs());
      setAccessRequests(recruiterStorage.getAccessRequests());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter candidates on Search and Skill selection
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cand.skills.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkill = skillFilter === 'All' || cand.skills.includes(skillFilter);
    return matchesSearch && matchesSkill;
  });

  // Filter assigned pool candidates specifically (e.g. Ravi, Priya, Akash, Sneha, Karthik)
  const assignedCandidates = filteredCandidates.filter(c => ['c1', 'c2', 'c3', 'c4', 'c5'].includes(c.id));

  // Get only jobs the recruiter has access to (Open to All or approved Assigned jobs)
  const accessibleJobs = jobs.filter(j => j.jobType === 'open' || j.accessStatus === 'approved');

  // Handle select candidate action (opens popup to choose job)
  const handleOpenSelectPopup = (cand: RecruiterCandidate) => {
    setSelectCandidateModal(cand);
    // Auto-select the first accessible job if available
    if (accessibleJobs.length > 0) {
      setSelectedJobId(accessibleJobs[0].id);
    } else {
      setSelectedJobId('');
    }
    setNotes('');
  };

  // Handle submitting candidate directly from popup (creates entry in candidate_submissions collection)
  const handleConfirmSelection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectCandidateModal || !selectedJobId) return;

    setIsSubmittingSelection(true);
    const targetJob = accessibleJobs.find(j => j.id === selectedJobId);

    setTimeout(() => {
      if (targetJob) {
        const currentSubmissions = recruiterStorage.getSubmissions();
        
        // Check if already submitted for this exact job to prevent duplicates
        const exists = currentSubmissions.some(s => s.candidateId === selectCandidateModal.id && s.jobId === selectedJobId);
        if (!exists) {
          const newSubmission = {
            id: `SUB-${Date.now().toString().slice(-6)}`,
            jobId: targetJob.id,
            jobTitle: targetJob.title,
            companyName: targetJob.company,
            candidateId: selectCandidateModal.id,
            candidateName: selectCandidateModal.name,
            candidateResume: `${selectCandidateModal.name.replace(' ', '_')}_Resume.pdf`,
            submissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            submittedBy: 'Rohit Kumar',
            assignedBdm: targetJob.bdm,
            status: 'Submitted' as const,
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            notes: notes || 'Submitted directly from available candidate pool.'
          };
          
          recruiterStorage.setSubmissions([newSubmission, ...currentSubmissions]);
          
          // Trigger toggle select in parent to update counter if needed
          onToggleSelect(selectCandidateModal.id);

          setToastMsg(`Successfully submitted ${selectCandidateModal.name} for ${targetJob.title} at ${targetJob.company}!`);
          setTimeout(() => setToastMsg(''), 5000);
        } else {
          setToastMsg(`Note: ${selectCandidateModal.name} is already submitted for ${targetJob.title}.`);
          setTimeout(() => setToastMsg(''), 5000);
        }
      }

      setIsSubmittingSelection(false);
      setSelectCandidateModal(null);
    }, 1200);
  };

  // Handle adding candidate to the Selected Queue (Draft) instead of submitting directly
  const handleQueueSelection = () => {
    if (!selectCandidateModal || !selectedJobId) return;
    const targetJob = accessibleJobs.find(j => j.id === selectedJobId);
    if (targetJob) {
      const currentSelections = recruiterStorage.getSelections();
      const exists = currentSelections.some(s => s.candidateId === selectCandidateModal.id && s.jobId === selectedJobId);
      if (!exists) {
        const newSelection: CandidateSelection = {
          id: `sel-${Date.now()}`,
          candidateId: selectCandidateModal.id,
          candidateName: selectCandidateModal.name,
          jobId: targetJob.id,
          jobTitle: targetJob.title,
          companyName: targetJob.company,
          selectionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: 'Draft',
          notes: notes
        };
        recruiterStorage.setSelections([newSelection, ...currentSelections]);
        onToggleSelect(selectCandidateModal.id);
        setToastMsg(`Successfully added ${selectCandidateModal.name} to Selected Candidates Queue!`);
        setTimeout(() => setToastMsg(''), 5000);
      } else {
        setToastMsg(`Note: ${selectCandidateModal.name} is already in your Selections Queue.`);
        setTimeout(() => setToastMsg(''), 5000);
      }
    }
    setSelectCandidateModal(null);
  };

  // Handle BDM approval action on Pending Requests (no simulation, true relational updates)
  const handleApproveRequest = (reqId: string) => {
    const requests = recruiterStorage.getAccessRequests();
    const targetReq = requests.find(r => r.id === reqId);
    if (targetReq) {
      // 1. Update request status to Approved
      const updatedRequests = requests.map(r => {
        if (r.id === reqId) {
          return { ...r, status: 'Approved' as const };
        }
        return r;
      });
      setAccessRequests(updatedRequests);
      recruiterStorage.setAccessRequests(updatedRequests);

      // 2. Update the corresponding job accessStatus to approved
      const currentJobs = recruiterStorage.getJobs();
      const updatedJobs = currentJobs.map(j => {
        if (j.id === targetReq.jobId) {
          return { ...j, accessStatus: 'approved' as const };
        }
        return j;
      });
      setJobs(updatedJobs);
      recruiterStorage.setJobs(updatedJobs);

      // 3. Post a system notification
      const currentNotifications = recruiterStorage.getNotifications();
      recruiterStorage.setNotifications([
        {
          id: `n-${Date.now()}`,
          type: 'approve',
          title: 'Job Access Approved',
          desc: `Your access request for ${targetReq.jobTitle} has been approved by the BDM.`,
          time: 'Just now'
        },
        ...currentNotifications
      ]);

      setToastMsg(`Access approved for ${targetReq.jobTitle}! You can now map candidates to this job.`);
      setTimeout(() => setToastMsg(''), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#0B1528] border-2 border-brand-blue text-app-text px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header Segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Candidates</h1>
          <p className="text-app-muted mt-1">Manage pool allocations, track access approvals, and align candidates to approved jobs.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-app-muted bg-app-surface border border-app-border px-3.5 py-2.5 rounded-xl">
            Queued: <span className="text-brand-blue font-extrabold">{selectedCandidates.length}</span> / 18 Cap
          </span>
          <button className="px-4 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold shrink-0 shadow-lg shadow-brand-blue/15">
            {candidates.length} Available Pool
          </button>
        </div>
      </div>

      {/* High Fidelity Tabs Segment */}
      <div className="flex border-b border-app-border/60 pb-px gap-1 overflow-x-auto">
        {[
          { id: 'available', label: 'Available Candidate Pool', icon: Users, badge: candidates.length },
          { id: 'assigned', label: 'Assigned Candidate Pool', icon: UserCheck, badge: 5 },
          { id: 'pending', label: 'Pending Candidate Requests', icon: FileClock, badge: accessRequests.filter(r => r.status === 'Pending').length },
          { id: 'suggested', label: 'Suggested Candidates (AI)', icon: Sparkles, extra: 'Coming Soon' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3.5 border-b-2 font-bold text-xs whitespace-nowrap transition-all duration-200 relative ${
                isActive 
                  ? 'border-brand-blue text-brand-blue bg-brand-blue/5 rounded-t-xl' 
                  : 'border-transparent text-app-muted hover:text-app-text'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-brand-blue text-white' : 'bg-app-surface text-app-muted border border-app-border'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.extra && (
                <span className="text-[9px] uppercase tracking-wider bg-brand-violet/20 text-brand-violet px-2 py-0.5 rounded-full font-bold">
                  {tab.extra}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* VIEW A: AVAILABLE CANDIDATE POOL */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'available' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Action and Search Rails */}
          <div className="p-4 rounded-2xl glass border border-app-border flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input 
                type="text" 
                placeholder="Search candidates by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
              <select 
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
              >
                <option value="All">All Skillsets</option>
                <option value="React">React</option>
                <option value="Java">Java</option>
                <option value="AWS">AWS</option>
                <option value="Python">Python</option>
                <option value="UI/UX">UI/UX</option>
              </select>
              
              <button className="p-3 bg-app-surface border border-app-border rounded-xl text-app-muted hover:text-app-text transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Candidate Table */}
          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-4 px-3 w-12 text-center">#</th>
                    <th className="py-4 px-4">Candidate Name</th>
                    <th className="py-4 px-4">Experience</th>
                    <th className="py-4 px-4">Key Skills</th>
                    <th className="py-4 px-4">Availability</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((cand, index) => {
                      const isSelectedInRoster = selectedCandidates.includes(cand.id);
                      return (
                        <tr 
                          key={cand.id} 
                          className={`group transition-colors hover:bg-app-surface/40 ${
                            isSelectedInRoster ? 'bg-brand-blue/5' : ''
                          }`}
                        >
                          <td className="py-4 px-3 text-center text-xs font-mono font-bold text-app-muted">{index + 1}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono shrink-0">
                                {cand.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <button 
                                  onClick={() => onPreviewCandidate(cand.id)}
                                  className="font-bold text-app-text hover:text-brand-blue text-left transition-colors flex items-center gap-1.5"
                                >
                                  {cand.name}
                                  <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-blue transition-opacity" />
                                </button>
                                <span className="text-[10px] font-semibold text-app-muted block mt-0.5">{cand.details.role}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-app-text text-sm">{cand.experience}</td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1.5">
                              {cand.skills.map((skill, sIdx) => (
                                <span key={sIdx} className="text-[10px] font-mono font-extrabold border bg-indigo-500/5 text-indigo-400 border-indigo-500/10 px-2 py-0.5 rounded-lg">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                              {cand.availability}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => onPreviewCandidate(cand.id)}
                                className="p-2 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-violet rounded-xl border border-app-border transition-colors"
                                title="Preview Resume"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                              
                              <button 
                                onClick={() => handleOpenSelectPopup(cand)}
                                className="px-5 py-2 bg-white text-brand-blue border border-brand-blue hover:bg-brand-blue hover:text-white rounded-xl text-xs font-extrabold transition-all"
                              >
                                Select
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-app-muted">
                        <AlertCircle className="w-10 h-10 text-app-muted mx-auto mb-3" />
                        <p className="font-semibold text-app-text text-sm">No pool candidates found</p>
                        <p className="text-xs text-app-muted mt-1">Refine your search parameters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW B: ASSIGNED CANDIDATE POOL */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'assigned' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20 text-xs font-semibold text-app-text flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-blue" />
            <span>These are 5 candidates allocated to your workspace specifically by BDM John Mathew.</span>
          </div>

          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-4 px-3 w-12 text-center">#</th>
                    <th className="py-4 px-4">Candidate Name</th>
                    <th className="py-4 px-4">Experience</th>
                    <th className="py-4 px-4">Key Skills</th>
                    <th className="py-4 px-4">Availability</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {assignedCandidates.map((cand, index) => (
                    <tr key={cand.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-3 text-center text-xs font-mono font-bold text-app-muted">{index + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono shrink-0">
                            {cand.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <span className="font-bold text-app-text block">{cand.name}</span>
                            <span className="text-[10px] font-semibold text-app-muted block mt-0.5">{cand.details.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-app-text text-sm">{cand.experience}</td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {cand.skills.map((skill, sIdx) => (
                            <span key={sIdx} className="text-[10px] font-mono font-semibold bg-app-surface border border-app-border px-2.5 py-0.5 rounded-lg text-app-text">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          {cand.availability}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => onPreviewCandidate(cand.id)}
                            className="p-2 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-violet rounded-xl border border-app-border transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleOpenSelectPopup(cand)}
                            className="px-5 py-2 bg-brand-blue text-white rounded-xl text-xs font-extrabold shadow-sm"
                          >
                            Select
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW C: PENDING CANDIDATE REQUESTS */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'pending' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-app-text">Profile Access Logs</h3>
                <p className="text-xs text-app-muted mt-0.5">Track requests sent to BDMs for specific candidates or locked pools.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-4 px-4">Request ID</th>
                    <th className="py-4 px-4">Candidate Profile</th>
                    <th className="py-4 px-4">Target Job</th>
                    <th className="py-4 px-4">Request Date</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {accessRequests.map((req) => {
                    let pill = '';
                    if (req.status === 'Pending') pill = 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
                    if (req.status === 'Approved') pill = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                    if (req.status === 'Completed') pill = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    if (req.status === 'Rejected') pill = 'bg-red-500/10 text-red-500 border-red-500/20';

                    return (
                      <tr key={req.id} className="hover:bg-app-surface/30 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-xs text-brand-blue">{req.id.toUpperCase()}</td>
                        <td className="py-4 px-4 font-bold text-app-text">{req.candidateName}</td>
                        <td className="py-4 px-4 text-xs font-semibold text-app-muted">{req.jobTitle}</td>
                        <td className="py-4 px-4 text-xs font-mono">{req.requestDate}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase border px-2.5 py-1 rounded-full ${pill}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === 'Pending' && (
                              <button 
                                onClick={() => handleApproveRequest(req.id)}
                                className="px-3 py-1 bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-all"
                              >
                                Approve (BDM Demo)
                              </button>
                            )}
                            <button className="text-xs text-brand-blue hover:underline font-bold flex items-center gap-1">
                              Details <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW D: SUGGESTED CANDIDATES */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'suggested' && (
        <div className="p-12 text-center rounded-[32px] glass border border-app-border bg-gradient-to-br from-brand-violet/5 to-brand-blue/5">
          <Sparkles className="w-12 h-12 text-brand-violet mx-auto mb-4 animate-pulse" />
          <h3 className="font-display font-bold text-xl text-app-text">AI suggested candidate pairing</h3>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-violet/20 text-brand-violet font-mono">
            Coming Soon
          </span>
          <p className="text-app-muted text-sm max-w-md mx-auto mt-4 leading-relaxed">
            Automatic resume-to-JD alignment score indexing is currently being calibrated for our recruiters. No mock actions are enabled to avoid staging issues.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* CHOOSE JOB POPUP (SELECTION FLOW) */}
      {/* ---------------------------------------------------- */}
      {selectCandidateModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text">
            
            {/* Header */}
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20">
              <div>
                <h3 className="font-display font-extrabold text-base text-app-text flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-brand-blue" />
                  Select Job for {selectCandidateModal.name}
                </h3>
                <p className="text-[10px] text-app-muted font-semibold">Align candidate profile to one of your active requirements.</p>
              </div>
              <button 
                onClick={() => setSelectCandidateModal(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSelection} className="p-6 space-y-5">
              
              {/* Candidate Quick info */}
              <div className="p-4 rounded-xl bg-app-surface/80 border border-app-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono shrink-0">
                  {selectCandidateModal.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-app-text">{selectCandidateModal.name}</h4>
                  <p className="text-xs text-app-muted">{selectCandidateModal.details.role} • {selectCandidateModal.experience} Exp</p>
                </div>
              </div>

              {/* Job selection dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Target Job Requirement</label>
                {accessibleJobs.length > 0 ? (
                  <select 
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                    required
                  >
                    {accessibleJobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title} - {job.company} ({job.jobType === 'open' ? 'Open' : 'Approved'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>No accessible jobs! Please go to Available Jobs page and unlock some requirements first.</span>
                  </div>
                )}
                <p className="text-[10px] text-app-muted/80">Only open requirements or approved assigned jobs are shown in this list.</p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Candidate Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Include any specific remarks or notes for BDM review..."
                  className="w-full h-24 bg-app-surface border border-app-border rounded-xl p-3 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none"
                  maxLength={250}
                />
              </div>

              {/* Controls */}
              <div className="pt-4 border-t border-app-border/40 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectCandidateModal(null)}
                  className="px-4 py-2.5 bg-app-surface border border-app-border hover:bg-app-bg text-app-text text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                
                <button 
                  type="button"
                  onClick={handleQueueSelection}
                  disabled={isSubmittingSelection || !selectedJobId}
                  className="px-4 py-2.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue text-xs font-bold rounded-xl transition-all"
                >
                  Queue Candidate (Draft)
                </button>
                
                <button 
                  type="submit"
                  disabled={isSubmittingSelection || !selectedJobId}
                  className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingSelection ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Submit Candidate
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
