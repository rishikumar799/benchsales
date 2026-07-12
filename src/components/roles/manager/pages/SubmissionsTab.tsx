import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Briefcase, 
  Users, 
  Calendar, 
  AlertCircle,
  Clock, 
  SlidersHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Activity,
  X,
  FileText,
  Sparkles,
  ChevronRight,
  Info,
  CornerDownRight,
  MessageSquare,
  MapPin,
  TrendingUp,
  User,
  ArrowRight
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc
} from 'firebase/firestore';

interface TimelineItem {
  action: string;
  performedByUid: string;
  performedByName: string;
  performedByRole: string;
  remarks: string;
  timestamp: string;
}

interface SubmissionType {
  id: string;
  submissionId: string;
  candidateUid: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateResume: string;
  recruiterUid: string;
  recruiterName: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  bdmUid: string;
  assignedBdm: string;
  status: string;
  submittedAt: string;
  updatedAt: string;
  lastUpdated: string;
  submissionDate: string;
  notes?: string;
  timeline?: TimelineItem[];
}

export default function SubmissionsTab() {
  const [submissions, setSubmissions] = useState<SubmissionType[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bdmProfile, setBdmProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [recruiterFilter, setRecruiterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  // Selected Submission ID for full details loading
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  // Real-time states for the selected dossier
  const [activeSubmission, setActiveSubmission] = useState<SubmissionType | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<any>(null);
  const [activeJob, setActiveJob] = useState<any>(null);

  // State to handle the status updates and timeline remarks
  const [targetStatus, setTargetStatus] = useState<string>('');
  const [remarksInput, setRemarksInput] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Realtime Auth and BDM Profile synchronization
  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (!user) {
        setSubmissions([]);
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setBdmProfile(null);
      return;
    }
    const bdmRef = doc(db, 'marketplace_bdms', currentUser.uid);
    const unsubProfile = onSnapshot(bdmRef, (snap) => {
      if (snap.exists()) {
        setBdmProfile(snap.data());
      } else {
        setBdmProfile(null);
      }
    }, (err) => {
      console.warn("Error loading BDM profile:", err);
    });
    return () => unsubProfile();
  }, [currentUser]);

  // Realtime Submissions listener matching the current BDM Uid
  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const qSubmissions = query(
      collection(db, 'marketplace_submissions'),
      where('bdmUid', '==', currentUser.uid)
    );

    const unsubSubmissions = onSnapshot(qSubmissions, (snapshot) => {
      const list: SubmissionType[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          submissionId: data.submissionId || docSnap.id,
          candidateUid: data.candidateUid || 'N/A',
          candidateName: data.candidateName || 'Anonymous',
          candidateEmail: data.candidateEmail || 'N/A',
          candidatePhone: data.candidatePhone || 'N/A',
          candidateResume: data.candidateResume || '',
          recruiterUid: data.recruiterUid || 'N/A',
          recruiterName: data.recruiterName || data.submittedBy || 'Marketplace Recruiter',
          jobId: data.jobId || 'N/A',
          jobTitle: data.jobTitle || 'N/A',
          companyName: data.companyName || 'N/A',
          bdmUid: data.bdmUid || 'N/A',
          assignedBdm: data.assignedBdm || 'John Mathew',
          status: data.status || 'submitted',
          submittedAt: data.submittedAt || '',
          updatedAt: data.updatedAt || '',
          lastUpdated: data.lastUpdated || (data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          submissionDate: data.submissionDate || (data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          notes: data.notes || '',
          timeline: data.timeline || []
        });
      });

      // Sort by submittedAt descending
      list.sort((a, b) => {
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return timeB - timeA;
      });

      setSubmissions(list);
      setLoading(false);
    }, (err) => {
      console.error("Submissions load error:", err);
      setLoading(false);
    });

    return () => unsubSubmissions();
  }, [currentUser]);

  // Real-time listeners for active dossier components
  useEffect(() => {
    if (!selectedSubmissionId) {
      setActiveSubmission(null);
      return;
    }

    const subRef = doc(db, 'marketplace_submissions', selectedSubmissionId);
    const unsub = onSnapshot(subRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const activeSub: SubmissionType = {
          id: snap.id,
          submissionId: data.submissionId || snap.id,
          candidateUid: data.candidateUid || 'N/A',
          candidateName: data.candidateName || 'Anonymous',
          candidateEmail: data.candidateEmail || 'N/A',
          candidatePhone: data.candidatePhone || 'N/A',
          candidateResume: data.candidateResume || '',
          recruiterUid: data.recruiterUid || 'N/A',
          recruiterName: data.recruiterName || data.submittedBy || 'Marketplace Recruiter',
          jobId: data.jobId || 'N/A',
          jobTitle: data.jobTitle || 'N/A',
          companyName: data.companyName || 'N/A',
          bdmUid: data.bdmUid || 'N/A',
          assignedBdm: data.assignedBdm || 'John Mathew',
          status: data.status || 'submitted',
          submittedAt: data.submittedAt || '',
          updatedAt: data.updatedAt || '',
          lastUpdated: data.lastUpdated || (data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          submissionDate: data.submissionDate || (data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          notes: data.notes || '',
          timeline: data.timeline || []
        };
        setActiveSubmission(activeSub);
        // Default target status in dropdown
        setTargetStatus(activeSub.status);
      } else {
        setActiveSubmission(null);
      }
    }, (err) => {
      console.error("Error subscribing to active submission:", err);
    });

    return () => unsub();
  }, [selectedSubmissionId]);

  // Decoupled candidate profile listener
  const activeCandidateUid = activeSubmission?.candidateUid;
  useEffect(() => {
    if (!activeCandidateUid || activeCandidateUid === 'N/A') {
      setActiveCandidate(null);
      return;
    }

    const candRef = doc(db, 'marketplace_jobseekers', activeCandidateUid);
    const unsub = onSnapshot(candRef, (snap) => {
      if (snap.exists()) {
        setActiveCandidate({ id: snap.id, ...snap.data() });
      } else {
        setActiveCandidate(null);
      }
    }, (err) => {
      console.error("Error subscribing to active candidate:", err);
    });

    return () => unsub();
  }, [activeCandidateUid]);

  // Decoupled job details listener
  const activeJobId = activeSubmission?.jobId;
  useEffect(() => {
    if (!activeJobId || activeJobId === 'N/A') {
      setActiveJob(null);
      return;
    }

    const jobRef = doc(db, 'marketplace_jobs', activeJobId);
    const unsub = onSnapshot(jobRef, (snap) => {
      if (snap.exists()) {
        setActiveJob({ id: snap.id, ...snap.data() });
      } else {
        setActiveJob(null);
      }
    }, (err) => {
      console.error("Error subscribing to active job:", err);
    });

    return () => unsub();
  }, [activeJobId]);

  // Clean status mappings
  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'shortlisted': return 'Shortlisted';
      case 'interview': return 'Interview';
      case 'selected': return 'Selected';
      case 'offer_released': return 'Offer Released';
      case 'joined': return 'Joined';
      case 'rejected': return 'Rejected';
      default: return status || 'Submitted';
    }
  };

  const getStatusColors = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'submitted':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
      case 'under_review':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
      case 'shortlisted':
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' };
      case 'interview':
        return { bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' };
      case 'selected':
        return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' };
      case 'offer_released':
        return { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400' };
      case 'joined':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
      case 'rejected':
        return { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/20', text: 'text-slate-400' };
    }
  };

  // Compute status counts for automatic real-time Dashboard Counters
  const statusCounts = {
    submitted: submissions.filter(s => s.status?.toLowerCase() === 'submitted').length,
    under_review: submissions.filter(s => s.status?.toLowerCase() === 'under_review').length,
    shortlisted: submissions.filter(s => s.status?.toLowerCase() === 'shortlisted').length,
    interview: submissions.filter(s => s.status?.toLowerCase() === 'interview').length,
    selected: submissions.filter(s => s.status?.toLowerCase() === 'selected').length,
    offer_released: submissions.filter(s => s.status?.toLowerCase() === 'offer_released').length,
    joined: submissions.filter(s => s.status?.toLowerCase() === 'joined').length,
    rejected: submissions.filter(s => s.status?.toLowerCase() === 'rejected').length,
  };

  // Status list for the dynamic counter cards and workflow dropdowns
  const workflowStatuses = [
    { key: 'submitted', label: 'Submitted', count: statusCounts.submitted, desc: 'Fresh Applications' },
    { key: 'under_review', label: 'Under Review', count: statusCounts.under_review, desc: 'Active Screening' },
    { key: 'shortlisted', label: 'Shortlisted', count: statusCounts.shortlisted, desc: 'Client Approved' },
    { key: 'interview', label: 'Interview', count: statusCounts.interview, desc: 'Panels Scheduled' },
    { key: 'selected', label: 'Selected', count: statusCounts.selected, desc: 'Awaiting Offer' },
    { key: 'offer_released', label: 'Offer Released', count: statusCounts.offer_released, desc: 'Offer Extended' },
    { key: 'joined', label: 'Joined', count: statusCounts.joined, desc: 'Successfully Hired' },
    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected, desc: 'Process Stopped' },
  ];

  // Unique list of Job Titles and Recruiters for filters
  const uniqueJobTitles = Array.from(new Set(submissions.map(s => s.jobTitle))).filter(Boolean);
  const uniqueRecruiters = Array.from(new Set(submissions.map(s => s.recruiterName))).filter(Boolean);

  // Update Firestore submission document status & append to timeline
  const handleConfirmStatusChange = async () => {
    if (!selectedSubmissionId || !targetStatus || !currentUser) return;

    setUpdatingStatus(true);
    try {
      const bdmName = bdmProfile?.profile?.fullName || currentUser.displayName || 'Marketplace BDM';
      
      const newTimelineItem: TimelineItem = {
        action: getStatusLabel(targetStatus),
        performedByUid: currentUser.uid,
        performedByName: bdmName,
        performedByRole: 'Marketplace BDM',
        remarks: remarksInput.trim() || `Status updated to ${getStatusLabel(targetStatus)}`,
        timestamp: new Date().toISOString()
      };

      const currentTimeline = activeSubmission?.timeline || [];
      const updatedTimeline = [...currentTimeline, newTimelineItem];

      const subDocRef = doc(db, 'marketplace_submissions', selectedSubmissionId);
      await updateDoc(subDocRef, {
        status: targetStatus,
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        timeline: updatedTimeline
      });

      // Reset feedback fields
      setRemarksInput('');
      setUpdatingStatus(false);
    } catch (err) {
      setUpdatingStatus(false);
      handleFirestoreError(err, OperationType.WRITE, `marketplace_submissions/${selectedSubmissionId}`);
    }
  };

  // Simulate report compilation
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Spreadsheet compiled: Export of active marketplace submittals complete.');
    }, 1200);
  };

  // Filter logic
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJob = jobFilter === 'All' || sub.jobTitle === jobFilter;
    const matchesRecruiter = recruiterFilter === 'All' || sub.recruiterName === recruiterFilter;

    const mappedLabel = getStatusLabel(sub.status);
    const matchesStatus = statusFilter === 'All' || 
                          sub.status?.toLowerCase() === statusFilter?.toLowerCase() ||
                          mappedLabel?.toLowerCase() === statusFilter?.toLowerCase();

    return matchesSearch && matchesJob && matchesRecruiter && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text font-display">Submissions Board</h1>
          <p className="text-app-muted mt-1">Review recruiter candidate submittals and advance their hiring lifecycle stage in real-time.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all active:scale-95 shrink-0 border border-brand-blue/20"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export listings
            </>
          )}
        </button>
      </div>

      {/* Real-time Dashboard Counters (Advance Lifecycle Filter cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {workflowStatuses.map((ws) => {
          const isSelected = statusFilter.toLowerCase() === ws.key.toLowerCase();
          const colors = getStatusColors(ws.key);
          return (
            <button
              key={ws.key}
              onClick={() => setStatusFilter(isSelected ? 'All' : ws.label)}
              className={`p-4 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between h-28 relative overflow-hidden group cursor-pointer ${
                isSelected 
                  ? 'bg-app-surface border-brand-blue ring-1 ring-brand-blue shadow-lg shadow-brand-blue/10' 
                  : 'bg-app-surface/45 border-app-border hover:border-app-muted'
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${colors.text}`}>
                  {ws.label}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-brand-blue animate-pulse' : 'bg-transparent'}`} />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-display font-black text-app-text leading-none">{ws.count}</div>
                <div className="text-[9px] text-app-muted font-bold mt-1 uppercase tracking-widest truncate">{ws.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced filters card */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col xl:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by ID, Candidate Name, Recruiter, or Job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Job Filter */}
          <select 
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3.5 text-xs font-bold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Jobs Requirements</option>
            {uniqueJobTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>

          {/* Recruiter Filter */}
          <select 
            value={recruiterFilter}
            onChange={(e) => setRecruiterFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3.5 text-xs font-bold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Recruiters</option>
            {uniqueRecruiters.map(rec => (
              <option key={rec} value={rec}>{rec}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3.5 text-xs font-bold text-app-text outline-none cursor-pointer flex-1"
          >
            <option value="All">All Statuses (Default)</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Offer Released">Offer Released</option>
            <option value="Joined">Joined</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Submissions table view */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-app-border text-[11px] font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-3">Submission ID</th>
                <th className="py-4 px-3">Candidate</th>
                <th className="py-4 px-3">Submitted By (Recruiter)</th>
                <th className="py-4 px-3">Job Title & Client</th>
                <th className="py-4 px-3">Submitted On</th>
                <th className="py-4 px-3">Last Activity</th>
                <th className="py-4 px-3">Current Status</th>
                <th className="py-4 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => {
                  const sLabel = getStatusLabel(sub.status);
                  const colors = getStatusColors(sub.status);

                  return (
                    <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                      {/* Submission ID */}
                      <td className="py-5 px-3 font-mono font-bold text-xs text-brand-blue">
                        {sub.id}
                      </td>

                      {/* Candidate Name */}
                      <td className="py-5 px-3">
                        <div className="font-extrabold text-app-text">{sub.candidateName}</div>
                        <span className="block text-[10px] text-app-muted font-mono mt-0.5">{sub.candidateEmail}</span>
                      </td>

                      {/* Recruiter Name */}
                      <td className="py-5 px-3 font-semibold text-app-muted">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-violet/10 flex items-center justify-center text-[10px] font-bold text-brand-violet shrink-0">
                            {sub.recruiterName.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span>{sub.recruiterName}</span>
                        </div>
                      </td>

                      {/* Job Title & Company */}
                      <td className="py-5 px-3">
                        <div className="font-bold text-app-text flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{sub.jobTitle}</span>
                        </div>
                        <span className="block text-[10px] text-app-muted font-semibold mt-1 pl-5">{sub.companyName}</span>
                      </td>

                      {/* Submitted On */}
                      <td className="py-5 px-3 font-mono text-xs text-app-muted font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{sub.submissionDate}</span>
                        </div>
                      </td>

                      {/* Last Updated */}
                      <td className="py-5 px-3 font-mono text-xs text-app-muted font-bold">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{sub.lastUpdated || sub.submissionDate}</span>
                        </div>
                      </td>

                      {/* Current Status */}
                      <td className="py-5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1.5 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
                          {sLabel}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-5 px-3 text-right">
                        <button 
                          onClick={() => setSelectedSubmissionId(sub.id)}
                          className="px-3.5 py-2 bg-brand-blue hover:bg-brand-blue/85 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 ml-auto transition-all active:scale-95 shadow-md shadow-brand-blue/15"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Dossier</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-app-muted">
                    <AlertCircle className="w-12 h-12 mx-auto text-app-muted mb-3" />
                    <p className="font-semibold text-base text-app-text">No active submissions matched search query</p>
                    <p className="text-xs text-app-muted mt-1.5">Refine your search parameters or select a different pipeline filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component */}
      <div className="flex items-center justify-between text-xs font-semibold text-app-muted mt-4">
        <span>Showing {filteredSubmissions.length} active candidate submittals</span>
        <div className="flex items-center gap-1.5">
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text">
            {'>'}
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* REAL-TIME CANDIDATE DOSSIER MODAL */}
      {/* ==================================================== */}
      {selectedSubmissionId && activeSubmission && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-brand-blue animate-pulse" />
                <h3 className="font-display font-extrabold text-base text-app-text">
                  Candidate Dossier Tracker
                </h3>
                <span className="text-[10px] font-mono bg-app-surface px-2 py-0.5 rounded border border-app-border text-brand-blue">
                  {selectedSubmissionId}
                </span>
              </div>
              <button 
                onClick={() => setSelectedSubmissionId(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 md:p-8 space-y-8 overflow-y-auto flex-1">
              
              {/* Profile Block Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-app-border/40">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-2xl font-black font-mono shrink-0">
                    {activeSubmission.candidateName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-app-text leading-tight">
                      {activeSubmission.candidateName}
                    </h2>
                    <p className="text-brand-blue font-bold text-xs mt-1">
                      Submitted By Recruiter: <span className="text-app-text">{activeSubmission.recruiterName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-full border ${getStatusColors(activeSubmission.status).bg} ${getStatusColors(activeSubmission.status).border} ${getStatusColors(activeSubmission.status).text}`}>
                    Pipeline Stage: {getStatusLabel(activeSubmission.status)}
                  </span>
                  <span className="text-[11px] font-extrabold bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-full font-mono">
                    Date: {activeSubmission.submissionDate}
                  </span>
                </div>
              </div>

              {/* Dynamic Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Real-time Candidate profile from marketplace_jobseekers/{candidateUid} */}
                <div className="lg:col-span-4 space-y-6">
                  <h4 className="font-display font-black text-sm uppercase tracking-wider text-brand-blue flex items-center gap-1.5 border-b border-app-border/40 pb-2">
                    <User className="w-4 h-4 text-brand-blue" />
                    Candidate Profile
                  </h4>

                  {activeCandidate ? (
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border space-y-3">
                        <div className="flex justify-between">
                          <span className="text-app-muted">Full Name:</span>
                          <span className="text-app-text">{activeCandidate.profile?.fullName || activeCandidate.name || 'Anonymous'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Email Contact:</span>
                          <span className="text-app-text">{activeCandidate.profile?.email || activeCandidate.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Phone Number:</span>
                          <span className="text-app-text">{activeCandidate.profile?.phoneNumber || activeCandidate.profile?.phone || activeCandidate.phone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Experience Level:</span>
                          <span className="text-app-text font-bold text-brand-violet">{activeCandidate.profile?.experience || activeCandidate.experience || 'Entry Level'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Availability:</span>
                          <span className="text-emerald-400 font-bold">{activeCandidate.profile?.availability || activeCandidate.availability || 'Available'}</span>
                        </div>
                      </div>

                      {/* Technical Skills */}
                      <div className="space-y-2">
                        <span className="block text-[10px] uppercase tracking-wider text-app-muted font-extrabold">Expertise skillset</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(activeCandidate.profile?.skills || activeCandidate.skills || []).map((sk: string, idx: number) => (
                            <span key={idx} className="text-xs font-mono font-bold bg-app-surface px-2 py-1 rounded-lg border border-app-border text-app-text">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Resume Document Link */}
                      {activeSubmission.candidateResume && (
                        <div className="p-3.5 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-blue" />
                            <span className="text-xs font-bold text-app-text">Resume Portfolio</span>
                          </div>
                          <span className="text-[10px] font-mono text-brand-blue font-extrabold hover:underline cursor-pointer">
                            View PDF
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-app-surface/25 border border-app-border/40 text-center text-app-muted text-xs">
                      <Info className="w-5 h-5 mx-auto mb-2 text-app-muted" />
                      Loading candidate profile...
                    </div>
                  )}
                </div>

                {/* Real-time Job details from marketplace_jobs/{jobId} */}
                <div className="lg:col-span-4 space-y-6">
                  <h4 className="font-display font-black text-sm uppercase tracking-wider text-brand-blue flex items-center gap-1.5 border-b border-app-border/40 pb-2">
                    <Briefcase className="w-4 h-4 text-brand-blue" />
                    Job Requirements
                  </h4>

                  {activeJob ? (
                    <div className="space-y-4 text-xs font-semibold">
                      <div>
                        <h5 className="font-bold text-sm text-app-text">{activeJob.title}</h5>
                        <p className="text-[10px] text-brand-blue mt-0.5">{activeJob.companyName || activeJob.client || 'Client Account'}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border space-y-3">
                        <div className="flex justify-between">
                          <span className="text-app-muted">Location Model:</span>
                          <span className="text-app-text">{activeJob.location || 'Remote'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Sourcing Status:</span>
                          <span className="text-emerald-400 font-extrabold uppercase">{activeJob.status || 'Active'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Experience Target:</span>
                          <span className="text-app-text">{activeJob.experience || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-app-muted">Open Openings:</span>
                          <span className="text-app-text font-mono font-bold text-brand-violet">{activeJob.openings || activeJob.positions || '10 positions'}</span>
                        </div>
                      </div>

                      {/* Required job skills */}
                      {activeJob.skills && (
                        <div className="space-y-2">
                          <span className="block text-[10px] uppercase tracking-wider text-app-muted font-extrabold">Required skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(Array.isArray(activeJob.skills) ? activeJob.skills : [activeJob.skills]).map((sk: string, idx: number) => (
                              <span key={idx} className="text-xs font-mono font-bold bg-app-surface px-2 py-1 rounded-lg border border-app-border text-app-text">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-app-surface/25 border border-app-border/40 text-center text-app-muted text-xs">
                      <Info className="w-5 h-5 mx-auto mb-2 text-app-muted" />
                      Loading job requirements...
                    </div>
                  )}
                </div>

                {/* Real-time BDM Update Actions and Remarks */}
                <div className="lg:col-span-4 space-y-6">
                  <h4 className="font-display font-black text-sm uppercase tracking-wider text-brand-blue flex items-center gap-1.5 border-b border-app-border/40 pb-2">
                    <Sparkles className="w-4 h-4 text-brand-blue" />
                    Hiring Stage Transition
                  </h4>

                  <div className="p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 space-y-4">
                    {/* Status Select dropdown */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Select Next Stage</label>
                      <select
                        value={targetStatus}
                        onChange={(e) => setTargetStatus(e.target.value)}
                        className="w-full bg-app-surface border border-app-border rounded-xl px-3.5 py-3 text-xs font-bold text-app-text outline-none cursor-pointer focus:border-brand-blue"
                      >
                        <option value="submitted">Submitted</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="selected">Selected</option>
                        <option value="offer_released">Offer Released</option>
                        <option value="joined">Joined</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Remarks Textarea */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Remarks / Feedback Comments</label>
                      <textarea
                        rows={3}
                        value={remarksInput}
                        onChange={(e) => setRemarksInput(e.target.value)}
                        placeholder="Provide details about screening, schedule details, or release parameters..."
                        className="w-full bg-app-surface border border-app-border rounded-xl p-3 text-xs text-app-text focus:outline-none focus:border-brand-blue outline-none resize-none font-medium leading-relaxed"
                      />
                    </div>

                    {/* Commit Transition Button */}
                    <button
                      onClick={handleConfirmStatusChange}
                      disabled={updatingStatus || targetStatus === activeSubmission.status && !remarksInput.trim()}
                      className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {updatingStatus ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Commit Stage Transition</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>

              {/* Dynamic Interactive Timeline */}
              <div className="space-y-6 pt-4 border-t border-app-border/40">
                <h4 className="font-display font-black text-sm uppercase tracking-wider text-app-text flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-blue" />
                  Submission Lifecycle History
                </h4>

                <div className="relative border-l border-app-border/70 ml-4 pl-6 space-y-6 py-2">
                  {/* Default/Initial submission item */}
                  <div className="relative">
                    <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/15" />
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs font-extrabold">
                      <div className="flex items-center gap-1.5 text-app-text">
                        <span>Application Created</span>
                        <ChevronRight className="w-3.5 h-3.5 text-app-muted" />
                        <span className="text-blue-400">Stage: Submitted</span>
                      </div>
                      <span className="text-[10px] font-mono text-app-muted font-normal mt-1 sm:mt-0">{activeSubmission.submissionDate}</span>
                    </div>
                    <p className="text-[11px] text-app-muted mt-1 leading-relaxed font-semibold">
                      Candidate dossier compiled and submitted to marketplace requirements index by sourcing partner {activeSubmission.recruiterName}.
                    </p>
                  </div>

                  {/* Firestore-tracked dynamic timeline logs */}
                  {activeSubmission.timeline && activeSubmission.timeline.length > 0 ? (
                    activeSubmission.timeline.map((item, idx) => (
                      <div key={idx} className="relative animate-fade-in">
                        <div className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs font-extrabold">
                          <div className="flex items-center gap-1.5 text-app-text flex-wrap">
                            <span className="text-brand-violet">{item.performedByName}</span>
                            <span className="text-[10px] text-app-muted font-normal">({item.performedByRole})</span>
                            <ChevronRight className="w-3.5 h-3.5 text-app-muted" />
                            <span className="text-emerald-400">Stage: {item.action}</span>
                          </div>
                          <span className="text-[10px] font-mono text-app-muted font-normal mt-1 sm:mt-0">
                            {new Date(item.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="mt-1.5 p-3 rounded-xl bg-app-surface/40 border border-app-border/40 text-[11px] text-app-muted font-semibold flex items-start gap-2 max-w-3xl">
                          <MessageSquare className="w-3.5 h-3.5 text-app-muted shrink-0 mt-0.5" />
                          <p className="leading-relaxed">{item.remarks}</p>
                        </div>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="h-18 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20 shrink-0 gap-3">
              <button 
                onClick={() => setSelectedSubmissionId(null)}
                className="px-6 py-3 bg-app-surface hover:bg-app-bg text-app-muted hover:text-app-text rounded-2xl text-xs font-bold border border-app-border transition-colors"
              >
                Close Dossier
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
