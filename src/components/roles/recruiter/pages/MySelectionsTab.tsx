import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Briefcase, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  GraduationCap, 
  Eye, 
  RefreshCw, 
  Search, 
  Sparkles, 
  AlertCircle, 
  X, 
  Bookmark, 
  FileText,
  Clock,
  ExternalLink,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  getDoc,
  getDocFromServer
} from 'firebase/firestore';

interface MySelectionsTabProps {
  selectedCandidateIds: string[];
  onDeselect: (id: string) => void;
  onNavigate: (tab: string) => void;
  candidates?: any;
  onSubmitProfile?: any;
}

export default function MySelectionsTab({ 
  onDeselect,
  onNavigate,
  onSubmitProfile
}: MySelectionsTabProps) {
  
  // Auth & user state
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Selections list from subcollection
  const [selections, setSelections] = useState<any[]>([]);
  // Jobseeker profiles list to join with selections in realtime
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Search and local filtering
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Preview Modal state
  const [previewUid, setPreviewUid] = useState<string | null>(null);
  const [previewProfile, setPreviewProfile] = useState<any | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Track auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Listen to Firestore selections and candidate profiles in realtime
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const uid = currentUser.uid;

    // 1. Listen to saved candidates subcollection for this recruiter
    const savedColRef = collection(db, 'marketplace_recruiters', uid, 'saved_candidates');
    const unsubSaved = onSnapshot(savedColRef, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          candidateUid: data.candidateUid || docSnap.id,
          fullName: data.fullName || 'Anonymous Candidate',
          email: data.email || 'N/A',
          skills: data.skills || [],
          savedAt: data.savedAt || null
        });
      });
      setSelections(list);
      setLoading(false);
    }, (err) => {
      console.error("Error listening to saved candidates:", err);
      setLoading(false);
    });

    // 2. Listen to all marketplace_jobseekers to dynamically enrich candidates profile data
    const jobseekersColRef = collection(db, 'marketplace_jobseekers');
    const unsubProfiles = onSnapshot(jobseekersColRef, (snapshot) => {
      const map: Record<string, any> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const profile = data.profile || {};
        map[docSnap.id] = {
          id: docSnap.id,
          fullName: profile.fullName || data.name || 'Anonymous',
          email: profile.email || data.email || 'No Email',
          phone: profile.phoneNumber || profile.phone || data.phone || data.phoneNumber || 'N/A',
          location: profile.location || data.location || 'Remote',
          experience: profile.experience || data.experience || 'Entry Level',
          skills: profile.skills || data.skills || [],
          availability: profile.availability || data.availability || 'Available',
          currentStatus: profile.status || data.status || 'Active',
          education: profile.education || data.education || profile.details?.education || 'N/A',
          details: profile.details || data.details || {
            role: profile.role || data.role || 'Software Engineer',
            years: 2,
            currentCompany: 'N/A',
            currentRole: 'N/A',
            availabilityDetails: 'Immediate'
          }
        };
      });
      setProfiles(map);
    }, (err) => {
      console.error("Error listening to jobseeker profiles:", err);
    });

    return () => {
      unsubSaved();
      unsubProfiles();
    };
  }, [currentUser]);

  // Preview full candidate profile details from marketplace_jobseekers in realtime
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
      } else {
        setPreviewProfile(null);
      }
      setLoadingPreview(false);
    }, (err) => {
      console.error("Error loading full profile preview:", err);
      setLoadingPreview(false);
    });

    return () => unsub();
  }, [previewUid]);

  // Remove a selection (Deletes ONLY from marketplace_recruiters/{recruiterUid}/saved_candidates/{candidateUid})
  const handleRemoveSelection = async (candidateUid: string, candidateName: string) => {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const saveDocRef = doc(db, 'marketplace_recruiters', uid, 'saved_candidates', candidateUid);

    try {
      await deleteDoc(saveDocRef);
      onDeselect(candidateUid); // trigger parent deselect to sync counter
      setToastMsg(`Removed ${candidateName} from your selections.`);
      setTimeout(() => setToastMsg(''), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_recruiters/${uid}/saved_candidates/${candidateUid}`);
    }
  };

  // Perform a manual connection/refresh sync
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      setToastMsg("Selections database synchronized in real-time!");
    } catch (err) {
      console.warn("Offline or direct connection test failed, using cache data.");
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setTimeout(() => setToastMsg(''), 4000);
    }, 1000);
  };

  // Merge selection documents with full jobseeker profiles
  const mergedSelections = selections.map(sel => {
    const prof = profiles[sel.candidateUid] || {};
    return {
      id: sel.id,
      candidateUid: sel.candidateUid,
      fullName: prof.fullName || sel.fullName,
      email: prof.email || sel.email,
      phone: prof.phone || 'N/A',
      location: prof.location || 'Remote',
      experience: prof.experience || 'Entry Level',
      skills: prof.skills && prof.skills.length > 0 ? prof.skills : sel.skills,
      availability: prof.availability || 'Available',
      savedAt: sel.savedAt,
      education: prof.education || 'N/A',
      currentStatus: prof.currentStatus || 'Active',
      role: prof.details?.role || 'Software Engineer'
    };
  });

  // Local client search filter
  const filteredSelections = mergedSelections.filter(sel => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      sel.fullName.toLowerCase().includes(query) ||
      sel.email.toLowerCase().includes(query) ||
      sel.location.toLowerCase().includes(query) ||
      sel.skills.some((sk: string) => sk.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-[#0B1528] border-2 border-brand-blue text-app-text px-6 py-4 rounded-2xl shadow-2xl z-50 animate-slide-in flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-brand-blue animate-pulse" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text flex items-center gap-2">
            My Selections
            <span className="w-2.5 h-2.5 bg-brand-blue rounded-full animate-ping" title="Realtime Firestore Live" />
          </h1>
          <p className="text-app-muted mt-1">
            Review and manage your shortlisted candidate profiles. Fully synchronized in realtime with Firestore.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-3 bg-app-surface hover:bg-app-surface/80 border border-app-border rounded-xl text-app-muted hover:text-app-text transition-all flex items-center gap-2 text-xs font-bold"
            title="Force refresh selections sync"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-blue' : ''}`} />
            <span>Sync</span>
          </button>
          <span className="px-4 py-2.5 bg-[#1E293B] border border-app-border rounded-xl text-xs font-bold shrink-0 shadow-lg text-slate-200">
            {selections.length} Selected Candidates
          </span>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="p-4 rounded-2xl glass border border-app-border">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Filter selections by candidate name, email, skills, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none text-app-text"
          />
        </div>
      </div>

      {/* Selections grid panel */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredSelections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSelections.map((sel) => (
            <div 
              key={sel.id} 
              id={`selection-card-${sel.candidateUid}`}
              className="p-6 rounded-[24px] glass border border-app-border/80 hover:border-brand-blue/40 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-brand-blue/5 relative group"
            >
              {/* Upper segment */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-full bg-brand-blue/10 border-2 border-brand-blue/30 flex items-center justify-center text-brand-blue text-lg font-extrabold font-mono shrink-0">
                    {sel.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <span className="inline-flex items-center text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    {sel.availability}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-app-text tracking-tight group-hover:text-brand-blue transition-colors">
                    {sel.fullName}
                  </h3>
                  <span className="text-xs font-semibold text-app-muted block mt-0.5">{sel.role}</span>
                </div>

                {/* Display parameter items */}
                <div className="pt-2 border-t border-app-border/45 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-app-muted">
                    <Mail className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span className="truncate">{sel.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-app-muted">
                    <Phone className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>{sel.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-app-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>{sel.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-app-muted">
                    <Briefcase className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span className="font-bold text-app-text">{sel.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-app-muted">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>Saved: {sel.savedAt ? new Date(sel.savedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
                  </div>
                </div>

                {/* Candidate Skills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {sel.skills.map((skill: string, sIdx: number) => (
                    <span key={sIdx} className="text-[10px] font-mono font-extrabold border bg-indigo-500/5 text-indigo-400 border-indigo-500/10 px-2 py-0.5 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lower actions segment */}
              <div className="pt-4 border-t border-app-border/40 flex items-center justify-between gap-2">
                <button 
                  onClick={() => setPreviewUid(sel.candidateUid)}
                  className="px-3 py-2 bg-app-surface hover:bg-app-bg text-app-muted hover:text-brand-blue rounded-xl border border-app-border text-xs font-bold transition-all flex items-center gap-1.5 flex-1 justify-center"
                  title="Open Full Candidate Profile"
                >
                  <Eye className="w-4 h-4" />
                  <span>Profile</span>
                </button>

                {onSubmitProfile && (
                  <button 
                    onClick={() => {
                      const targetCandidate = {
                        id: sel.candidateUid,
                        name: sel.fullName,
                        experience: sel.experience,
                        skills: sel.skills,
                        availability: sel.availability,
                        details: {
                          role: sel.role,
                          skillsFull: sel.skills,
                          years: parseInt(sel.experience) || 2,
                          currentCompany: 'N/A',
                          currentRole: sel.role,
                          availabilityDetails: sel.availability
                        }
                      };
                      onSubmitProfile(targetCandidate);
                    }}
                    className="px-3 py-2 bg-brand-blue hover:bg-brand-blue/85 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 flex-1 justify-center shadow-md shadow-brand-blue/15"
                    title="Submit profile to a job requirement"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit</span>
                  </button>
                )}

                <button 
                  onClick={() => handleRemoveSelection(sel.candidateUid, sel.fullName)}
                  className="p-2 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl border border-red-500/10 transition-all flex items-center justify-center shrink-0"
                  title="Remove candidate selection"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-[32px] glass border border-app-border">
          <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-3" />
          <h3 className="font-semibold text-app-text text-sm">No selected candidates found</h3>
          <p className="text-xs text-app-muted mt-1">
            {searchQuery ? "No matches found for your search query." : "Navigate to the Candidate Pool tab to add candidates to your selections roster."}
          </p>
          {!searchQuery && (
            <button 
              onClick={() => onNavigate('candidates')}
              className="mt-5 px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-extrabold shadow-lg"
            >
              Go to Candidate Pool
            </button>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* CANDIDATE PROFILE PREVIEW MODAL */}
      {/* ---------------------------------------------------- */}
      {previewUid && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-2xl bg-[#090D1A] border border-app-border rounded-[32px] overflow-hidden shadow-2xl text-app-text my-8">
            
            {/* Header backdrop */}
            <div className="h-32 bg-gradient-to-r from-brand-blue/20 to-brand-violet/20 relative p-6 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-extrabold bg-brand-blue/20 text-brand-blue px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Realtime Candidate Dossier
                </span>
              </div>
              <button 
                onClick={() => setPreviewUid(null)}
                className="p-2 text-app-muted hover:text-app-text bg-black/40 rounded-full border border-app-border/40 hover:scale-105 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingPreview ? (
              <div className="py-24 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
              </div>
            ) : previewProfile ? (
              <div className="p-6 md:p-8 -mt-12 space-y-6">
                
                {/* Meta details header info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-app-border/40">
                  <div className="flex items-end gap-4">
                    <div className="w-20 h-20 rounded-full bg-brand-blue/10 border-4 border-[#090D1A] flex items-center justify-center text-brand-blue text-3xl font-extrabold font-mono shadow-xl shrink-0">
                      {(previewProfile.profile?.fullName || previewProfile.name || 'Anonymous').split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-extrabold text-app-text leading-tight">
                        {previewProfile.profile?.fullName || previewProfile.name || 'Anonymous'}
                      </h2>
                      <p className="text-brand-blue font-bold text-xs mt-1">
                        {previewProfile.profile?.role || previewProfile.details?.role || 'Software Engineer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                      {previewProfile.profile?.availability || previewProfile.availability || 'Available'}
                    </span>
                    <span className="text-[11px] font-extrabold bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-full">
                      Status: {previewProfile.profile?.status || previewProfile.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Profile attributes grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  
                  {/* Contact Block */}
                  <div className="space-y-3.5 bg-app-surface/40 border border-app-border/60 p-5 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-app-muted flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-brand-blue" />
                      Contact Information
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2.5 text-app-text">
                        <Mail className="w-4 h-4 text-app-muted shrink-0" />
                        <span>{previewProfile.profile?.email || previewProfile.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-app-text">
                        <Phone className="w-4 h-4 text-app-muted shrink-0" />
                        <span>{previewProfile.profile?.phoneNumber || previewProfile.profile?.phone || previewProfile.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-app-text">
                        <MapPin className="w-4 h-4 text-app-muted shrink-0" />
                        <span>{previewProfile.profile?.location || previewProfile.location || 'Remote'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Career Metrics */}
                  <div className="space-y-3.5 bg-app-surface/40 border border-app-border/60 p-5 rounded-2xl">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-app-muted flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-brand-blue" />
                      Work & Experience
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-app-muted">Experience Level:</span>
                        <span className="font-extrabold text-app-text">{previewProfile.profile?.experience || previewProfile.experience || 'Entry Level'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-app-muted">Education Degree:</span>
                        <span className="font-extrabold text-app-text truncate max-w-[150px]">{previewProfile.profile?.education || previewProfile.education || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-app-muted">Current Assignment:</span>
                        <span className="font-extrabold text-brand-violet">
                          {previewProfile.profile?.assignedRecruiterId ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Candidate Skills block */}
                <div className="space-y-3.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-app-muted">
                    Technical Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(previewProfile.profile?.skills || previewProfile.skills || []).map((skill: string, sIdx: number) => (
                      <span key={sIdx} className="text-xs font-mono font-bold bg-[#1E293B] text-slate-200 border border-slate-700/60 px-3.5 py-1.5 rounded-xl">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Extra Details segment */}
                {previewProfile.profile?.details && (
                  <div className="space-y-3 bg-app-surface/20 border border-app-border/40 p-5 rounded-2xl text-xs">
                    <h4 className="font-bold text-app-text text-sm">Professional Summary</h4>
                    <p className="text-app-muted leading-relaxed">
                      This candidate is a skilled {previewProfile.profile?.details?.role || 'professional'} based in {previewProfile.profile?.location || 'Remote'} with {previewProfile.profile?.experience || 'applicable'} experience. Equipped with core technical competencies including {(previewProfile.profile?.skills || []).slice(0, 4).join(', ')}.
                    </p>
                  </div>
                )}

                {/* Bottom Modal Close actions */}
                <div className="pt-6 border-t border-app-border/45 flex items-center justify-end gap-3">
                  <button 
                    onClick={() => setPreviewUid(null)}
                    className="px-5 py-2.5 bg-app-surface hover:bg-app-bg text-app-muted hover:text-app-text rounded-xl text-xs font-bold border border-app-border"
                  >
                    Close
                  </button>
                  {onSubmitProfile && (
                    <button 
                      onClick={() => {
                        const targetCandidate = {
                          id: previewUid,
                          name: previewProfile.profile?.fullName || previewProfile.name || 'Anonymous',
                          experience: previewProfile.profile?.experience || previewProfile.experience || 'Entry Level',
                          skills: previewProfile.profile?.skills || previewProfile.skills || [],
                          availability: previewProfile.profile?.availability || previewProfile.availability || 'Available',
                          details: {
                            role: previewProfile.profile?.role || previewProfile.details?.role || 'Software Engineer',
                            skillsFull: previewProfile.profile?.skills || previewProfile.skills || [],
                            years: parseInt(previewProfile.profile?.experience) || 2,
                            currentCompany: 'N/A',
                            currentRole: previewProfile.profile?.role || previewProfile.details?.role || 'Software Engineer',
                            availabilityDetails: previewProfile.profile?.availability || previewProfile.availability || 'Available'
                          }
                        };
                        setPreviewUid(null); // close preview first
                        onSubmitProfile(targetCandidate);
                      }}
                      className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/85 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-brand-blue/25"
                    >
                      <Sparkles className="w-4 h-4" /> Submit Profile
                    </button>
                  )}
                </div>

              </div>
            ) : (
              <div className="py-24 text-center">
                <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-3" />
                <p className="text-sm font-semibold">Candidate profile could not be loaded</p>
                <p className="text-xs text-app-muted mt-1">Please ensure the candidate profile exists in Firestore.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
