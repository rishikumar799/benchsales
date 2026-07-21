import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  SlidersHorizontal,
  Briefcase,
  Lock,
  Unlock
} from 'lucide-react';
import BdmProfilePopup from '../components/BdmProfilePopup';
import { RecruiterJob } from '../utils/recruiterStorage';
import { auth, db } from '../../../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDoc, 
  collectionGroup, 
  arrayUnion 
} from 'firebase/firestore';

import { useRecruiter } from '../../../../context/RecruiterContext';

interface AvailableJobsTabProps {
  onNavigate: (tab: string) => void;
  onRequestAccess?: (companyName: string) => void;
}

export default function AvailableJobsTab({ onNavigate }: AvailableJobsTabProps) {
  const { recruiterProfile } = useRecruiter();
  const [jobsRaw, setJobsRaw] = useState<any[]>([]);
  const [assignedJobIds, setAssignedJobIds] = useState<Set<string>>(new Set());
  const [accessRequestsMap, setAccessRequestsMap] = useState<Map<string, string>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedPrior, setSelectedPrior] = useState('All');
  const [selectedBdmName, setSelectedBdmName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUserInfo = useMemo(() => {
    return {
      name: (recruiterProfile as any)?.profile?.fullName || (recruiterProfile as any)?.fullName || auth.currentUser?.displayName || 'Recruiter Partner',
      email: (recruiterProfile as any)?.profile?.email || (recruiterProfile as any)?.email || auth.currentUser?.email || ''
    };
  }, [recruiterProfile]);

  // Sync real-time Firestore data based on Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        // 1. Listen to marketplace_jobs (status == 'open')
        const qJobs = query(collection(db, 'marketplace_jobs'), where('status', '==', 'open'));
        const unsubJobs = onSnapshot(qJobs, (snapshot) => {
          const rawJobsList: any[] = [];
          const assignedIds = new Set<string>();
          snapshot.forEach((d) => {
            const data = d.data();
            rawJobsList.push({ id: d.id, ...data });
            if (data.assignedRecruiters?.includes(uid)) {
              assignedIds.add(d.id);
            }
          });
          setJobsRaw(rawJobsList);
          setAssignedJobIds(assignedIds);
          setLoading(false);
        }, (err) => {
          console.error("Jobs sync error:", err);
        });

        return () => {
          unsubJobs();
        };
      } else {
        setJobsRaw([]);
        setAssignedJobIds(new Set());
        setAccessRequestsMap(new Map());
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync access requests for open jobs individually to avoid collectionGroup index requirement
  useEffect(() => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid || jobsRaw.length === 0) return;

    const unsubs = jobsRaw.map(job => {
      const docRef = doc(db, 'marketplace_jobs', job.id, 'access_requests', currentUid);
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
        console.error(`Error syncing access request for job ${job.id}:`, err);
      });
    });

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, [jobsRaw]);

  // Map and compute the jobs with access statuses dynamically
  const jobs = useMemo(() => {
    return jobsRaw.map((job) => {
      const skills = Array.isArray(job.skills) 
        ? job.skills 
        : (typeof job.skills === 'string' ? job.skills.split(',').map((s: string) => s.trim()) : []);

      const bdm = job.bdm || job.bdmName || 'John Mathew';
      const jobType = job.assignmentMode === 'restricted' ? 'assigned' : 'open';

      // Determine access status dynamically
      const isAssigned = assignedJobIds.has(job.id);
      
      let accessStatus: 'approved' | 'pending' | 'none' = 'none';
      if (isAssigned) {
        accessStatus = 'approved';
      } else {
        const reqStatus = accessRequestsMap.get(job.id);
        if (reqStatus === 'pending') {
          accessStatus = 'pending';
        } else if (reqStatus === 'approved') {
          accessStatus = 'approved';
        } else {
          accessStatus = 'none';
        }
      }

      // Format timestamps
      let createdAtFormatted = 'Recent';
      if (job.createdAt) {
        const date = job.createdAt.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
        createdAtFormatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      } else if (job.posted) {
        createdAtFormatted = job.posted;
      }

      let updatedAtFormatted = '';
      if (job.updatedAt) {
        const date = job.updatedAt.toDate ? job.updatedAt.toDate() : new Date(job.updatedAt);
        updatedAtFormatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      }

      return {
        id: job.id,
        title: job.title || 'Untitled Job',
        company: job.companyName || job.company || 'Unknown Company',
        experience: job.experience || 'Not Specified',
        skills: skills,
        location: job.location || 'Remote',
        positions: String(job.openings || job.positions || '1'),
        priority: job.priority || 'Medium',
        posted: createdAtFormatted,
        bdm: bdm,
        jobType: jobType,
        accessStatus: accessStatus,
        status: job.status || 'open',
        salary: job.salary || '6 - 10 LPA',
        employmentType: job.employmentType || 'Full Time',
        recruiterCount: job.recruiterCount || 0,
        submissionCount: job.submissionCount || 0,
        shortlistCount: job.shortlistCount || job.shortlistedCount || 0,
        hiredCount: job.hiredCount || 0,
        createdAtFormatted,
        updatedAtFormatted
      } as RecruiterJob & {
        salary: string;
        employmentType: string;
        recruiterCount: number;
        submissionCount: number;
        shortlistCount: number;
        hiredCount: number;
        createdAtFormatted: string;
        updatedAtFormatted: string;
      };
    });
  }, [jobsRaw, assignedJobIds, accessRequestsMap]);

  // Trigger request access action in Firestore
  const handleRequestAccess = async (jobId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    try {
      const requestId = currentUid; // Unique per recruiter per job to prevent duplicate requests
      const requestRef = doc(db, 'marketplace_jobs', jobId, 'access_requests', requestId);
      
      await setDoc(requestRef, {
        requestId,
        jobId,
        jobTitle: targetJob.title,
        recruiterUid: currentUid,
        recruiterName: currentUserInfo?.name || 'Recruiter Partner',
        recruiterEmail: currentUserInfo?.email || '',
        status: 'pending',
        requestedAt: new Date().toISOString()
      });

      // Add a private notification inside the user's Firestore doc
      const notifRef = doc(db, 'notifications', currentUid);
      const newNotif = {
        id: `n-${Date.now()}`,
        type: 'request',
        title: 'Access Requested',
        desc: `Sent access request to BDM ${targetJob.bdm} for ${targetJob.title}`,
        time: 'Just now'
      };
      
      await setDoc(notifRef, {
        items: arrayUnion(newNotif)
      }, { merge: true });

    } catch (err) {
      console.error("Error requesting access:", err);
    }
  };

  // Match filtering criteria
  const filteredJobs = jobs.filter(job => {
    // Only show Assigned Jobs plus Open To All Jobs
    const isAssignedOrOpenToAll = job.jobType === 'open' || job.accessStatus === 'approved';
    if (!isAssignedOrOpenToAll) return false;

    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === 'All' || job.skills.includes(selectedSkill);
    const matchesExp = selectedExp === 'All' || job.experience.includes(selectedExp);
    const matchesLoc = selectedLoc === 'All' || job.location.includes(selectedLoc) || (selectedLoc === 'Remote' && job.location.toLowerCase() === 'remote');
    const matchesPrior = selectedPrior === 'All' || job.priority === selectedPrior;

    return matchesSearch && matchesSkill && matchesExp && matchesLoc && matchesPrior;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4" id="jobs-loading">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-sm font-semibold">Syncing with Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="available-jobs-tab-root">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text" id="tab-title">Available Jobs</h1>
        <p className="text-app-muted mt-1">Browse all open requirements. Select candidates directly for Open jobs or request access for Assigned ones.</p>
      </div>

      {/* Grid Filter Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4" id="filters-container">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full" id="search-container">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              id="search-input"
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto" id="filter-selects">
            {/* Filter tags / dropdown simulations */}
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3 py-2 rounded-xl text-xs font-semibold" id="filters-label">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Filters:</span>
            </div>

            {/* Skills */}
            <select 
              id="skills-filter"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Skills (All)</option>
              <option value="React">React</option>
              <option value="Java">Java</option>
              <option value="TypeScript">TypeScript</option>
              <option value="AWS">AWS</option>
              <option value="Manual">Manual</option>
            </select>

            {/* Experience */}
            <select 
              id="experience-filter"
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Experience (All)</option>
              <option value="2-4">2-4 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="4-6">4-6 Years</option>
            </select>

            {/* Location */}
            <select 
              id="location-filter"
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Location (All)</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Priority */}
            <select 
              id="priority-filter"
              value={selectedPrior}
              onChange={(e) => setSelectedPrior(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Priority (All)</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Jobs Listings */}
      <div className="space-y-4" id="jobs-listings-container">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApproved = job.accessStatus === 'approved';
            const isPending = job.accessStatus === 'pending';
            const isLocked = job.accessStatus === 'none';

            return (
              <div 
                key={job.id} 
                id={`job-card-${job.id}`}
                className="p-6 rounded-[24px] glass border border-app-border card-shadow flex flex-col justify-between items-stretch gap-6 hover:border-app-border/80 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-3 flex-1">
                    {/* Logo & Headline */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-extrabold shrink-0 border border-brand-blue/20">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-app-text">{job.title}</h3>
                          {job.jobType === 'open' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded-full font-mono font-bold">
                              <Unlock className="w-2.5 h-2.5" /> Open To All
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2 py-0.5 rounded-full font-mono font-bold">
                              <Lock className="w-2.5 h-2.5" /> Assigned Only
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted mt-1 font-semibold">
                          <span>{job.company}</span>
                          <span className="text-app-border">•</span>
                          <span>{job.experience}</span>
                          <span className="text-app-border">•</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Badges Stack */}
                    <div className="flex flex-wrap items-center gap-2 mt-4 pl-0 md:pl-16">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="text-xs font-semibold font-mono bg-app-surface/80 border border-app-border px-2.5 py-1 rounded-xl text-app-text">
                          {skill}
                        </span>
                      ))}
                      <span className="text-xs font-bold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                        {job.positions} Openings
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        job.priority === 'High' 
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                          : job.priority === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {job.priority} Priority
                      </span>
                    </div>
                  </div>

                  {/* Status / Actions Segment */}
                  <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-app-border pt-4 md:pt-0 shrink-0">
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-app-muted">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{job.posted}</span>
                    </div>
                    <div className="text-xs font-bold text-app-text">
                      BDM: <span onClick={() => setSelectedBdmName(job.bdm)} className="text-brand-blue hover:underline hover:text-brand-violet cursor-pointer transition-all">{job.bdm}</span>
                    </div>

                    {/* Access Status Display */}
                    <div className="text-[11px] font-bold">
                      Access Status:{' '}
                      {job.accessStatus === 'approved' ? (
                        <span className="text-emerald-500">Access Approved</span>
                      ) : job.accessStatus === 'pending' ? (
                        <span className="text-yellow-500">Pending Approval</span>
                      ) : (
                        <span className="text-red-500">Access Restricted</span>
                      )}
                    </div>

                    {isLocked && (
                      <button 
                        id={`request-access-btn-${job.id}`}
                        onClick={() => handleRequestAccess(job.id)} 
                        className="w-full md:w-auto px-6 py-3 bg-brand-blue text-white font-extrabold rounded-2xl shadow-lg shadow-brand-blue/15 text-xs hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        {job.jobType === 'open' ? 'Request To Work' : 'Request Access'}
                      </button>
                    )}

                    {isPending && (
                      <button 
                        disabled 
                        id={`pending-approval-btn-${job.id}`}
                        className="w-full md:w-auto px-6 py-3 bg-white/10 text-app-muted font-extrabold border border-app-border rounded-2xl text-xs flex items-center justify-center gap-2"
                      >
                        <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                        Pending Approval
                      </button>
                    )}

                    {isApproved && (
                      <div className="flex gap-2 w-full md:w-auto" id={`approved-container-${job.id}`}>
                        <button 
                          id={`select-candidates-btn-${job.id}`}
                          onClick={() => onNavigate('candidates')}
                          className="w-full md:w-auto px-5 py-3 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" /> Select Candidates
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Metadata Grid */}
                <div 
                  id={`job-meta-${job.id}`}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4 border-t border-app-border/40 text-xs font-semibold text-app-muted font-mono"
                >
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Salary</span>
                    <span className="text-app-text">{job.salary}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Type</span>
                    <span className="text-app-text">{job.employmentType}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Status</span>
                    <span className="text-emerald-500 capitalize">{job.status}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Recruiters</span>
                    <span className="text-app-text">{job.recruiterCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Submissions</span>
                    <span className="text-app-text">{job.submissionCount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-app-muted/60 uppercase tracking-wider mb-0.5">Shortlisted / Hired</span>
                    <span className="text-app-text">{job.shortlistCount} / {job.hiredCount}</span>
                  </div>
                </div>

                {/* Dates footer */}
                <div 
                  id={`job-dates-${job.id}`}
                  className="flex flex-wrap gap-4 text-[10px] text-app-muted font-mono mt-1 border-t border-app-border/20 pt-2"
                >
                  <span>Created: {job.createdAtFormatted}</span>
                  {job.updatedAtFormatted && <span>Updated: {job.updatedAtFormatted}</span>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-[32px] glass border border-app-border" id="no-jobs-fallback">
            <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-app-text">No matching jobs found</h3>
            <p className="text-app-muted text-sm mt-1">Try relaxing some filters or adjust search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination component */}
      <div className="flex items-center justify-center gap-2 mt-8 pt-4" id="pagination-container">
        <button id="btn-prev-page" className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'<'}
        </button>
        <button id="btn-page-1" className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
        <button id="btn-page-2" className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
        <button id="btn-page-3" className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
        <span className="text-app-muted px-1 text-xs" id="pagination-ellipsis">...</span>
        <button id="btn-page-5" className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">5</button>
        <button id="btn-next-page" className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'>'}
        </button>
      </div>

      <BdmProfilePopup 
        bdmNameOrId={selectedBdmName} 
        onClose={() => setSelectedBdmName(null)} 
      />

    </div>
  );
}
