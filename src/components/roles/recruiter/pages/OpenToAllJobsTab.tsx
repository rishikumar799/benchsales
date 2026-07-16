import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  AlertCircle, 
  SlidersHorizontal,
  Briefcase,
  Unlock,
  Check,
  Zap
} from 'lucide-react';
import BdmProfilePopup from '../components/BdmProfilePopup';
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

interface OpenToAllJobsTabProps {
  onNavigate: (tab: string) => void;
}

export default function OpenToAllJobsTab({ onNavigate }: OpenToAllJobsTabProps) {
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
      name: recruiterProfile?.profile?.fullName || recruiterProfile?.fullName || auth.currentUser?.displayName || 'Recruiter Partner',
      email: recruiterProfile?.profile?.email || recruiterProfile?.email || auth.currentUser?.email || ''
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

  // Map and compute ONLY Open To All Jobs (assignmentMode === 'open' or assignmentMode !== 'restricted')
  const jobs = useMemo(() => {
    return jobsRaw
      .filter((job) => job.assignmentMode === 'open' || job.assignmentMode !== 'restricted')
      .map((job) => {
        const skills = Array.isArray(job.skills) 
          ? job.skills 
          : (typeof job.skills === 'string' ? job.skills.split(',').map((s: string) => s.trim()) : []);

        const bdm = job.bdm || job.bdmName || 'John Mathew';
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

        let createdAtFormatted = 'Recent';
        if (job.createdAt) {
          const date = job.createdAt.toDate ? job.createdAt.toDate() : new Date(job.createdAt);
          createdAtFormatted = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } else if (job.posted) {
          createdAtFormatted = job.posted;
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
          jobType: 'open' as const,
          accessStatus: accessStatus,
          status: job.status || 'open',
          salary: job.salary || '6 - 10 LPA',
          employmentType: job.employmentType || 'Full Time',
          recruiterCount: job.recruiterCount || 0,
          submissionCount: job.submissionCount || 0,
          shortlistCount: job.shortlistCount || 0,
          hiredCount: job.hiredCount || 0
        };
      });
  }, [jobsRaw, assignedJobIds, accessRequestsMap]);

  // Match filtering criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === 'All' || job.skills.includes(selectedSkill);
    const matchesExp = selectedExp === 'All' || job.experience.includes(selectedExp);
    const matchesLoc = selectedLoc === 'All' || job.location.includes(selectedLoc) || (selectedLoc === 'Remote' && job.location.toLowerCase() === 'remote');
    const matchesPrior = selectedPrior === 'All' || job.priority === selectedPrior;

    return matchesSearch && matchesSkill && matchesExp && matchesLoc && matchesPrior;
  });

  // Request Access / Request to Work
  const handleRequestAccess = async (jobId: string) => {
    const currentUid = auth.currentUser?.uid;
    if (!currentUid) return;

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    try {
      const requestId = currentUid;
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-sm font-semibold">Syncing with Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Open To All Jobs</h1>
        <p className="text-app-muted mt-1">Browse open marketplace requirements that anyone can request to work on. Click "Request To Work" to get assigned.</p>
      </div>

      {/* Grid Filter Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search open requirements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3 py-2 rounded-xl text-xs font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Filters:</span>
            </div>

            {/* Skills */}
            <select 
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

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-app-surface border border-app-border">
          <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-app-text">No Open Jobs Found</h3>
          <p className="text-app-muted text-sm mt-1">There are no open requirements currently matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-6 rounded-[28px] bg-app-surface border border-app-border/80 hover:border-brand-blue/30 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl relative"
            >
              {/* Top Row */}
              <div className="flex justify-between items-start">
                <div className="p-3.5 rounded-2xl bg-violet-500/10 text-violet-500 shrink-0">
                  <Unlock className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                    job.priority === 'High' 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                      : job.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {job.priority}
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1">
                    Open To All
                  </span>
                </div>
              </div>

              {/* Title & Company */}
              <div>
                <h3 className="text-lg font-display font-black text-app-text tracking-tight hover:text-brand-blue transition-colors duration-200">
                  {job.title}
                </h3>
                <span className="text-xs font-semibold text-app-muted block mt-0.5">{job.company}</span>
              </div>

              {/* Basic metadata list */}
              <div className="space-y-2 text-xs font-bold text-app-muted pt-2 border-t border-app-border/40">
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="text-app-text">{job.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-app-text">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span>Positions:</span>
                  <span className="text-app-text">{job.positions} Openings</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>BDM Owner:</span>
                  <button 
                    onClick={() => setSelectedBdmName(job.bdm)}
                    className="text-brand-blue hover:underline text-xs font-bold"
                  >
                    {job.bdm}
                  </button>
                </div>
              </div>

              {/* Skills required */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {job.skills.map((skill: string, sIdx: number) => (
                  <span key={sIdx} className="text-[10px] font-mono font-bold bg-brand-blue/5 text-brand-blue border border-brand-blue/10 px-2 py-0.5 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bottom button controls */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono font-semibold text-app-muted">Posted: {job.posted}</span>
                
                {job.accessStatus === 'approved' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500">
                    <Check className="w-4 h-4" /> Assigned
                  </span>
                ) : job.accessStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <Clock className="w-4 h-4" /> Requested
                  </span>
                ) : (
                  <button 
                    onClick={() => handleRequestAccess(job.id)}
                    className="px-4 py-2 bg-brand-blue text-white hover:bg-opacity-95 text-xs font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-white" /> Request To Work
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BDM Profile Popup dialog */}
      {selectedBdmName && (
        <BdmProfilePopup 
          bdmNameOrId={selectedBdmName} 
          onClose={() => setSelectedBdmName(null)} 
        />
      )}
    </div>
  );
}
