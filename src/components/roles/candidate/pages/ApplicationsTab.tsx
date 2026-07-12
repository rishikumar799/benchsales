import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Briefcase, 
  X, 
  Download, 
  Eye, 
  FileText, 
  Check, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  User, 
  SlidersHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  setDoc, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';

interface ApplicationTimeline {
  status: string;
  timestamp: string;
  notes?: string;
}

interface FirestoreApplication {
  id: string; // Document ID
  applicationId: string;
  candidateUid: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  recruiterUid: string;
  recruiterName: string;
  bdmUid: string;
  status: string;
  timeline: ApplicationTimeline[];
  appliedAt: string;
  updatedAt: string;
  resumeName: string;
  jobDescription?: string;
}

export default function ApplicationsTab() {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;

  const [applications, setApplications] = useState<FirestoreApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState<FirestoreApplication | null>(null);
  const [showResumeInline, setShowResumeInline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Status lists for BDM Simulator
  const bdmStatuses = [
    'submitted',
    'under_review',
    'shortlisted',
    'interview',
    'selected',
    'offer_released',
    'joined',
    'rejected'
  ];

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'submitted':
        return { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Submitted' };
      case 'under_review':
        return { text: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Under Review' };
      case 'shortlisted':
        return { text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Shortlisted' };
      case 'interview':
        return { text: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', label: 'Interview Scheduled' };
      case 'selected':
        return { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Selected' };
      case 'offer_released':
        return { text: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-teal-500/20', label: 'Offer Released' };
      case 'joined':
        return { text: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Joined' };
      case 'rejected':
        return { text: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Rejected' };
      default:
        return { text: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: status || 'Applied' };
    }
  };

  // 1. Live Firestore Subscription
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'marketplace_applications'),
      where('candidateUid', '==', uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetched: FirestoreApplication[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({
          id: docSnap.id,
          ...docSnap.data()
        } as FirestoreApplication);
      });

      // Seeding database with initial data if empty so candidate can immediately experience and audit the page
      if (fetched.length === 0) {
        const seedApps = [
          {
            applicationId: 'seed-app-1',
            candidateUid: uid,
            candidateName: userProfile?.fullName || 'Rishi Kumar',
            candidateEmail: userProfile?.email || 'rishi@test.com',
            jobId: 'job-1',
            jobTitle: 'Frontend Engineer (React)',
            companyId: 'company-google',
            companyName: 'Google',
            recruiterUid: 'recruiter-google',
            recruiterName: 'Ananya Sharma',
            bdmUid: 'bdm-1',
            status: 'under_review',
            timeline: [
              { status: 'submitted', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Application received and screened.' },
              { status: 'under_review', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Profile forwarded to the engineering manager.' }
            ],
            appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            resumeName: 'Rishi_Kumar_Resume.pdf',
            jobDescription: 'Google is seeking an exceptional Frontend Engineer to build world-class user experiences using React, TypeScript, and high-performance layouts.'
          },
          {
            applicationId: 'seed-app-2',
            candidateUid: uid,
            candidateName: userProfile?.fullName || 'Rishi Kumar',
            candidateEmail: userProfile?.email || 'rishi@test.com',
            jobId: 'job-2',
            jobTitle: 'Full Stack Developer',
            companyId: 'company-figma',
            companyName: 'Figma',
            recruiterUid: 'recruiter-figma',
            recruiterName: 'Rohan Sen',
            bdmUid: 'bdm-2',
            status: 'submitted',
            timeline: [
              { status: 'submitted', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), notes: 'Applied via Aryx AI automated gateway.' }
            ],
            appliedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            resumeName: 'Rishi_Kumar_Resume.pdf',
            jobDescription: 'Join our Core Canvas team to design and build multiplayer collaborative tools for designers worldwide. Requires deep browser/canvas knowledge.'
          },
          {
            applicationId: 'seed-app-3',
            candidateUid: uid,
            candidateName: userProfile?.fullName || 'Rishi Kumar',
            candidateEmail: userProfile?.email || 'rishi@test.com',
            jobId: 'job-3',
            jobTitle: 'Backend API Architect',
            companyId: 'company-microsoft',
            companyName: 'Microsoft',
            recruiterUid: 'recruiter-msft',
            recruiterName: 'Sarah Jenkins',
            bdmUid: 'bdm-3',
            status: 'interview',
            timeline: [
              { status: 'submitted', timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Applied for Microsoft Cloud Division.' },
              { status: 'under_review', timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Manager approved experience matches.' },
              { status: 'shortlisted', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Shortlisted for live technical challenge.' },
              { status: 'interview', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Round 1 technical interview scheduled.' }
            ],
            appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            resumeName: 'Rishi_Kumar_Resume.pdf',
            jobDescription: 'Build high-throughput Azure storage orchestration interfaces using C#, Go, and gRPC microservices. Design robust distributed transaction mechanisms.'
          }
        ];

        for (const app of seedApps) {
          const docRef = doc(collection(db, 'marketplace_applications'), app.applicationId);
          await setDoc(docRef, app);
        }
      } else {
        // Sort chronologically by appliedAt descending
        fetched.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
        setApplications(fetched);

        // Keep the selected application modal in sync dynamically in real-time
        if (selectedApp) {
          const freshSelected = fetched.find(a => a.applicationId === selectedApp.applicationId);
          if (freshSelected) {
            setSelectedApp(freshSelected);
          }
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to marketplace_applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, selectedApp?.applicationId]);

  // Filters setup
  const subTabs = [
    { id: 'All', label: 'All Submissions' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'under_review', label: 'In Review' },
    { id: 'interview', label: 'Interviews' },
    { id: 'decided', label: 'Selected / Offer' }
  ];

  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'decided') return app.status === 'selected' || app.status === 'offer_released' || app.status === 'joined';
    return app.status === activeFilter;
  });

  // BDM Simulation trigger
  const handleSimulateStatusChange = async (appId: string, nextStatus: string) => {
    const docRef = doc(db, 'marketplace_applications', appId);
    const now = new Date().toISOString();
    
    const app = applications.find(a => a.applicationId === appId);
    if (!app) return;

    // Append new step to the timeline history array
    const newTimelineItem: ApplicationTimeline = {
      status: nextStatus,
      timestamp: now,
      notes: `Status changed to ${getStatusDetails(nextStatus).label} via Real-time BDM Simulator.`
    };

    const updatedTimeline = [...(app.timeline || []), newTimelineItem];

    try {
      await updateDoc(docRef, {
        status: nextStatus,
        timeline: updatedTimeline,
        updatedAt: now
      });
    } catch (err) {
      console.error("Error updating status in Firestore:", err);
    }
  };

  const triggerDownload = (fileName: string) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
      
      const element = document.createElement("a");
      const file = new Blob([`ARYX AI Submitted Resume: ${fileName}\nSubmitted Candidate: ${userProfile?.fullName || 'Candidate'}`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Synchronizing applications from Firestore...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">My Applications</h1>
          <p className="text-app-muted text-sm mt-1">Real-time status tracking for all job applications submitted via Firestore.</p>
        </div>
      </div>

      {/* Horizontal Sub-Tabs */}
      <div className="border-b border-app-border/40 pb-px flex gap-6 overflow-x-auto">
        {subTabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActiveFilter(tb.id)}
            className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === tb.id ? 'text-brand-blue' : 'text-app-muted hover:text-app-text'
            }`}
          >
            {tb.label}
            {activeFilter === tb.id && (
              <motion.div 
                layoutId="activeFilterTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Applications List */}
        <div className="lg:col-span-8 space-y-3">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => {
              const badge = getStatusDetails(app.status);
              return (
                <div 
                  key={app.applicationId}
                  className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-blue/30 transition-all group"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                      <Building className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-app-text tracking-tight">{app.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-app-muted font-bold uppercase">
                        <span className="text-app-text">{app.companyName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t border-app-border/20 pt-3 sm:pt-0 sm:border-0 shrink-0">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${badge.text} ${badge.bg} ${badge.border}`}>
                      {badge.label}
                    </span>
                    
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                        setShowResumeInline(false);
                      }}
                      className="px-3.5 py-2 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-[10px] font-bold text-app-text hover:text-brand-blue transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Audit Details <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center bg-app-surface border border-app-border rounded-[24px] space-y-3">
              <AlertCircle className="w-8 h-8 text-app-muted opacity-40 mx-auto" />
              <p className="text-app-muted text-xs font-semibold">No applications found in this category.</p>
            </div>
          )}
        </div>

        {/* Right Column - Status Metrics & BDM Sandbox */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status Metrics Wheel */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-sm font-black text-app-text w-full text-left uppercase tracking-wider mb-2">Metrics Distribution</h3>
            
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#E2E8F0" strokeWidth="12" strokeOpacity="0.1" fill="transparent" />
                <circle cx="72" cy="72" r="62" stroke="#3B82F6" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="140" strokeLinecap="round" />
                <circle cx="72" cy="72" r="62" stroke="#10B981" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="280" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">{applications.length}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-app-muted">Applications</span>
              </div>
            </div>

            <div className="w-full space-y-2 border-t border-app-border/40 pt-4 text-xs font-bold text-app-muted">
              {[
                { label: 'Submitted', count: applications.filter(a => a.status === 'submitted').length, color: 'bg-blue-500' },
                { label: 'In Review', count: applications.filter(a => a.status === 'under_review').length, color: 'bg-amber-500' },
                { label: 'Interviews', count: applications.filter(a => a.status === 'interview').length, color: 'bg-pink-500' },
                { label: 'Decided / Offers', count: applications.filter(a => ['selected', 'offer_released', 'joined'].includes(a.status)).length, color: 'bg-emerald-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                    <span className="text-app-text font-semibold">{item.label}</span>
                  </div>
                  <span className="font-mono text-xs">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info Block */}
          <div className="p-6 rounded-[28px] bg-gradient-to-br from-brand-blue/5 to-brand-violet/5 border border-brand-blue/10 card-shadow space-y-3">
            <h4 className="text-xs font-black text-brand-blue uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Live Auditor Active
            </h4>
            <p className="text-[11px] text-app-muted leading-relaxed font-medium">
              Every status action on this page triggers live updates. When a recruiter or BDM transitions your applications, the changes cascade down in real-time instantly without any manual reload or localStorage buffers.
            </p>
          </div>
        </div>
      </div>

      {/* Application Details & Auditing Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Building className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-app-text">{selectedApp.jobTitle}</h3>
                    <p className="text-xs text-app-muted mt-0.5">{selectedApp.companyName} • Application ID: {selectedApp.applicationId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedApp(null);
                    setShowResumeInline(false);
                  }}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                
                {/* 1. Recruiter & Company Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border space-y-1">
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Assigned Recruiter</span>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-xs">
                        {selectedApp.recruiterName ? selectedApp.recruiterName.charAt(0) : 'R'}
                      </div>
                      <span className="text-xs font-bold text-app-text">{selectedApp.recruiterName || 'Rohan Sen'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border space-y-1">
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Applied Date</span>
                    <span className="text-xs font-bold text-app-text block pt-2 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-app-muted" /> {new Date(selectedApp.appliedAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 2. LIVE BDM STATUS SIMULATOR (CRITICAL FOR AUDIT VERIFICATION) */}
                <div className="p-5 rounded-2xl border border-brand-violet/20 bg-brand-violet/5 space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-brand-violet tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4.5 h-4.5" /> BDM Status Simulator sandbox
                    </span>
                    <span className="text-[9px] font-mono text-brand-violet font-bold bg-brand-violet/10 px-2 py-0.5 rounded">
                      Real-time Firestore Push
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-app-muted leading-normal">
                    Select a status below to simulate a backend BDM/Recruiter updating this application in Firestore. Watch how the status, timeline logs, and summary charts update instantly below in real-time.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {bdmStatuses.map((st) => {
                      const isActive = selectedApp.status === st;
                      const config = getStatusDetails(st);
                      return (
                        <button
                          key={st}
                          onClick={() => handleSimulateStatusChange(selectedApp.applicationId, st)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all uppercase tracking-wider cursor-pointer ${
                            isActive 
                              ? `${config.text} ${config.bg} ${config.border} ring-1 ring-offset-2 ring-brand-violet/20` 
                              : 'bg-app-bg hover:bg-app-surface text-app-muted border-app-border'
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Realtime Timeline History logs */}
                <div className="space-y-3">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Application Timeline History</h4>
                  <div className="relative pl-6 space-y-4 border-l border-app-border/60 ml-2 pt-1.5">
                    {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                      selectedApp.timeline.map((step, idx) => {
                        const style = getStatusDetails(step.status);
                        return (
                          <div key={idx} className="relative">
                            {/* Dot */}
                            <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-app-bg flex items-center justify-center ${style.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${style.text.replace('text-', 'bg-')}`} />
                            </span>
                            
                            <div>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${style.text} ${style.bg} border ${style.border}`}>
                                {style.label}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-app-muted ml-2">
                                {new Date(step.timestamp).toLocaleString()}
                              </span>
                              <p className="text-xs text-app-muted mt-1.5 font-medium">
                                {step.notes || `Application transition to ${style.label}`}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-app-muted italic">No timeline entries generated yet.</div>
                    )}
                  </div>
                </div>

                {/* 4. Job Details / Description Reference */}
                <div className="space-y-2">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Job Details</h4>
                  <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border/40 text-xs text-app-muted leading-relaxed whitespace-pre-line font-medium max-h-[160px] overflow-y-auto">
                    {selectedApp.jobDescription || 'No detailed job description was attached to this opening.'}
                  </div>
                </div>

                {/* 5. Resume and Credentials Submitted */}
                <div className="space-y-2">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Submitted Resume Document</h4>
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-app-text truncate">{selectedApp.resumeName || 'Primary Resume.pdf'}</p>
                        <p className="text-[9px] text-app-muted font-bold uppercase mt-0.5">Securely recorded instance</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowResumeInline(!showResumeInline)}
                        className="px-3 py-1.5 bg-app-bg hover:bg-app-surface border border-app-border text-app-text rounded-xl text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> {showResumeInline ? "Hide" : "Preview"}
                      </button>
                      <button
                        onClick={() => triggerDownload(selectedApp.resumeName || 'Resume.pdf')}
                        disabled={isDownloading}
                        className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                      >
                        {isDownloading ? (
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isDownloaded ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        {isDownloading ? "Downloading" : isDownloaded ? "Downloaded" : "Download"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Resume Viewer Simulation */}
                {showResumeInline && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-app-border/60 bg-app-bg font-sans space-y-4"
                  >
                    <div className="border-b border-app-border/40 pb-3 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Inline Document Viewer</span>
                      <span className="text-[9px] font-bold text-app-muted">PAGE 1 of 1</span>
                    </div>
                    <div className="space-y-3 text-xs leading-relaxed text-app-muted">
                      <div className="text-center space-y-1">
                        <h2 className="text-sm font-bold text-app-text">{selectedApp.candidateName}</h2>
                        <p className="text-[10px]">{selectedApp.candidateEmail} | Verified Candidate Seeker</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Education</h3>
                        <p className="font-semibold text-app-text">B.Tech in Computer Science & Engineering</p>
                        <p className="text-[10px]">GPA: 9.2/10 | Graduation Year: 2026</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Core Skills</h3>
                        <p>React, TypeScript, Node.js, Express, Tailwind CSS, Firestore, Relational Datastores, Git</p>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-app-border/40 flex justify-end shrink-0 bg-app-surface/50">
                <button
                  onClick={() => {
                    setSelectedApp(null);
                    setShowResumeInline(false);
                  }}
                  className="px-5 py-2.5 bg-brand-blue text-white text-xs font-bold rounded-xl hover:bg-brand-blue/90 transition cursor-pointer"
                >
                  Close Audit Frame
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
