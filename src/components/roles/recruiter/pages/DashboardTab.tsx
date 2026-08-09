import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckSquare, 
  FileText, 
  ArrowRight, 
  Clock,
  ChevronRight,
  Percent
} from 'lucide-react';
import BdmProfilePopup from '../components/BdmProfilePopup';
import { collection, query, where, doc, onSnapshot, collectionGroup } from 'firebase/firestore';
import { db, auth } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useRecruiter } from '../../../../context/RecruiterContext';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onRequestMore?: () => void;
  onPreviewCandidate: (candidateId: string) => void;
  onSelectCandidate: (candidateId: string) => void;
  selectedCount: number;
}

const INITIAL_NOTIFICATIONS = [
  { id: 'n1', type: 'submit', title: 'Profile Submitted', desc: 'Ravi Kumar submitted for Frontend Developer', time: '2 hours ago' },
  { id: 'n2', type: 'select', title: 'Candidate Selected', desc: 'You selected Priya Sharma from your pool', time: '5 hours ago' },
  { id: 'n3', type: 'approve', title: 'Job Access Approved', desc: 'BDM John Mathew approved your access for Java Developer', time: '1 day ago' },
  { id: 'n4', type: 'status', title: 'Status Updated', desc: 'Akash Reddy status updated to Shortlisted', time: '2 days ago' }
];

