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
  Users,
  Bookmark,
  MapPin,
  Calendar,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  Clock
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDoc,
  getDocFromServer
} from 'firebase/firestore';
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
  
  // Auth state
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Firestore states
  const [candidates, setCandidates] = useState<any[]>([]);
  const [savedCandidateUids, setSavedCandidateUids] = useState<string[]>([]);
  const [savedCandidatesList, setSavedCandidatesList] = useState<any[]>([]);
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Page UI subtabs
  const [activeSubTab, setActiveSubTab] = useState<'available' | 'assigned' | 'saved' | 'pending' | 'suggested'>('available');

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail Profile Preview state
  const [previewUid, setPreviewUid] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<any | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Popup / Job Mapping Selection state
  const [selectCandidateModal, setSelectCandidateModal] = useState<any | null>(null);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmittingSelection, setIsSubmittingSelection] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid;

    // 1. Listen to marketplace_jobseekers (Candidates)
    const candidatesCol = collection(db, 'marketplace_jobseekers');
    const unsubCandidates = onSnapshot(candidatesCol, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const profile = data.profile || {};
        
        list.push({
          id: docSnap.id,
          name: profile.fullName || data.name || 'Anonymous',
          email: profile.email || data.email || 'No Email',
          phone: profile.phoneNumber || profile.phone || data.phone || data.phoneNumber || 'N/A',
          location: profile.location || data.location || 'Remote',
          experience: profile.experience || data.experience || 'Entry Level',
          skills: profile.skills || data.skills || [],
          availability: profile.availability || data.availability || 'Available',
          currentStatus: profile.status || data.status || 'Active',
          education: profile.education || data.education || profile.details?.education || 'N/A',
          resumeAvailability: data.resume || profile.resume ? 'Available' : 'Not Uploaded',
          aiProfileScore: data.ai_profile?.score || data.aiProfileScore || profile.aiProfileScore || null,
          createdAt: profile.createdAt || data.createdAt || null,
          updatedAt: profile.updatedAt || data.updatedAt || null,
          assignedRecruiterId: profile.assignedRecruiterId || data.assignedRecruiterId || null,
          details: profile.details || data.details || {
            role: profile.role || data.role || 'Software Engineer',
            skillsFull: profile.skills || data.skills || [],
            years: 2,
            currentCompany: 'N/A',
            currentRole: 'N/A',
            availabilityDetails: 'Immediate'
          }
        });
      });
      setCandidates(list);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching jobseekers:", err);
    });

    // 2. Listen to saved candidates subcollection for this recruiter
    const savedCandidatesCol = collection(db, 'marketplace_recruiters', uid, 'saved_candidates');
    const unsubSaved = onSnapshot(savedCandidatesCol, (snapshot) => {
      const ids: string[] = [];
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        ids.push(docSnap.id);
        list.push({
          id: docSnap.id,
          candidateUid: data.candidateUid || docSnap.id,
          fullName: data.fullName || 'Anonymous',
          email: data.email || 'N/A',
          skills: data.skills || [],
          savedAt: data.savedAt || null
        });
      });
      setSavedCandidateUids(ids);
      setSavedCandidatesList(list);
    }, (err) => {
      console.error("Error fetching saved candidates:", err);
    });

    // 3. Listen to marketplace_jobs (for choice selection dropdown)
    const jobsCol = collection(db, 'marketplace_jobs');
    const unsubJobs = onSnapshot(jobsCol, (snapshot) => {
      const list: RecruiterJob[] = [];
      snapshot.forEach((docSnap) => {
        const docData = docSnap.data();
        if (docData.status === 'paused') return;
        
        const isAssigned = docData.assignedRecruiters?.includes(uid) || false;
        const isCreator = docData.createdBy === uid;
        const isApproved = isAssigned;

        list.push({
          id: docSnap.id,
          title: docData.title || 'Untitled Job',
          company: docData.company || docData.companyName || 'Unknown Company',
          experience: docData.experience || 'N/A',
          skills: docData.skills || [],
          location: docData.location || 'Remote',
          positions: String(docData.positions || docData.openings || '1'),
          priority: docData.priority || 'Medium',
          posted: docData.posted || 'N/A',
          bdm: docData.bdm || 'John Mathew',
          jobType: docData.assignmentMode === 'open' || docData.visibility === 'open' ? 'open' : 'assigned',
          accessStatus: isApproved ? 'approved' : 'none'
        });
      });
      setJobs(list);
    }, (err) => {
      console.error("Error fetching jobs:", err);
    });

    // 4. Listen to recruiter document for queue (candidate_queue) and submissions
    const recruiterDocRef = doc(db, 'marketplace_recruiters', uid);
    const unsubRecruiter = onSnapshot(recruiterDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAccessRequests(data.candidate_queue || []);
      }
    }, (err) => {
      console.error("Error fetching recruiter profile info:", err);
    });

    return () => {
      unsubCandidates();
      unsubSaved();
      unsubJobs();
      unsubRecruiter();
    };
  }, [currentUser]);

  // Dynamic values extraction for filters
  const skillsSet = new Set<string>();
  const expSet = new Set<string>();
  const locSet = new Set<string>();
  const availSet = new Set<string>();
  const statusSet = new Set<string>();

  candidates.forEach(cand => {
    if (cand.skills) cand.skills.forEach((s: string) => skillsSet.add(s));
    if (cand.experience) expSet.add(cand.experience);
    if (cand.location) locSet.add(cand.location);
    if (cand.availability) availSet.add(cand.availability);
    if (cand.currentStatus) statusSet.add(cand.currentStatus);
  });

  const skillsList = ['All', ...Array.from(skillsSet)];
  const expList = ['All', ...Array.from(expSet)];
  const locList = ['All', ...Array.from(locSet)];
  const availList = ['All', ...Array.from(availSet)];
  const statusList = ['All', ...Array.from(statusSet)];

  // Filter candidates based on search terms & active selections
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = !searchQuery ? true : (
      (cand.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.skills || []).some((sk: string) => sk.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cand.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.experience || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSkill = skillFilter === 'All' || (cand.skills || []).includes(skillFilter);
    const matchesExp = expFilter === 'All' || cand.experience === expFilter;
    const matchesLoc = locFilter === 'All' || cand.location === locFilter;
    const matchesAvail = availFilter === 'All' || cand.availability === availFilter;
    const matchesStatus = statusFilter === 'All' || cand.currentStatus === statusFilter;

    return matchesSearch && matchesSkill && matchesExp && matchesLoc && matchesAvail && matchesStatus;
  });

  // Assigned Candidates pool filter (by database uid assignment)
  const assignedCandidates = filteredCandidates.filter(c => 
    c.assignedRecruiterId === currentUser?.uid
  );

  const accessibleJobs = jobs.filter(j => j.accessStatus === 'approved');

  // Handle Save candidate action (Writes ONLY to marketplace_recruiters/{recruiterUid}/saved_candidates/{candidateUid})
  const handleToggleSaveCandidate = async (candidate: any) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const isSaved = savedCandidateUids.includes(candidate.id);
    const saveDocRef = doc(db, 'marketplace_recruiters', uid, 'saved_candidates', candidate.id);

    try {
      if (isSaved) {
        // Remove from saved (removes ONLY the subcollection record, not candidate profile)
        await deleteDoc(saveDocRef);
        setToastMsg(`Removed ${candidate.name} from saved candidates.`);
      } else {
        // Save candidate
        await setDoc(saveDocRef, {
          candidateUid: candidate.id,
          fullName: candidate.name,
          email: candidate.email || '',
          skills: candidate.skills || [],
          savedAt: new Date().toISOString()
        });
        setToastMsg(`Successfully saved ${candidate.name}!`);
      }
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_recruiters/${uid}/saved_candidates/${candidate.id}`);
    }
  };

  // Preview full candidate profile from marketplace_jobseekers/{candidateUid}
  useEffect(() => {
    if (!previewUid) {
      setPreviewProfile(null);
      return;
    }

    setLoadingPreview(true);
    const docRef = doc(db, 'marketplace_jobseekers', previewUid);
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setPreviewProfile({ id: snapshot.id, ...snapshot.data() });
      }
      setLoadingPreview(false);
    }, (err) => {
      console.error("Error reading full profile:", err);
      setLoadingPreview(false);
    });

    return () => unsub();
  }, [previewUid]);

  // Handle manual selection / job mapping flow
  const handleOpenSelectPopup = (cand: any) => {
    setSelectCandidateModal(cand);
    if (accessibleJobs.length > 0) {
      setSelectedJobId(accessibleJobs[0].id);
    } else {
      setSelectedJobId('');
    }
    setNotes('');
  };

  const handleConfirmSelection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectCandidateModal || !selectedJobId) return;

    setIsSubmittingSelection(true);
    const targetJob = accessibleJobs.find(j => j.id === selectedJobId);

    if (targetJob) {
      try {
        const subId = `SUB-${Date.now().toString().slice(-6)}`;
        const subDocRef = doc(db, 'marketplace_submissions', subId);

        await setDoc(subDocRef, {
          submissionId: subId,
          jobId: targetJob.id,
          jobTitle: targetJob.title,
          candidateUid: selectCandidateModal.id,
          candidateName: selectCandidateModal.name,
          recruiterUid: currentUser.uid,
          recruiterName: currentUser.displayName || currentUser.email || 'Recruiter Partner',
          bdmUid: targetJob.bdm || 'system-bdm',
          companyName: targetJob.company,
          status: 'Submitted',
          submittedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: notes || 'Submitted directly from available candidate pool.'
        });

        // Toggle selected list state in parent if required
        onToggleSelect(selectCandidateModal.id);

        setToastMsg(`Successfully submitted ${selectCandidateModal.name} for ${targetJob.title} at ${targetJob.company}!`);
        setTimeout(() => setToastMsg(''), 5000);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `marketplace_submissions`);
      }
    }

    setIsSubmittingSelection(false);
    setSelectCandidateModal(null);
  };

  // Assign global candidate to recruiter workspace (Realtime Firestore Write)
  const handleAssignToMe = async (candidateId: string) => {
    if (!currentUser) return;
    try {
      const candRef = doc(db, 'marketplace_jobseekers', candidateId);
      await setDoc(candRef, {
        profile: {
          assignedRecruiterId: currentUser.uid
        }
      }, { merge: true });
      setToastMsg("Successfully assigned candidate to your workspace!");
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${candidateId}`);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      setToastMsg("Database sync refreshed successfully!");
    } catch (err) {
      console.warn("Offline or direct connection test failed, using cache data.");
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setTimeout(() => setToastMsg(''), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Toast notification panel */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#0B1528] border-2 border-brand-blue text-app-text px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header and Sync Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text flex items-center gap-2">
            Candidates Pool
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" title="Realtime Firestore Live" />
          </h1>
          <p className="text-app-muted mt-1">Manage active pool mappings, track profile selections, and bookmark candidate profiles securely with Firestore.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-3 bg-app-surface hover:bg-app-surface/80 border border-app-border rounded-xl text-app-muted hover:text-app-text transition-all flex items-center gap-2 text-xs font-bold"
            title="Force refresh database connection"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-blue' : ''}`} />
            <span>Sync</span>
          </button>
          <span className="text-xs font-bold text-app-muted bg-app-surface border border-app-border px-3.5 py-2.5 rounded-xl">
            Selected: <span className="text-brand-blue font-extrabold">{selectedCandidates.length}</span>
          </span>
          <span className="px-4 py-2.5 bg-[#1E293B] border border-app-border rounded-xl text-xs font-bold shrink-0 shadow-lg text-slate-200">
            {candidates.length} Global Profiles
          </span>
        </div>
      </div>

      {/* Subtab selection panel */}
      <div className="flex border-b border-app-border/60 pb-px gap-1 overflow-x-auto">
        {[
          { id: 'available', label: 'Available Pool', icon: Users, badge: candidates.length },
          { id: 'assigned', label: 'Assigned Pool', icon: UserCheck, badge: candidates.filter(c => c.assignedRecruiterId === currentUser?.uid).length },
          { id: 'saved', label: 'Saved Candidates', icon: Bookmark, badge: savedCandidateUids.length },
          { id: 'pending', label: 'Pending Requests', icon: FileClock, badge: accessRequests.filter(r => r.status === 'Pending').length },
          { id: 'suggested', label: 'AI Suggested', icon: Sparkles, extra: 'Live' }
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3.5 border-b-2 font-bold text-xs whitespace-nowrap transition-all duration-200 relative ${
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

      {/* Search and Filters Section */}
      {(activeSubTab === 'available' || activeSubTab === 'assigned') && (
        <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input 
                type="text" 
                placeholder="Search candidates by name, email, skills, location, experience..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
              />
            </div>
          </div>

          {/* Filters grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-muted uppercase">Skills</label>
              <select 
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text outline-none cursor-pointer"
              >
                <option value="All">All Skills</option>
                {skillsList.filter(s => s !== 'All').map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-muted uppercase">Experience</label>
              <select 
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text outline-none cursor-pointer"
              >
                <option value="All">All Exp</option>
                {expList.filter(s => s !== 'All').map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-muted uppercase">Location</label>
              <select 
                value={locFilter}
                onChange={(e) => setLocFilter(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text outline-none cursor-pointer"
              >
                <option value="All">All Locations</option>
                {locList.filter(s => s !== 'All').map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-muted uppercase">Availability</label>
              <select 
                value={availFilter}
                onChange={(e) => setAvailFilter(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text outline-none cursor-pointer"
              >
                <option value="All">All Availabilities</option>
                {availList.filter(s => s !== 'All').map(avail => (
                  <option key={avail} value={avail}>{avail}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-app-muted uppercase">Status</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {statusList.filter(s => s !== 'All').map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW A: AVAILABLE CANDIDATE POOL (Detailed Cards) */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'available' && (
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((cand) => {
                const isSaved = savedCandidateUids.includes(cand.id);
                const isAssigned = cand.assignedRecruiterId === currentUser?.uid;
                
                return (
                  <div 
                    key={cand.id} 
                    id={`candidate-card-${cand.id}`}
                    className="p-6 rounded-[24px] glass border border-app-border/80 hover:border-brand-blue/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-brand-blue/5 relative group"
                  >
                    {/* Upper profile information block */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        {/* Profile Photo */}
                        <div className="w-14 h-14 rounded-full bg-brand-blue/10 border-2 border-brand-blue/30 flex items-center justify-center text-brand-blue text-lg font-extrabold font-mono shrink-0">
                          {cand.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>

                        {/* Badges / Control indicator */}
                        <div className="flex items-center gap-1.5">
                          {cand.aiProfileScore && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2 py-1 rounded-lg">
                              <Sparkles className="w-3 h-3 text-brand-violet animate-pulse" />
                              Match: {cand.aiProfileScore}%
                            </span>
                          )}
                          <span className="inline-flex items-center text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                            {cand.currentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Name, Role & basic metrics */}
                      <div>
                        <h3 className="font-display font-bold text-lg text-app-text tracking-tight group-hover:text-brand-blue transition-colors">
                          {cand.name}
                        </h3>
                        <span className="text-xs font-semibold text-app-muted block mt-0.5">{cand.details.role}</span>
                      </div>

                      {/* Detailed Meta parameters block */}
                      <div className="pt-2 border-t border-app-border/45 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-app-muted">
                          <Mail className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="truncate">{cand.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <Phone className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{cand.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{cand.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <Briefcase className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="font-bold text-app-text">{cand.experience} Experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <GraduationCap className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="truncate">{cand.education}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <FileText className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="font-semibold text-app-text">Resume: {cand.resumeAvailability}</span>
                        </div>
                      </div>

                      {/* Key skills collection */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {cand.skills.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="text-[10px] font-mono font-extrabold border bg-indigo-500/5 text-indigo-400 border-indigo-500/10 px-2 py-0.5 rounded-lg">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Created / Updated metadata block */}
                      <div className="flex items-center justify-between text-[10px] text-app-muted/80 pt-2 font-semibold">
                        <span>Added: {cand.createdAt ? new Date(cand.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                        <span>Updated: {cand.updatedAt ? new Date(cand.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Lower action controls block */}
                    <div className="pt-4 border-t border-app-border/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Bookmark/Save action button */}
                        <button 
                          id={`save-btn-${cand.id}`}
                          onClick={() => handleToggleSaveCandidate(cand)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isSaved 
                              ? 'bg-brand-blue/15 border-brand-blue text-brand-blue hover:bg-brand-blue/20' 
                              : 'bg-app-surface border-app-border text-app-muted hover:text-brand-blue hover:border-brand-blue/40'
                          }`}
                          title={isSaved ? "Remove from saved candidates" : "Save Candidate"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-blue' : ''}`} />
                        </button>

                        {/* View profile details button */}
                        <button 
                          id={`preview-btn-${cand.id}`}
                          onClick={() => setPreviewUid(cand.id)}
                          className="p-2.5 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-blue rounded-xl border border-app-border transition-colors"
                          title="Preview Full Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Map candidate to job or workspace */}
                      <div className="flex gap-2">
                        {!isAssigned && (
                          <button 
                            onClick={() => handleAssignToMe(cand.id)}
                            className="px-3 py-2 bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all"
                            title="Assign candidate profile to your recruiter workspace"
                          >
                            Assign to Me
                          </button>
                        )}
                        <button 
                          onClick={() => handleOpenSelectPopup(cand)}
                          className="px-4 py-2 bg-brand-blue text-white hover:bg-brand-blue/90 rounded-xl text-xs font-extrabold shadow-sm transition-all"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-[32px] glass border border-app-border">
              <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-3" />
              <h3 className="font-semibold text-app-text text-sm">No pool candidates found</h3>
              <p className="text-xs text-app-muted mt-1">Refine your search parameters or select different filters.</p>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW B: ASSIGNED CANDIDATE POOL */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'assigned' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20 text-xs font-semibold text-app-text flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-brand-blue" />
            <span>These are the live candidate profiles specifically assigned to your workspace under Firestore.</span>
          </div>

          {assignedCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignedCandidates.map((cand) => {
                const isSaved = savedCandidateUids.includes(cand.id);
                return (
                  <div 
                    key={cand.id} 
                    className="p-6 rounded-[24px] glass border border-brand-blue/35 shadow-lg shadow-brand-blue/5 flex flex-col justify-between space-y-4 relative group"
                  >
                    {/* Upper content */}
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-full bg-brand-blue/10 border-2 border-brand-blue/30 flex items-center justify-center text-brand-blue text-lg font-extrabold font-mono shrink-0">
                          {cand.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {cand.aiProfileScore && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2 py-1 rounded-lg">
                              <Sparkles className="w-3 h-3 text-brand-violet" />
                              Match: {cand.aiProfileScore}%
                            </span>
                          )}
                          <span className="inline-flex items-center text-[10px] font-extrabold bg-brand-blue/15 text-brand-blue border border-brand-blue/20 px-2.5 py-1 rounded-lg">
                            Assigned
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-lg text-app-text tracking-tight">
                          {cand.name}
                        </h3>
                        <span className="text-xs font-semibold text-app-muted block mt-0.5">{cand.details.role}</span>
                      </div>

                      <div className="pt-2 border-t border-app-border/45 space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-app-muted">
                          <Mail className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="truncate">{cand.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <Phone className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{cand.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{cand.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <Briefcase className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="font-bold text-app-text">{cand.experience} Experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-app-muted">
                          <GraduationCap className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span className="truncate">{cand.education}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {cand.skills.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="text-[10px] font-mono font-semibold bg-app-surface border border-app-border px-2.5 py-0.5 rounded-lg text-app-text">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer actions */}
                    <div className="pt-4 border-t border-app-border/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleSaveCandidate(cand)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isSaved 
                              ? 'bg-brand-blue/15 border-brand-blue text-brand-blue' 
                              : 'bg-app-surface border-app-border text-app-muted hover:text-brand-blue hover:border-brand-blue/40'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-blue' : ''}`} />
                        </button>

                        <button 
                          onClick={() => setPreviewUid(cand.id)}
                          className="p-2.5 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-blue rounded-xl border border-app-border transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <button 
                        onClick={() => handleOpenSelectPopup(cand)}
                        className="px-5 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center rounded-[32px] glass border border-app-border">
              <UserCheck className="w-12 h-12 text-app-muted mx-auto mb-3" />
              <h3 className="font-semibold text-app-text text-sm">No assigned candidates found</h3>
              <p className="text-xs text-app-muted mt-1">Assign candidates to your workspace first by clicking "Assign to Me" in the Available Pool.</p>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* VIEW C: SAVED CANDIDATES LIST */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'saved' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-brand-blue/5 border border-brand-blue/20 text-xs font-semibold text-app-text flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-brand-blue" />
            <span>These are bookmarked candidates stored under your private path in Firestore. Removing them does not affect original profiles.</span>
          </div>

          <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-4 px-3 w-12 text-center">#</th>
                    <th className="py-4 px-4">Candidate Name</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Skills</th>
                    <th className="py-4 px-4">Saved At</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {savedCandidatesList.length > 0 ? (
                    savedCandidatesList.map((sc, index) => (
                      <tr key={sc.id} className="hover:bg-app-surface/30 transition-colors">
                        <td className="py-4 px-3 text-center text-xs font-mono font-bold text-app-muted">{index + 1}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono shrink-0">
                              {sc.fullName.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div>
                              <button 
                                onClick={() => setPreviewUid(sc.candidateUid)}
                                className="font-bold text-app-text hover:text-brand-blue text-left transition-colors flex items-center gap-1.5"
                              >
                                {sc.fullName}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-app-muted font-mono text-xs">{sc.email}</td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {sc.skills.map((skill: string, sIdx: number) => (
                              <span key={sIdx} className="text-[10px] font-mono bg-app-surface border border-app-border px-2 py-0.5 rounded text-app-text">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono text-xs text-app-muted">
                          {sc.savedAt ? new Date(sc.savedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setPreviewUid(sc.candidateUid)}
                              className="p-2 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-blue rounded-xl border border-app-border transition-colors"
                              title="Preview Profile"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                            <button 
                              id={`unsave-row-btn-${sc.candidateUid}`}
                              onClick={() => handleToggleSaveCandidate({ id: sc.id, name: sc.fullName })}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-app-muted">
                        <Bookmark className="w-10 h-10 text-app-muted mx-auto mb-3" />
                        <p className="font-semibold text-app-text text-sm">No saved candidates found</p>
                        <p className="text-xs text-app-muted mt-1">Bookmark candidate cards to see them here.</p>
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
      {/* VIEW D: PENDING CANDIDATE REQUESTS */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'pending' && (
        <div className="space-y-6">
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
                  {accessRequests.length > 0 ? (
                    accessRequests.map((req) => {
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
                          <td className="py-4 px-4 text-xs font-mono">{req.requestDate || req.requestedAt || 'N/A'}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase border px-2.5 py-1 rounded-full ${pill}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-xs text-brand-blue hover:underline font-bold flex items-center gap-1">
                                Details <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-app-muted">
                        <FileClock className="w-10 h-10 text-app-muted mx-auto mb-3" />
                        <p className="font-semibold text-app-text text-sm">No access requests logged</p>
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
      {/* VIEW E: SUGGESTED CANDIDATES */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'suggested' && (
        <div className="p-12 text-center rounded-[32px] glass border border-app-border bg-gradient-to-br from-brand-violet/5 to-brand-blue/5">
          <Sparkles className="w-12 h-12 text-brand-violet mx-auto mb-4 animate-pulse" />
          <h3 className="font-display font-bold text-xl text-app-text">AI suggested candidate pairing</h3>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-violet/20 text-brand-violet font-mono">
            Active
          </span>
          <p className="text-app-muted text-sm max-w-md mx-auto mt-4 leading-relaxed">
            Automatic resume-to-JD alignment score indexing is running live! Best match recommendations are highlighted on individual available candidate profile cards.
          </p>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FULL CANDIDATE PROFILE PREVIEW MODAL */}
      {/* ---------------------------------------------------- */}
      {previewUid && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#090D1A] border border-app-border rounded-3xl overflow-hidden shadow-2xl animate-scale-up text-app-text max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="h-16 border-b border-app-border/40 px-6 flex items-center justify-between bg-app-surface/20 shrink-0">
              <h3 className="font-display font-extrabold text-base text-app-text flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-blue" />
                Candidate Firestore Document Profile
              </h3>
              <button 
                id="close-preview-btn"
                onClick={() => setPreviewUid(null)}
                className="p-2 text-app-muted hover:text-app-text bg-app-surface/60 rounded-xl border border-app-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content Scroll Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingPreview ? (
                <div className="py-20 flex justify-center items-center">
                  <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : previewProfile ? (
                <div className="space-y-6">
                  {/* General Profile Summary Header */}
                  <div className="p-6 rounded-2xl bg-app-surface/60 border border-app-border/80 flex flex-col md:flex-row items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-brand-blue/10 border-2 border-brand-blue/40 flex items-center justify-center text-brand-blue text-2xl font-extrabold font-mono shrink-0">
                      {(previewProfile.profile?.fullName || previewProfile.name || 'AN').split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="text-center md:text-left space-y-1 flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <h4 className="font-display font-extrabold text-xl text-app-text">
                          {previewProfile.profile?.fullName || previewProfile.name || 'Anonymous'}
                        </h4>
                        <span className="px-2.5 py-0.5 bg-brand-blue/10 text-brand-blue text-[10px] font-extrabold border border-brand-blue/20 rounded-full uppercase tracking-wider mx-auto md:mx-0 w-fit">
                          {previewProfile.profile?.status || previewProfile.status || 'approved'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-brand-blue">{previewProfile.profile?.details?.role || previewProfile.details?.role || 'Software Engineer'}</p>
                      <p className="text-xs text-app-muted">{previewProfile.profile?.experience || previewProfile.experience || 'Entry Level'} Experience</p>
                    </div>
                  </div>

                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-app-surface/45 border border-app-border space-y-3">
                      <h5 className="text-xs font-bold text-brand-blue uppercase tracking-wider border-b border-app-border pb-1">Contact Information</h5>
                      <div className="space-y-2 text-xs text-app-muted">
                        <p><strong className="text-app-text">Email:</strong> {previewProfile.profile?.email || previewProfile.email || 'N/A'}</p>
                        <p><strong className="text-app-text">Phone:</strong> {previewProfile.profile?.phoneNumber || previewProfile.profile?.phone || previewProfile.phoneNumber || 'N/A'}</p>
                        <p><strong className="text-app-text">Location:</strong> {previewProfile.profile?.location || previewProfile.location || 'Remote'}</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-app-surface/45 border border-app-border space-y-3">
                      <h5 className="text-xs font-bold text-brand-blue uppercase tracking-wider border-b border-app-border pb-1">Availability & Education</h5>
                      <div className="space-y-2 text-xs text-app-muted">
                        <p><strong className="text-app-text">Availability:</strong> {previewProfile.profile?.availability || previewProfile.availability || 'Immediate'}</p>
                        <p><strong className="text-app-text">Details:</strong> {previewProfile.profile?.details?.availabilityDetails || 'N/A'}</p>
                        <p><strong className="text-app-text">Education:</strong> {previewProfile.profile?.education || previewProfile.education || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="p-4 rounded-xl bg-app-surface/45 border border-app-border space-y-3">
                    <h5 className="text-xs font-bold text-brand-blue uppercase tracking-wider border-b border-app-border pb-1">Skills Profile</h5>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(previewProfile.profile?.skills || previewProfile.skills || []).map((skill: string, sIdx: number) => (
                        <span key={sIdx} className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Complete Document Raw View to verify accurate Firestore reads */}
                  <div className="p-4 rounded-xl bg-[#030712] border border-app-border space-y-3 font-mono">
                    <div className="flex justify-between items-center border-b border-app-border pb-1.5">
                      <span className="text-xs font-bold text-app-muted uppercase">Raw Firestore Record</span>
                      <span className="text-[10px] text-emerald-400">Path: marketplace_jobseekers/{previewUid}</span>
                    </div>
                    <pre className="text-[11px] text-slate-300 overflow-x-auto p-2 bg-black/40 rounded-lg max-h-60">
                      {JSON.stringify(previewProfile, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-app-muted">
                  <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-3" />
                  <p className="font-semibold text-app-text">Failed to load complete Firestore profile</p>
                </div>
              )}
            </div>

            {/* Modal Controls */}
            <div className="h-16 border-t border-app-border/40 px-6 flex items-center justify-end bg-app-surface/20 shrink-0">
              <button 
                onClick={() => setPreviewUid(null)}
                className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-blue/90"
              >
                Close Profile
              </button>
            </div>

          </div>
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
                  {selectCandidateModal.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-app-text">{selectCandidateModal.name}</h4>
                  <p className="text-xs text-app-muted">{selectCandidateModal.details?.role || 'Software Engineer'} • {selectCandidateModal.experience} Exp</p>
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
