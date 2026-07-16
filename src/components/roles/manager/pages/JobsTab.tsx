import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc, updateDoc, arrayUnion, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Plus, 
  Edit, 
  Play, 
  Pause, 
  MoreVertical, 
  Users, 
  FileText,
  Briefcase,
  SlidersHorizontal,
  Trash2,
  X,
  ChevronRight,
  Award,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';

interface JobType {
  id: string;
  title: string;
  client: string;
  experience: string;
  skills: string;
  location: string;
  openings: string;
  recruitersCount: number;
  submissionsCount: number;
  status: 'Active' | 'Paused';
  assignmentMode?: 'open' | 'restricted';
  assignedRecruiters?: string[];
}

interface JobsTabProps {
  jobsList: JobType[];
  onToggleStatus: (id: string, currentStatus?: string) => void;
  onDeleteJob: (id: string) => void;
  onCreateJobClick: () => void;
  onEditJobClick: (job: JobType) => void;
}

export default function JobsTab({ 
  jobsList, 
  onToggleStatus, 
  onDeleteJob, 
  onCreateJobClick,
  onEditJobClick 
}: JobsTabProps) {
  
  const { user } = useAuth();
  const [realtimeJobs, setRealtimeJobs] = useState<JobType[]>([]);
  const [recruitersList, setRecruitersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let subsData: any[] = [];
    let recsData: any[] = [];
    let jobsData: any[] = [];

    const unsubRecs = onSnapshot(collection(db, 'marketplace_recruiters'), (snapshot) => {
      recsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateDerivedStates();
    }, (err) => {
      console.error("Error loading recruiters:", err);
    });

    const unsubSubs = onSnapshot(query(collection(db, 'marketplace_submissions'), where('bdmUid', '==', user.uid)), (snapshot) => {
      subsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateDerivedStates();
    }, (err) => {
      console.error("Error loading submissions:", err);
    });

    const q = query(collection(db, 'marketplace_jobs'), where('createdBy', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        jobsData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        updateDerivedStates();
      } catch (err: any) {
        setError(err.message || String(err));
        setLoading(false);
      }
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    function updateDerivedStates() {
      const mappedJobs = jobsData.map(job => {
        const id = job.id;
        const data = job;
        const jobSubs = subsData.filter(s => s.jobId === id);
        const uniqueRecs = new Set(jobSubs.map(s => s.recruiterUid || s.recruiterId || ''));

        return {
          id,
          title: data.title || '',
          client: data.companyName || data.client || 'Unknown Client',
          experience: data.experience || '3 - 5 Years',
          skills: typeof data.skills === 'string' ? data.skills : (Array.isArray(data.skills) ? data.skills.join(', ') : ''),
          location: data.location || 'Remote',
          openings: data.openings || '10 Positions',
          recruitersCount: data.assignedRecruiters?.length || uniqueRecs.size || 0,
          submissionsCount: jobSubs.length || data.submissionsCount || 0,
          status: (data.status === 'Paused' || data.status === 'PAUSED' || data.status === 'paused') ? 'Paused' : 'Active',
          assignmentMode: data.assignmentMode || 'open',
          assignedRecruiters: data.assignedRecruiters || [],
        } as JobType;
      });

      // Filter out archived jobs
      const nonArchivedJobs = mappedJobs.filter(j => {
        const rawJob = jobsData.find(d => d.id === j.id);
        return rawJob?.status !== 'archived';
      });

      // Sort newest first based on seconds
      nonArchivedJobs.sort((a, b) => {
        const docA = jobsData.find(d => d.id === a.id);
        const docB = jobsData.find(d => d.id === b.id);
        const timeA = docA?.createdAt?.seconds || 0;
        const timeB = docB?.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setRealtimeJobs(nonArchivedJobs);

      // Map recruiterList dynamically
      const mappedRecs = recsData.map(rec => {
        const id = rec.id;
        const profile = rec.profile || {};
        const name = profile.fullName || profile.name || rec.name || 'Anonymous Recruiter';
        const status = profile.status === 'approved' || rec.status === 'Active' || rec.status === 'approved' ? 'Active' : 'Inactive';
        const img = profile.img || profile.avatarUrl || `https://picsum.photos/seed/${id}/100/100`;
        const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : '12 Mar 2026';

        // Count active jobs created by this BDM where the recruiter is assigned
        const bdmJobs = nonArchivedJobs;
        const assignedBdmJobs = bdmJobs.filter(j => j.assignedRecruiters?.includes(id));
        const activeJobsCount = assignedBdmJobs.length;
        const currentAssignedJobTitles = assignedBdmJobs.map(j => j.title);

        // Submissions for this BDM's jobs
        const bdmSubs = subsData.filter(s => s.recruiterUid === id || s.recruiterId === id);
        const submissionsCount = bdmSubs.length;
        const shortlistedCount = bdmSubs.filter(s => s.status === 'Shortlisted').length;
        const selectedCount = bdmSubs.filter(s => s.status === 'Selected' || s.status === 'Joined' || s.status === 'Hired').length;

        const successRateVal = submissionsCount > 0 ? Math.round((shortlistedCount / submissionsCount) * 100) : 100;
        const successRate = successRateVal + '%';

        // Badges
        const badges = [];
        if (selectedCount >= 2) badges.push("Top Performer");
        if (successRateVal >= 75) badges.push("High Placement Rate");
        if (submissionsCount >= 5) badges.push("High Submission Rate");
        if (badges.length === 0) badges.push("Consistent Recruiter");

        // Recent Submissions
        const recentSubmissions = bdmSubs.slice(0, 5).map(s => ({
          candidate: s.candidateName || 'Anonymous',
          job: s.jobTitle || 'Requirement',
          status: s.status || 'Submitted',
          date: s.submittedAt ? (s.submittedAt.seconds ? new Date(s.submittedAt.seconds * 1000).toLocaleDateString() : new Date(s.submittedAt).toLocaleDateString()) : 'Today'
        }));

        return {
          id,
          name,
          status,
          activeJobs: activeJobsCount,
          totalJobsWorked: activeJobsCount + 2,
          submissions: submissionsCount,
          shortlisted: shortlistedCount,
          selected: selectedCount,
          successRate,
          lastActive: 'Today, 11:30 AM',
          lastActiveTimestamp: new Date().toISOString(),
          joinDate,
          assignedDate: '15 Mar 2026',
          averageResponseTime: '15 minutes',
          topSkills: ['React', 'TypeScript', 'Node.js', 'AWS'],
          mostActiveCategory: 'Engineering',
          currentAssignedJobs: currentAssignedJobTitles.length > 0 ? currentAssignedJobTitles : ['General Sourcing'],
          recentSubmissions,
          badges
        };
      });

      setRecruitersList(mappedRecs);
      setLoading(false);
    }

    return () => {
      unsubscribe();
      unsubSubs();
      unsubRecs();
    };
  }, [user]);

  // Recruiter Assignment Modals state
  const [selectedJobForRecruiters, setSelectedJobForRecruiters] = useState<JobType | null>(null);
  const [selectedRecruiterForDetails, setSelectedRecruiterForDetails] = useState<any | null>(null);
  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);

  // Pending Recruiter Requests state & realtime listener
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!selectedJobForRecruiters) {
      setPendingRequests([]);
      return;
    }

    const requestsRef = collection(db, 'marketplace_jobs', selectedJobForRecruiters.id, 'access_requests');
    const q = query(requestsRef, where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as any)
      }));

      // Enrich requests with recruiter details from recruitersList
      const enriched = requestsData.map(req => {
        const recruiterInfo = recruitersList.find(r => r.id === req.recruiterUid);
        return {
          ...req,
          recruiterDetails: recruiterInfo || {
            id: req.recruiterUid,
            name: req.recruiterName || 'Recruiter Partner',
            experience: '3 - 5 Years',
            activeJobs: 0,
            submissions: 0,
            shortlisted: 0,
            selected: 0,
            successRate: '100%',
            topSkills: ['React', 'TypeScript', 'Node.js'],
            mostActiveCategory: 'Engineering',
            recentSubmissions: []
          }
        };
      });

      setPendingRequests(enriched);
    }, (err) => {
      console.error("Error loading pending requests:", err);
    });

    return () => unsubscribe();
  }, [selectedJobForRecruiters, recruitersList]);

  // Local helper logging functions
  const logJobActivityLocal = async (jobId: string, action: string, description: string) => {
    try {
      const activityCol = collection(db, 'marketplace_jobs', jobId, 'activity');
      const actRef = doc(activityCol);
      await setDoc(actRef, {
        action,
        performedBy: user?.displayName || user?.email || 'System BDM',
        performedByRole: 'marketplace_bdm',
        timestamp: serverTimestamp(),
        description
      });
    } catch (err) {
      console.error("Error logging job activity:", err);
    }
  };

  const addJobTimelineEventLocal = async (jobId: string, event: string, description: string) => {
    try {
      const timelineCol = collection(db, 'marketplace_jobs', jobId, 'timeline');
      const timeRef = doc(timelineCol);
      await setDoc(timeRef, {
        event,
        timestamp: serverTimestamp(),
        description
      });
    } catch (err) {
      console.error("Error adding timeline event:", err);
    }
  };

  const handleApproveRequest = async (requestId: string, recruiterUid: string) => {
    if (!selectedJobForRecruiters) return;
    const jobId = selectedJobForRecruiters.id;
    try {
      // 1. Fetch recruiter data
      const recSnap = await getDoc(doc(db, 'marketplace_recruiters', recruiterUid));
      let recName = 'Recruiter Partner';
      let recEmail = `${recruiterUid}@example.com`;
      let recPhone = '+91 98765 00000';
      let recStatus = 'Active';

      if (recSnap.exists()) {
        const recData = recSnap.data();
        const profile = recData.profile || {};
        recName = profile.fullName || profile.name || recData.name || recData.fullName || 'Recruiter Partner';
        recEmail = profile.email || recData.email || `${recruiterUid}@example.com`;
        recPhone = profile.phoneNumber || profile.phone || recData.phoneNumber || recData.phone || '+91 98765 00000';
        recStatus = profile.status === 'approved' || recData.status === 'Active' || recData.status === 'approved' ? 'Active' : 'Inactive';
      }

      // 2. Add to assigned_recruiters subcollection
      const bdmName = user?.displayName || user?.email || 'System BDM';
      const recRef = doc(db, 'marketplace_jobs', jobId, 'assigned_recruiters', recruiterUid);
      await setDoc(recRef, {
        uid: recruiterUid,
        name: recName,
        email: recEmail,
        phone: recPhone,
        assignedBy: bdmName,
        assignedAt: serverTimestamp(),
        status: recStatus
      });

      // 3. Update the job document: add to assignedRecruiters array, increment count
      const jobRef = doc(db, 'marketplace_jobs', jobId);
      await updateDoc(jobRef, {
        assignedRecruiters: arrayUnion(recruiterUid),
        recruiterCount: increment(1)
      });

      // 4. Update the access_request document status to approved
      const reqRef = doc(db, 'marketplace_jobs', jobId, 'access_requests', requestId);
      await updateDoc(reqRef, {
        status: 'approved',
        approvedAt: new Date().toISOString()
      });

      // 5. Add timeline and activity log
      await logJobActivityLocal(jobId, 'Recruiter Assigned', `${recName} was approved and assigned to this requirement.`);
      await addJobTimelineEventLocal(jobId, 'Assigned', `${recName} approved & assigned.`);

      // Update the local modal state
      setSelectedJobForRecruiters(prev => {
        if (!prev) return null;
        return {
          ...prev,
          assignedRecruiters: [...(prev.assignedRecruiters || []), recruiterUid],
          recruitersCount: (prev.recruitersCount || 0) + 1
        };
      });

    } catch (err) {
      console.error("Error approving recruiter request:", err);
    }
  };

  const handleRejectRequest = async (requestId: string, recruiterUid: string) => {
    if (!selectedJobForRecruiters) return;
    const jobId = selectedJobForRecruiters.id;
    try {
      // 1. Update the access_request document status to rejected
      const reqRef = doc(db, 'marketplace_jobs', jobId, 'access_requests', requestId);
      await updateDoc(reqRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString()
      });

      // 2. Add timeline event / logging
      const reqDoc = pendingRequests.find(r => r.id === requestId);
      const recruiterName = reqDoc?.recruiterName || reqDoc?.recruiterDetails?.name || 'Recruiter';
      await logJobActivityLocal(jobId, 'Request Rejected', `Access request from ${recruiterName} was rejected.`);

    } catch (err) {
      console.error("Error rejecting recruiter request:", err);
    }
  };

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Extract unique filter dropdown values
  const uniqueClients = Array.from(new Set(realtimeJobs.map(j => j.client).filter(Boolean)));
  const uniqueLocations = Array.from(new Set(realtimeJobs.map(j => j.location).filter(Boolean)));

  // Filter implementation
  const filteredJobs = realtimeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesClient = clientFilter === 'All' || job.client === clientFilter;
    const matchesLoc = locationFilter === 'All' || job.location === locationFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesLoc;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header Segments */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Jobs</h1>
          <p className="text-app-muted mt-1">Create, manage and track all active marketplace requirements.</p>
        </div>
        <button 
          onClick={onCreateJobClick}
          className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shadow-lg shadow-brand-blue/20 shrink-0"
        >
          <Plus className="w-4.5 h-4.5 stroke-[3px]" /> Create New Job
        </button>
      </div>

      {/* Grid Filter control */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search jobs, clients, active stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto">
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Refine:</span>
            </div>

            {/* Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>

            {/* Client */}
            <select 
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer max-w-[130px]"
            >
              <option value="All">Client: All</option>
              {uniqueClients.map((client, sIdx) => (
                <option key={sIdx} value={client}>{client}</option>
              ))}
            </select>

            {/* Location */}
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer max-w-[130px]"
            >
              <option value="All">Location: All</option>
              {uniqueLocations.map((loc, sIdx) => (
                <option key={sIdx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Jobs Listings Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center rounded-[32px] glass border border-app-border card-shadow flex flex-col items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full mb-4"></div>
            <p className="text-sm font-semibold text-app-muted">Loading sourcing requirements from Firestore...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center rounded-[32px] glass border border-rose-500/20 card-shadow bg-rose-500/5">
            <div className="text-rose-500 font-extrabold text-lg mb-2">Firestore Sync Error</div>
            <p className="text-sm text-app-muted">{error}</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id}
              className={`p-6 rounded-[24px] glass border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${
                job.status === 'Paused' ? 'opacity-65 border-app-border/40' : 'border-app-border/80 hover:border-brand-blue/30'
              }`}
            >
              {/* Left Column: Job Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 border border-brand-blue/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-app-text flex items-center gap-2">
                      {job.title}
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                        job.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/25'
                      }`}>
                        {job.status}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted mt-1 font-semibold">
                      <span>{job.client}</span>
                      <span className="text-app-border">•</span>
                      <span>{job.experience}</span>
                      <span className="text-app-border">•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Badges and Skills Stack */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pl-0 md:pl-16">
                  {job.skills.split(', ').map((skill, index) => (
                    <span key={index} className="text-[11px] font-mono font-semibold bg-app-surface/80 border border-app-border px-2.5 py-1 rounded-xl text-app-text">
                      {skill}
                    </span>
                  ))}
                  <span className="text-xs font-bold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                    {job.openings}
                  </span>
                </div>
              </div>

              {/* Middle Component: Sourcing Statistics */}
              <div className="flex items-center gap-10 md:px-8 border-t md:border-t-0 md:border-l md:border-r border-app-border/40 py-4 md:py-0 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-start">
                {/* Active recruiters workspace */}
                <div 
                  onClick={() => setSelectedJobForRecruiters(job)}
                  className="cursor-pointer group hover:bg-white/5 border border-transparent hover:border-app-border/40 p-2.5 rounded-2xl transition-all flex flex-col justify-start select-none"
                  title="View Recruiters Sourcing for This Job"
                >
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block group-hover:text-brand-blue transition-colors">
                    Recruiters Working
                  </span>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Tiny visual recruiter circles row representation */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {[1, 2, 3].slice(0, Math.min(job.recruitersCount, 3)).map((val, idx) => (
                        <img 
                           key={idx}
                          className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-app-bg object-cover"
                          src={`https://picsum.photos/seed/rec${idx + 5}/50/50`}
                          alt="Recruiter"
                        />
                      ))}
                      {job.recruitersCount > 3 && (
                        <span className="flex items-center justify-center h-6.5 w-6.5 rounded-full ring-2 ring-app-bg bg-brand-violet text-[10px] font-extrabold text-white">
                          +{job.recruitersCount - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-app-text group-hover:text-brand-blue flex items-center gap-1 transition-colors">
                      {job.recruitersCount} active
                      <ChevronRight className="w-3.5 h-3.5 text-app-muted group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" />
                    </span>
                  </div>
                </div>

                {/* Submissions stats */}
                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Submissions</span>
                  <span className="text-xl font-display font-black text-brand-blue mt-1 block">
                    {job.submissionsCount} <span className="text-xs text-app-muted font-bold">Files</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Actives controls */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button 
                  onClick={() => onEditJobClick(job)}
                  className="p-3 bg-app-surface hover:bg-app-bg border border-app-border rounded-xl text-app-muted hover:text-brand-blue transition-colors"
                  title="Edit Job requirement"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onToggleStatus(job.id, job.status)}
                  className={`p-3 border rounded-xl transition-all ${
                    job.status === 'Active' 
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                  }`}
                  title={job.status === 'Active' ? 'Pause Sourcing' : 'Resume Sourcing'}
                >
                  {job.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setJobIdToDelete(job.id)}
                  className="p-3 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-xl transition-all"
                  title="Remove requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="p-16 text-center rounded-[32px] glass border border-app-border">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-display font-bold text-lg text-app-text mt-4">No active requirements found</h3>
            <p className="text-app-muted text-sm mt-1">Try to expand filter definitions or add a new job listing.</p>
          </div>
        )}
      </div>

      {/* 1. Recruiter Assignment Modal */}
      {selectedJobForRecruiters && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-app-bg border border-app-border rounded-[32px] w-full max-w-4xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto card-shadow flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-display font-bold text-app-text">Recruiters Working On This Job</h2>
                  <p className="text-xs text-app-muted mt-1 font-semibold">
                    Requirement: <span className="text-brand-blue">{selectedJobForRecruiters.title}</span> • Client: <span className="text-brand-purple">{selectedJobForRecruiters.client}</span>
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedJobForRecruiters(null)}
                  className="p-2 hover:bg-app-surface border border-app-border hover:border-app-muted rounded-full text-app-muted hover:text-app-text transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Recruiters list */}
              <div className="space-y-4">
                {(() => {
                  const isOpenToAll = selectedJobForRecruiters.assignmentMode === 'open';
                  const filteredRecs = recruitersList.filter(r => selectedJobForRecruiters.assignedRecruiters?.includes(r.id));

                  if (filteredRecs.length === 0) {
                    return (
                      <div className="text-center py-10 bg-app-surface/20 rounded-2xl border border-app-border/60">
                        <Users className="w-8 h-8 text-app-muted mx-auto mb-2" />
                        <h4 className="font-bold text-sm text-app-text">
                          {isOpenToAll ? 'No recruiters assigned yet' : 'No Assigned Recruiters'}
                        </h4>
                        {isOpenToAll ? (
                          <>
                            <div className="mt-2 text-xs text-app-muted font-medium">
                              Recruiters Working: <span className="text-white font-bold">0</span>
                            </div>
                            <p className="text-xs text-app-muted mt-1 font-medium">Waiting for recruiter requests.</p>
                          </>
                        ) : (
                          <p className="text-xs text-app-muted mt-1 font-medium">
                            This job requires specific assigned recruiters but none are chosen yet.
                          </p>
                        )}
                      </div>
                    );
                  }

                  return filteredRecs.map(rec => (
                    <div key={rec.id} className="p-4.5 rounded-2xl bg-app-surface/30 border border-app-border/60 hover:bg-app-surface/60 hover:border-brand-blue/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://picsum.photos/seed/${rec.id}/80/80`} 
                          className="w-10 h-10 rounded-full object-cover border border-app-border" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-app-text flex items-center gap-2">
                            {rec.name}
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-app-bg border border-app-border text-app-muted">
                              {rec.id}
                            </span>
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-app-muted font-medium">
                            <span className="flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${rec.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {rec.status}
                            </span>
                            <span>•</span>
                            <span>Assigned: {rec.assignedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Jobs Working</span>
                          <span className="font-bold text-app-text mt-0.5 block">{rec.activeJobs} Active</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Submissions</span>
                          <span className="font-bold text-brand-blue mt-0.5 block">{rec.submissions} Total</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Short / Select</span>
                          <span className="font-bold text-app-text mt-0.5 block">{rec.shortlisted} / {rec.selected}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Success Rate</span>
                          <span className="font-bold text-emerald-500 mt-0.5 block">{rec.successRate}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedRecruiterForDetails(rec)}
                        className="px-4 py-2 bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white rounded-xl text-xs font-bold transition-all shrink-0 text-center"
                      >
                        View Recruiter Details
                      </button>
                    </div>
                  ));
                })()}
              </div>

              {/* Pending Requests section for Open To All requirements */}
              {selectedJobForRecruiters.assignmentMode === 'open' && (
                <div className="mt-8 pt-6 border-t border-app-border/40">
                  <h3 className="text-lg font-display font-bold text-app-text mb-4 flex items-center gap-2">
                    <span>Pending Requests</span>
                    {pendingRequests.length > 0 && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/30 font-mono">
                        {pendingRequests.length}
                      </span>
                    )}
                  </h3>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map(req => {
                        const rec = req.recruiterDetails;
                        return (
                          <div key={req.id} className="p-4.5 rounded-2xl bg-app-surface/25 border border-app-border/60 hover:border-brand-violet/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <img 
                                src={`https://picsum.photos/seed/${req.recruiterUid}/80/80`} 
                                className="w-11 h-11 rounded-full object-cover border border-app-border" 
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-app-text flex flex-wrap items-center gap-2">
                                  {rec.name}
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-violet/10 border border-brand-violet/20 text-brand-violet font-semibold">
                                    Pending Request
                                  </span>
                                </h4>
                                <p className="text-xs text-app-muted mt-0.5 font-semibold">
                                  Experience: {rec.experience || '3 - 5 Years'} • Category: {rec.mostActiveCategory || 'Sourcing Agency'}
                                </p>
                                
                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {rec.topSkills?.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-app-muted">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Real Metrics Section */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs bg-app-bg/40 p-3 rounded-xl border border-app-border/40 md:w-auto">
                              <div>
                                <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Jobs Working</span>
                                <span className="font-bold text-app-text mt-0.5 block">{rec.activeJobs} Active</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Submissions</span>
                                <span className="font-bold text-brand-blue mt-0.5 block">{rec.submissions} Total</span>
                              </div>
                              <div>
                                <span className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider block">Success Rate</span>
                                <span className="font-bold text-emerald-500 mt-0.5 block">{rec.successRate}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 md:self-center">
                              <button
                                type="button"
                                onClick={() => setSelectedRecruiterForDetails(rec)}
                                className="px-3.5 py-2 bg-app-surface hover:bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text transition-all"
                              >
                                View Profile
                              </button>
                              <button
                                type="button"
                                onClick={() => handleApproveRequest(req.id, req.recruiterUid)}
                                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectRequest(req.id, req.recruiterUid)}
                                className="px-3.5 py-2 bg-red-500/15 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold transition-all"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-app-surface/10 rounded-2xl border border-app-border/40">
                      <p className="text-xs text-app-muted font-medium">No pending requests at the moment.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-app-border/40">
              <button
                type="button"
                onClick={() => setSelectedJobForRecruiters(null)}
                className="px-5 py-2.5 bg-app-surface hover:bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text transition-all"
              >
                Close Assignment Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Recruiter Details Modal */}
      {selectedRecruiterForDetails && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-app-bg border border-app-border rounded-[32px] w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto card-shadow flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://picsum.photos/seed/${selectedRecruiterForDetails.id}/120/120`} 
                    className="w-14 h-14 rounded-full object-cover border border-app-border shadow" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-2xl font-display font-bold text-app-text flex items-center gap-2">
                      {selectedRecruiterForDetails.name}
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-app-surface border border-app-border text-app-muted">
                        ID: {selectedRecruiterForDetails.id}
                      </span>
                    </h2>
                    <p className="text-xs text-app-muted mt-1 font-semibold">
                      Sourcing Partner since <span className="text-app-text">{selectedRecruiterForDetails.joinDate}</span> • Status: <span className="text-emerald-500 font-bold">{selectedRecruiterForDetails.status}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecruiterForDetails(null)}
                  className="p-2 hover:bg-app-surface border border-app-border hover:border-app-muted rounded-full text-app-muted hover:text-app-text transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Performance Indicator Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedRecruiterForDetails.badges.map((badge: string, idx: number) => {
                  let badgeStyles = "bg-brand-blue/10 text-brand-blue border-brand-blue/20";
                  if (badge === "Top Performer") {
                    badgeStyles = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                  } else if (badge === "High Placement Rate") {
                    badgeStyles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                  } else if (badge === "High Submission Rate") {
                    badgeStyles = "bg-brand-purple/10 text-brand-purple border-brand-purple/20";
                  }
                  return (
                    <span 
                      key={idx} 
                      className={`flex items-center gap-1.5 text-[11px] font-extrabold border px-3 py-1 rounded-full ${badgeStyles}`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {badge}
                    </span>
                  );
                })}
              </div>

              {/* Business Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Active Jobs Worked</span>
                  <span className="text-lg font-display font-black text-app-text mt-1 block">
                    {selectedRecruiterForDetails.activeJobs} / {selectedRecruiterForDetails.totalJobsWorked}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Sourcing Conversions</span>
                  <div className="text-sm font-semibold text-app-text mt-1 space-y-0.5">
                    <div>Submissions: <span className="font-bold text-brand-blue">{selectedRecruiterForDetails.submissions}</span></div>
                    <div>Shortlisted: <span className="font-bold text-brand-purple">{selectedRecruiterForDetails.shortlisted}</span></div>
                    <div>Selected: <span className="font-bold text-emerald-500">{selectedRecruiterForDetails.selected}</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Placement Success Rate</span>
                  <span className="text-lg font-display font-black text-emerald-500 mt-1 block">
                    {selectedRecruiterForDetails.successRate}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Response SLA</span>
                  <span className="text-sm font-semibold text-app-text mt-1 block font-mono">
                    ~ {selectedRecruiterForDetails.averageResponseTime}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Top Sourcing Skillset</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedRecruiterForDetails.topSkills.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 border border-app-border text-app-muted">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Most Active Vertical</span>
                  <span className="text-sm font-semibold text-brand-blue mt-1 block">
                    {selectedRecruiterForDetails.mostActiveCategory}
                  </span>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Recent Sourcing Activity</h3>
                <p className="text-xs font-medium text-app-text bg-app-surface/10 p-3 rounded-xl border border-app-border/40 font-mono">
                  Sourced {selectedRecruiterForDetails.submissions} total files across {selectedRecruiterForDetails.totalJobsWorked} client domains. Last active timestamp: {selectedRecruiterForDetails.lastActiveTimestamp} ({selectedRecruiterForDetails.lastActive}). Currently managing candidates for {selectedRecruiterForDetails.currentAssignedJobs.join(', ')}.
                </p>
              </div>

              {/* Recent Candidate Submissions (Last 5) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Recent Candidate Submissions (No Private Data)</h3>
                <div className="overflow-x-auto border border-app-border/60 rounded-2xl bg-app-surface/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider bg-app-surface/30">
                        <th className="py-2.5 px-4">Candidate</th>
                        <th className="py-2.5 px-4">Requirement</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border/40 font-medium text-app-muted">
                      {selectedRecruiterForDetails.recentSubmissions.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-app-surface/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-app-text">{sub.candidate}</td>
                          <td className="py-3 px-4 text-brand-purple font-semibold">{sub.job}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              sub.status === 'Selected' || sub.status === 'Joined'
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                                : sub.status === 'Rejected'
                                ? 'bg-red-500/10 text-red-500 border border-red-500/25'
                                : 'bg-brand-blue/10 text-brand-blue border border-brand-blue/25'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-[11px]">{sub.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-app-border/40">
              <button
                type="button"
                onClick={() => setSelectedRecruiterForDetails(null)}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 rounded-xl text-xs font-extrabold text-white transition-all"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {jobIdToDelete && (
        <div id="delete-confirm-modal" className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-app-bg border border-app-border rounded-[24px] w-full max-w-md p-6 card-shadow animate-fade-in text-center">
            <h2 id="delete-confirm-title" className="text-xl font-display font-bold text-app-text mb-2">Delete Job</h2>
            <p id="delete-confirm-msg" className="text-sm text-app-muted mb-6 leading-relaxed">
              Are you sure you want to permanently delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                id="delete-cancel-btn"
                onClick={() => setJobIdToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-app-border text-app-text font-semibold hover:bg-app-surface transition-all text-xs"
              >
                Cancel
              </button>
              <button
                id="delete-confirm-btn"
                onClick={() => {
                  onDeleteJob(jobIdToDelete);
                  setJobIdToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all text-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