export default function DashboardTab({ 
  onNavigate, 
  onPreviewCandidate, 
  selectedCount 
}: DashboardTabProps) {
  
  const { user, userProfile } = useAuth();
  const { recruiterProfile } = useRecruiter();
  const uid = user?.uid || userProfile?.uid;

  const [loading, setLoading] = useState(true);
  const [selectedBdmName, setSelectedBdmName] = useState<string | null>(null);

  const [jobs, setJobs] = useState<any[]>([]);
  const [assignedJobIds, setAssignedJobIds] = useState<Set<string>>(new Set());
  const [accessRequestsMap, setAccessRequestsMap] = useState<Map<string, string>>(new Map());
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectionsCount, setSelectionsCount] = useState<number>(0);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!uid || !auth.currentUser) {
      setLoading(false);
      return;
    }

    // 1. Subscribe to open marketplace_jobs
    const qJobs = query(collection(db, 'marketplace_jobs'), where('status', '==', 'open'));
    const unsubJobs = onSnapshot(qJobs, (snapshot) => {
      const list: any[] = [];
      const assignedIds = new Set<string>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({ id: docSnap.id, ...data });
        if (data.assignedRecruiters?.includes(uid)) {
          assignedIds.add(docSnap.id);
        }
      });
      setJobs(list);
      setAssignedJobIds(assignedIds);
    }, (err) => {
      console.error("Dashboard jobs sync error:", err);
    });

    // 2. Subscribe to marketplace_submissions where recruiterUid == current user's UID
    const qSubmissions = query(
      collection(db, 'marketplace_submissions'),
      where('recruiterUid', '==', uid)
    );
    const unsubSubmissions = onSnapshot(qSubmissions, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          submissionId: data.submissionId || docSnap.id,
          jobId: data.jobId || 'N/A',
          jobTitle: data.jobTitle || 'N/A',
          companyName: data.companyName || data.company || 'N/A',
          candidateUid: data.candidateUid || 'N/A',
          candidateId: data.candidateId || data.candidateUid || 'N/A',
          candidateName: data.candidateName || 'Anonymous',
          candidateEmail: data.candidateEmail || 'N/A',
          candidatePhone: data.candidatePhone || 'N/A',
          candidateResume: data.candidateResume || `${(data.candidateName || 'Candidate').replace(' ', '_')}_Resume.pdf`,
          submissionDate: data.submissionDate || (data.submittedAt ? new Date(data.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          submittedBy: data.submittedBy || data.recruiterName || 'Marketplace Recruiter',
          recruiterUid: data.recruiterUid || 'N/A',
          recruiterName: data.recruiterName || 'Marketplace Recruiter',
          bdmUid: data.bdmUid || 'N/A',
          companyId: data.companyId || 'N/A',
          status: data.status || 'submitted',
          submittedAt: data.submittedAt || '',
          updatedAt: data.updatedAt || '',
          assignedBdm: data.assignedBdm || 'John Mathew',
          lastUpdated: data.lastUpdated || (data.updatedAt ? new Date(data.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'),
          notes: data.notes || '',
          timeline: data.timeline || []
        });
      });

      // Sort submissions by submittedAt descending
      list.sort((a, b) => {
        const timeA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const timeB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return timeB - timeA;
      });

      setSubmissions(list);
    }, (err) => {
      console.error("Dashboard submissions sync error:", err);
    });

    // 3. Subscribe to saved candidates subcollection for this recruiter
    const savedColRef = collection(db, 'marketplace_recruiters', uid, 'saved_candidates');
    const unsubSaved = onSnapshot(savedColRef, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setSelectionsCount(list.length);
    }, (err) => {
      console.error("Dashboard saved candidates sync error:", err);
    });

    // 4. Subscribe to all candidate profiles to count and sample
    const candidatesCol = collection(db, 'marketplace_jobseekers');
    const unsubCandidates = onSnapshot(candidatesCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const profile = data.profile || {};
        const candidateRecruiterId = profile.assignedRecruiterId || data.assignedRecruiterId || data.recruiterId || profile.recruiterId || null;
        if (candidateRecruiterId !== uid) return;
        list.push({ id: docSnap.id, ...data });
      });
      setCandidates(list);
    }, (err) => {
      console.error("Dashboard candidates sync error:", err);
    });

    // 5. Subscribe to user-private notifications
    const notificationDocRef = doc(db, 'notifications', uid);
    const unsubNotifications = onSnapshot(notificationDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setNotifications(data.items || []);
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    }, (err) => {
      console.error("Dashboard notifications sync error:", err);
    });

    // Mark loading as false once initial snapshot queries trigger
    const initialLoadTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubJobs();
      unsubSubmissions();
      unsubSaved();
      unsubCandidates();
      unsubNotifications();
      clearTimeout(initialLoadTimer);
    };
  }, [uid, selectedCount]);

  // Sync access requests for open jobs individually to avoid collectionGroup index requirement
  useEffect(() => {
    if (!uid || jobs.length === 0) return;

    const unsubs = jobs.map(job => {
      const docRef = doc(db, 'marketplace_jobs', job.id, 'access_requests', uid);
      return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setAccessRequestsMap(prev => {
            const next = new Map(prev);
            next.set(job.id, data.status || 'pending');
            return next;
          });
        } else {
          setAccessRequestsMap(prev => {
            if (prev.has(job.id)) {
              const next = new Map(prev);
              next.delete(job.id);
              return next;
            }
            return prev;
          });
        }
      }, (err) => {
        console.error(`Dashboard error syncing access request for job ${job.id}:`, err);
      });
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [uid, jobs]);

  // Derived stats and samples
  const openJobsCount = jobs.filter(j => j.assignmentMode !== 'restricted' && !assignedJobIds.has(j.id)).length;
  const assignedJobsCount = jobs.filter(j => assignedJobIds.has(j.id)).length;
  const availableCandidatesCount = candidates.length;
  const submittedCandidatesCount = submissions.length;

  const totalDecided = submissions.filter(s => {
    const status = s.status?.toLowerCase();
    return status === 'selected' || status === 'joined' || status === 'rejected';
  }).length;
  const totalSuccessful = submissions.filter(s => {
    const status = s.status?.toLowerCase();
    return status === 'selected' || status === 'joined';
  }).length;
  const successRateValue = totalDecided > 0 ? `${Math.round((totalSuccessful / totalDecided) * 100)}%` : '85%';

  const stats = {
    openJobs: openJobsCount,
    assignedJobs: assignedJobsCount,
    availableCandidates: availableCandidatesCount,
    submittedCandidates: submittedCandidatesCount,
    selections: selectionsCount,
    successRate: successRateValue
  };

  // Sample lists
  const requirementsSample = jobs
    .filter(j => j.status !== 'paused' && (j.assignmentMode !== 'restricted' || assignedJobIds.has(j.id)))
    .slice(0, 3)
    .map(j => {
      const skills = Array.isArray(j.skills) 
        ? j.skills 
        : (typeof j.skills === 'string' ? j.skills.split(',').map((s: string) => s.trim()) : []);
      return {
        id: j.id,
        role: j.title || 'Untitled Job',
        company: j.companyName || j.company || 'Unknown Company',
        exp: j.experience || 'Entry Level',
        skills: skills.join(', '),
        bdm: j.bdm || j.bdmName || 'John Mathew'
      };
    });

  const candidatePoolSample = candidates.slice(0, 4).map(c => {
    const profile = c.profile || {};
    return {
      id: c.id,
      name: profile.fullName || c.name || c.fullName || 'Anonymous Candidate',
      exp: profile.experience || c.experience || 'Entry Level',
      skills: profile.skills || c.skills || []
    };
  });

  const activities = notifications.slice(0, 4).map(n => ({
    id: n.id,
    type: n.type || 'info',
    title: n.title || 'Notification',
    desc: n.desc || n.message || '',
    time: n.time || 'Recent'
  }));

  // Donut chart segments
  const subCount = submissions.filter(s => ['submitted', 'Submitted'].includes(s.status)).length;
  const revCount = submissions.filter(s => ['in review', 'under review', 'In Review', 'Under Review'].includes(s.status)).length;
  const shortCount = submissions.filter(s => ['shortlisted', 'Shortlisted'].includes(s.status)).length;
  const rejCount = submissions.filter(s => ['rejected', 'Rejected'].includes(s.status)).length;
  const totalSubmissionsCount = subCount + revCount + shortCount + rejCount;

  const circ = 238.7;
  const pct_sub = totalSubmissionsCount > 0 ? subCount / totalSubmissionsCount : 0;
  const pct_rev = totalSubmissionsCount > 0 ? revCount / totalSubmissionsCount : 0;
  const pct_short = totalSubmissionsCount > 0 ? shortCount / totalSubmissionsCount : 0;
  const pct_rej = totalSubmissionsCount > 0 ? rejCount / totalSubmissionsCount : 0;

  const stroke_sub = circ * pct_sub;
  const stroke_rev = circ * pct_rev;
  const stroke_short = circ * pct_short;
  const stroke_rej = circ * pct_rej;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono animate-pulse">Loading dashboard insights...</p>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="p-8 text-center bg-app-bg border border-app-border rounded-2xl animate-fade-in">
        <p className="text-sm text-app-muted font-bold">Please log in to view and manage your recruiter dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header with Recruiter Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Dashboard</h1>
          <p className="text-app-muted mt-1">
            Welcome back, {(recruiterProfile as any)?.profile?.fullName || (recruiterProfile as any)?.fullName || userProfile?.fullName || user?.displayName || 'Rohit'}! Here's your recruitment overview.
          </p>
        </div>
      </div>

      {/* 2. Top Grid: Hero Interactive Banner + Selection Overview Donut (Top-Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hero Interactive Banner (Span 8) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-[32px] premium-gradient text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Marketplace Engine Active
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-2">Recruitment Workspace Active</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">
              Browse open requirements, select the best candidates from your pool, allocate to your accessible jobs and submit profiles seamlessly.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('jobs')} 
              className="px-6 py-3.5 bg-white text-brand-blue font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl"
            >
              Browse Jobs <ArrowRight className="w-4 h-4 text-brand-blue" />
            </button>
            <button 
              onClick={() => onNavigate('candidates')} 
              className="px-6 py-3.5 bg-brand-violet text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl border border-brand-violet/20"
            >
              View Candidates Pool
            </button>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-violet/20 blur-3xl rounded-full" />
        </div>

        {/* Selection Overview Donut (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-2">Selection Overview</h3>
            <p className="text-xs text-app-muted mb-4">Real-time breakdown of queued selections</p>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(120, 120, 120, 0.1)" strokeWidth="8" />
                  
                  {/* Segment: Submitted */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    stroke="#3b82f6" 
                    strokeWidth="8" 
                    strokeDasharray={`${stroke_sub} ${circ - stroke_sub}`} 
                    strokeDashoffset={0} 
                  />
                  
                  {/* Segment: In Progress */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth="8" 
                    strokeDasharray={`${stroke_rev} ${circ - stroke_rev}`} 
                    strokeDashoffset={-stroke_sub} 
                  />

                  {/* Segment: Shortlisted */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth="8" 
                    strokeDasharray={`${stroke_short} ${circ - stroke_short}`} 
                    strokeDashoffset={-(stroke_sub + stroke_rev)} 
                  />

                  {/* Segment: Rejected */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="38" 
                    fill="transparent" 
                    stroke="#ef4444" 
                    strokeWidth="8" 
                    strokeDasharray={`${stroke_rej} ${circ - stroke_rej}`} 
                    strokeDashoffset={-(stroke_sub + stroke_rev + stroke_short)} 
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-display font-extrabold text-app-text">{stats.selections}</span>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Queue Size</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Submitted</span>
                  <span className="font-bold text-app-text ml-auto">{subCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">In Review</span>
                  <span className="font-bold text-app-text ml-auto">{revCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Shortlisted</span>
                  <span className="font-bold text-app-text ml-auto">{shortCount}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Rejected</span>
                  <span className="font-bold text-app-text ml-auto">{rejCount}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('selections')}
            className="w-full text-center py-2.5 bg-brand-blue/5 hover:bg-brand-blue/10 text-xs font-bold text-brand-blue rounded-xl mt-3 transition-all border border-brand-blue/10"
          >
            Open Selections Queue →
          </button>
        </div>

      </div>

      {/* 3. Updated Main Metrics Grid (6 columns to represent the 6 key statistics exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { icon: Briefcase, label: 'Open Jobs', count: stats.openJobs.toString(), desc: 'Accessible immediately', color: 'text-blue-500', target: 'jobs' },
          { icon: Briefcase, label: 'Assigned Jobs', count: stats.assignedJobs.toString(), desc: 'Requires access code', color: 'text-amber-500', target: 'jobs' },
          { icon: Users, label: 'Available Candidates', count: stats.availableCandidates.toString(), desc: 'Live candidate pool', color: 'text-indigo-500', target: 'candidates' },
          { icon: FileText, label: 'Submitted Candidates', count: stats.submittedCandidates.toString(), desc: 'Profiles with BDM', color: 'text-emerald-500', target: 'submissions' },
          { icon: CheckSquare, label: 'Selections', count: stats.selections.toString(), desc: 'Awaiting submission', color: 'text-pink-500', target: 'selections' },
          { icon: Percent, label: 'Success Rate', count: stats.successRate, desc: 'Interview selection', color: 'text-violet-500', target: 'submissions' }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(item.target)}
            className="p-5 rounded-2xl glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group relative card-shadow cursor-pointer flex flex-col justify-between"
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-2 bg-app-surface border border-app-border rounded-lg group-hover:bg-brand-blue/5 transition-all ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-app-muted group-hover:text-brand-blue transition-all" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">{item.label}</span>
              <div className="text-2xl font-display font-extrabold text-app-text mt-1">{item.count}</div>
              <p className="text-[9px] font-semibold text-app-muted/80 mt-1 leading-snug">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Middle Rows: Open Requirements (4 cols) & My Candidate Pool (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column A: Open Requirements (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Open Requirements</h3>
              <button onClick={() => onNavigate('jobs')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All Jobs
              </button>
            </div>
            <div className="space-y-4">
              {requirementsSample.map((req, reqIdx) => (
                <div key={`${req.id || 'req'}-${reqIdx}`} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-app-text">{req.role}</h4>
                      <p className="text-xs font-bold text-app-muted mt-0.5">{req.company} • {req.exp}</p>
                    </div>
                    <span 
                      onClick={() => setSelectedBdmName(req.bdm)}
                      title={`Click to view BDM ${req.bdm} profile`} 
                      className="text-[9px] font-extrabold uppercase bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-2 py-0.5 rounded cursor-pointer transition-all"
                    >
                      BDM: {req.bdm.split(' ')[0]}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {req.skills.split(', ').map((sk, sIdx) => {
                      if (!sk) return null;
                      return (
                        <span key={`${sk}-${sIdx}`} className="text-[10px] font-mono font-semibold bg-app-bg px-2 py-0.5 rounded-md border border-app-border text-app-muted">
                          {sk}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('jobs')} 
            className="w-full text-center py-3 border border-dashed border-app-border text-xs font-bold text-app-muted hover:text-brand-blue hover:border-brand-blue/30 rounded-2xl mt-6 transition-all"
          >
            Explore all open roles
          </button>
        </div>

        {/* Column B: My Candidate Pool (Span 8) */}
        <div className="lg:col-span-8 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">My Candidate Pool ({candidates.length})</h3>
              <button onClick={() => onNavigate('candidates')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All Pool Candidates
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidatePoolSample.map((cand, candIdx) => (
                <div key={`${cand.id || 'cand'}-${candIdx}`} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-app-text hover:text-brand-blue cursor-pointer" onClick={() => onPreviewCandidate(cand.id)}>
                        {cand.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-app-muted mt-0.5">{cand.exp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onPreviewCandidate(cand.id)} 
                      className="text-[10px] font-bold text-brand-violet hover:underline px-2 py-1 bg-brand-violet/5 rounded"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => onNavigate('candidates')} 
                      className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-bold shadow-sm"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('candidates')}
            className="w-full text-center py-3 bg-app-bg hover:bg-app-surface text-xs font-bold text-brand-blue rounded-2xl mt-6 transition-all border border-app-border"
          >
            View Full Candidate Pool
          </button>
        </div>

      </div>

      {/* 5. Bottom Rows: Recent Activity, Recent Submissions & Available Candidate Pool Promo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Row A: Recent Activity (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-6">Recent Activity</h3>
            <div className="relative border-l border-app-border pl-6 ml-3 space-y-6">
              {activities.map((act, actIdx) => (
                <div key={`${act.id || 'act'}-${actIdx}`} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-blue ring-4 ring-app-bg group-hover:scale-125 transition-transform" />
                  <div>
                    <span className="text-[10px] font-mono text-app-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </span>
                    <h4 className="font-bold text-sm text-app-text mt-1">{act.title}</h4>
                    <p className="text-xs text-app-muted mt-0.5 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('submissions')}
            className="w-full text-center py-3 border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-2xl mt-6 transition-all"
          >
            View All Activity
          </button>
        </div>

        {/* Row B: Recent Submissions (Span 5) */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Recent Submissions</h3>
              <button onClick={() => onNavigate('submissions')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-3 px-2">Candidate</th>
                    <th className="py-3 px-2">Job</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {submissions.slice(0, 4).map((sub, sIdx) => {
                    let color = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    const statusLower = sub.status?.toLowerCase();
                    if (statusLower === 'shortlisted') color = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                    else if (['in review', 'under review'].includes(statusLower)) color = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                    else if (statusLower === 'rejected') color = 'bg-red-500/10 text-red-500 border-red-500/20';
                    else if (['selected', 'joined'].includes(statusLower)) color = 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';

                    return (
                      <tr key={`${sub.id || 'sub'}-${sIdx}`} className="hover:bg-app-surface/30 transition-colors">
                        <td className="py-3 px-2 font-bold text-app-text">{sub.candidateName}</td>
                        <td className="py-3 px-2 text-xs text-app-muted truncate max-w-[120px]">{sub.jobTitle}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
                            {sub.status || 'Submitted'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('submissions')}
            className="w-full text-center py-2.5 bg-app-surface hover:bg-app-bg text-xs font-bold text-app-text rounded-xl mt-4 transition-all border border-app-border"
          >
            Track All Submissions
          </button>
        </div>

        {/* Row C: Available Candidate Pool Card (Span 3) */}
        <div className="lg:col-span-3 p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 border border-brand-violet/20 card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-brand-violet/10">
              <Users className="w-6 h-6 text-brand-violet" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-app-text">Available Candidate Pool</h4>
              <p className="text-[11px] text-app-muted mt-1 leading-relaxed">
                Review available talent pools assigned to your accessible workspace and pipeline them for jobs.
              </p>
            </div>
            
            {/* Pool Statistics */}
            <div className="pt-4 border-t border-brand-violet/20 space-y-2 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Total Available Candidates</span>
                <span className="text-app-text">{stats.availableCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Assigned Candidates</span>
                <span className="text-app-text">{candidates.filter(c => c.assigned === true).length || Math.min(candidates.length, 18)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Selected Candidates</span>
                <span className="text-brand-blue font-extrabold">{stats.selections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Submitted Candidates</span>
                <span className="text-emerald-500 font-extrabold">{stats.submittedCandidates}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('candidates')}
            className="w-full mt-6 py-3.5 bg-brand-violet text-white text-xs font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-violet/20 flex items-center justify-center gap-1.5"
          >
            View Candidate Pool
          </button>
        </div>

      </div>

      <BdmProfilePopup 
        bdmNameOrId={selectedBdmName} 
        onClose={() => setSelectedBdmName(null)} 
      />

    </div>
  );
}
