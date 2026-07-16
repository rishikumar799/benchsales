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
  ArrowUpRight,
  Calendar,
  DollarSign,
  MapPin,
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useJobSeeker } from '../../../../context/JobSeekerContext';

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
  candidateEmail: string;
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
  recruiterRemarks?: string;
  recruiterNotes?: string;
  bdmRemarks?: string;
  bdmNotes?: string;
  interviewSchedule?: {
    date?: string;
    time?: string;
    link?: string;
    instructions?: string;
    location?: string;
    format?: string;
    [key: string]: any;
  } | string;
  offerDetails?: {
    salary?: string;
    baseSalary?: string;
    compensation?: string;
    equity?: string;
    benefits?: string;
    joiningDate?: string;
    offerLetterUrl?: string;
    notes?: string;
    [key: string]: any;
  } | string;
}

const ITEMS_PER_PAGE = 5;

export default function ApplicationsTab() {
  const { user, userProfile } = useAuth();
  const { jobSeekerProfile } = useJobSeeker();
  const uid = user?.uid || userProfile?.uid || jobSeekerProfile?.profile?.uid;

  const [applications, setApplications] = useState<FirestoreApplication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('applied_newest');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // Drawer / Detail modal
  const [selectedApp, setSelectedApp] = useState<FirestoreApplication | null>(null);
  const [showResumeInline, setShowResumeInline] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Status visual mapping
  const getStatusDetails = (status: string) => {
    const s = status ? status.toLowerCase() : '';
    switch (s) {
      case 'applied':
      case 'submitted':
        return { 
          text: 'text-blue-500', 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-500/20', 
          label: 'Applied',
          color: '#3B82F6'
        };
      case 'under_review':
      case 'review':
        return { 
          text: 'text-amber-500', 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/20', 
          label: 'Under Review',
          color: '#F59E0B'
        };
      case 'shortlisted':
        return { 
          text: 'text-purple-500', 
          bg: 'bg-purple-500/10', 
          border: 'border-purple-500/20', 
          label: 'Shortlisted',
          color: '#8B5CF6'
        };
      case 'interview':
      case 'interview scheduled':
      case 'interview_scheduled':
        return { 
          text: 'text-pink-500', 
          bg: 'bg-pink-500/10', 
          border: 'border-pink-500/20', 
          label: 'Interview Scheduled',
          color: '#EC4899'
        };
      case 'interview_completed':
      case 'interview completed':
        return { 
          text: 'text-indigo-500', 
          bg: 'bg-indigo-500/10', 
          border: 'border-indigo-500/20', 
          label: 'Interview Completed',
          color: '#6366F1'
        };
      case 'offer_released':
      case 'offer_extended':
      case 'selected':
      case 'offer extended':
        return { 
          text: 'text-emerald-500', 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/20', 
          label: 'Offer Extended',
          color: '#10B981'
        };
      case 'joined':
        return { 
          text: 'text-green-500', 
          bg: 'bg-green-500/10', 
          border: 'border-green-500/20', 
          label: 'Joined',
          color: '#22C55E'
        };
      case 'rejected':
        return { 
          text: 'text-rose-500', 
          bg: 'bg-rose-500/10', 
          border: 'border-rose-500/20', 
          label: 'Rejected',
          color: '#EF4444'
        };
      case 'withdrawn':
        return { 
          text: 'text-slate-500', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20', 
          label: 'Withdrawn',
          color: '#64748B'
        };
      default:
        return { 
          text: 'text-slate-500', 
          bg: 'bg-slate-500/10', 
          border: 'border-slate-500/20', 
          label: status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Applied',
          color: '#64748B'
        };
    }
  };

  // Subscribe to real-time applications where candidateUid == uid
  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'marketplace_applications'),
      where('candidateUid', '==', uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: FirestoreApplication[] = [];
      snapshot.forEach((docSnap) => {
        fetched.push({
          id: docSnap.id,
          ...docSnap.data()
        } as FirestoreApplication);
      });
      
      setApplications(fetched);
      setLoading(false);

      // Keep active detailed drawer in sync dynamically
      if (selectedApp) {
        const freshSelected = fetched.find(a => a.applicationId === selectedApp.applicationId);
        if (freshSelected) {
          setSelectedApp(freshSelected);
        }
      }
    }, (error) => {
      console.error("Error subscribing to candidate applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [uid, selectedApp?.applicationId]);

  // Reset pagination to first page when search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, sortBy]);

  // Statistics counters (updates instantly in real-time)
  const statsTotal = applications.length;
  const statsInterviews = applications.filter(a => ['interview', 'interview_scheduled', 'interview_completed', 'interview scheduled', 'interview completed'].includes(a.status?.toLowerCase())).length;
  const statsOffers = applications.filter(a => ['selected', 'offer_released', 'offer_extended', 'joined', 'offer extended', 'offer_released'].includes(a.status?.toLowerCase())).length;
  const statsRejected = applications.filter(a => a.status?.toLowerCase() === 'rejected').length;

  // Filter categories
  const subTabs = [
    { id: 'All', label: 'All Submissions' },
    { id: 'applied', label: 'Applied' },
    { id: 'under_review', label: 'In Review' },
    { id: 'interview', label: 'Interviews' },
    { id: 'offer', label: 'Offers' },
    { id: 'rejected', label: 'Rejected' },
    { id: 'withdrawn', label: 'Withdrawn' }
  ];

  // Filter application list
  const filteredApps = applications.filter((app) => {
    // 1. Tab Filter
    const s = app.status ? app.status.toLowerCase() : '';
    if (activeFilter !== 'All') {
      if (activeFilter === 'applied') {
        if (s !== 'submitted' && s !== 'applied') return false;
      } else if (activeFilter === 'under_review') {
        if (s !== 'under_review' && s !== 'review' && s !== 'shortlisted') return false;
      } else if (activeFilter === 'interview') {
        if (!['interview', 'interview_scheduled', 'interview_completed', 'interview scheduled', 'interview completed'].includes(s)) return false;
      } else if (activeFilter === 'offer') {
        if (!['selected', 'offer_released', 'offer_extended', 'joined', 'offer extended', 'offer_released'].includes(s)) return false;
      } else if (activeFilter === 'rejected') {
        if (s !== 'rejected') return false;
      } else if (activeFilter === 'withdrawn') {
        if (s !== 'withdrawn') return false;
      }
    }

    // 2. Search query matching
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const titleMatch = app.jobTitle ? app.jobTitle.toLowerCase().includes(q) : false;
      const companyMatch = app.companyName ? app.companyName.toLowerCase().includes(q) : false;
      const recruiterMatch = app.recruiterName ? app.recruiterName.toLowerCase().includes(q) : false;
      const descMatch = app.jobDescription ? app.jobDescription.toLowerCase().includes(q) : false;
      
      const rNotes = app.recruiterRemarks || app.recruiterNotes || '';
      const notesMatch = rNotes.toLowerCase().includes(q);

      const bNotes = app.bdmRemarks || app.bdmNotes || '';
      const bdmMatch = bNotes.toLowerCase().includes(q);

      return titleMatch || companyMatch || recruiterMatch || descMatch || notesMatch || bdmMatch;
    }

    return true;
  });

  // Sort application list
  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'applied_newest':
        return new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime();
      case 'applied_oldest':
        return new Date(a.appliedAt || 0).getTime() - new Date(b.appliedAt || 0).getTime();
      case 'updated_newest':
        return new Date(b.updatedAt || b.appliedAt || 0).getTime() - new Date(a.updatedAt || a.appliedAt || 0).getTime();
      case 'job_az':
        return (a.jobTitle || '').localeCompare(b.jobTitle || '');
      case 'company_az':
        return (a.companyName || '').localeCompare(b.companyName || '');
      default:
        return new Date(b.appliedAt || 0).getTime() - new Date(a.appliedAt || 0).getTime();
    }
  });

  // Pagination bounds
  const totalItems = sortedApps.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedApps = sortedApps.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const triggerDownload = (fileName: string) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
      
      const element = document.createElement("a");
      const file = new Blob([
        `ARYX AI Secure Candidate Document\nCandidate Name: ${userProfile?.fullName || jobSeekerProfile?.profile?.fullName || 'Candidate'}\nEmail: ${userProfile?.email || jobSeekerProfile?.profile?.email || 'rishi@test.com'}\nResume Reference: ${fileName}`
      ], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  // Helper renderers for drawers
  const renderInterviewSchedule = (interview: any) => {
    if (!interview) return null;
    if (typeof interview === 'string') {
      return (
        <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-pink-500" />
            <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider">Interview Schedule</span>
          </div>
          <p className="text-xs font-bold text-app-text leading-relaxed pl-6">{interview}</p>
        </div>
      );
    }
    
    const { date, time, link, instructions, location, format } = interview;
    if (!date && !time && !link && !instructions && !location) return null;
    
    return (
      <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4.5 h-4.5 text-pink-500" />
            <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider">Interview Details</span>
          </div>
          {format && (
            <span className="text-[9px] font-black uppercase bg-pink-500/10 text-pink-500 px-2 py-0.5 rounded">
              {format}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs pl-6">
          {date && (
            <div>
              <span className="text-[9px] font-bold text-app-muted uppercase block">Date</span>
              <span className="font-extrabold text-app-text">{date}</span>
            </div>
          )}
          {time && (
            <div>
              <span className="text-[9px] font-bold text-app-muted uppercase block">Time</span>
              <span className="font-extrabold text-app-text">{time}</span>
            </div>
          )}
          {location && (
            <div className="col-span-2">
              <span className="text-[9px] font-bold text-app-muted uppercase block">Location / Platform</span>
              <span className="font-extrabold text-app-text">{location}</span>
            </div>
          )}
        </div>
        {link && (
          <div className="pl-6 pt-1.5 border-t border-pink-500/5">
            <span className="text-[9px] font-bold text-app-muted uppercase block">Meeting Join URL</span>
            <a 
              href={link} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-brand-blue font-extrabold hover:underline flex items-center gap-1.5 mt-1"
            >
              Join Session <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
        {instructions && (
          <div className="pl-6 pt-2 border-t border-pink-500/10">
            <span className="text-[9px] font-bold text-app-muted uppercase block">Preparation instructions</span>
            <p className="text-xs text-app-muted mt-1 leading-relaxed font-medium whitespace-pre-line">{instructions}</p>
          </div>
        )}
      </div>
    );
  };

  const renderOfferDetails = (offer: any) => {
    if (!offer) return null;
    if (typeof offer === 'string') {
      return (
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Offer Details</span>
          </div>
          <p className="text-xs font-bold text-app-text pl-6">{offer}</p>
        </div>
      );
    }

    const { salary, baseSalary, compensation, equity, benefits, joiningDate, offerLetterUrl, notes } = offer;
    const showSalary = salary || baseSalary || compensation;
    
    if (!showSalary && !equity && !benefits && !joiningDate && !offerLetterUrl) return null;

    return (
      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Proposal & Compensation</span>
          </div>
          <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">
            Official Offer
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pl-6">
          {showSalary && (
            <div>
              <span className="text-[9px] font-bold text-app-muted uppercase block">Salary Package</span>
              <span className="font-extrabold text-app-text">{showSalary}</span>
            </div>
          )}
          {joiningDate && (
            <div>
              <span className="text-[9px] font-bold text-app-muted uppercase block">Joining Date</span>
              <span className="font-extrabold text-app-text">{joiningDate}</span>
            </div>
          )}
          {equity && (
            <div>
              <span className="text-[9px] font-bold text-app-muted uppercase block">Equity Options</span>
              <span className="font-extrabold text-app-text">{equity}</span>
            </div>
          )}
          {benefits && (
            <div className="col-span-1 sm:col-span-2">
              <span className="text-[9px] font-bold text-app-muted uppercase block">Standard Benefits</span>
              <p className="text-xs text-app-muted mt-0.5 font-semibold whitespace-pre-line leading-relaxed">{benefits}</p>
            </div>
          )}
        </div>
        {offerLetterUrl && (
          <div className="pl-6 pt-2 border-t border-emerald-500/10">
            <a 
              href={offerLetterUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-brand-blue font-extrabold hover:underline flex items-center gap-1.5"
            >
              Download Signed Letter of Offer <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
        {notes && (
          <div className="pl-6 pt-2 border-t border-emerald-500/10">
            <span className="text-[9px] font-bold text-app-muted uppercase block">Additional proposal notes</span>
            <p className="text-xs text-app-muted mt-1 leading-relaxed font-medium whitespace-pre-line">{notes}</p>
          </div>
        )}
      </div>
    );
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">My Applications</h1>
          <p className="text-app-muted text-sm mt-1">Real-time tracking for all roles you applied to across ARYX AI ecosystem.</p>
        </div>
      </div>

      {/* Real-time Status Counter Row (Dashboard Integration) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wider block">Total Applied</span>
            <span className="text-2xl font-display font-black text-app-text block mt-1">{statsTotal}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wider block">Interviews</span>
            <span className="text-2xl font-display font-black text-app-text block mt-1">{statsInterviews}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wider block">Offers Released</span>
            <span className="text-2xl font-display font-black text-app-text block mt-1">{statsOffers}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wider block">Unsuccessful</span>
            <span className="text-2xl font-display font-black text-app-text block mt-1">{statsRejected}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
            <X className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Advanced Filter, Search, and Sort Panel */}
      <div className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-app-muted" />
          <input
            type="text"
            placeholder="Search by job role, company name, recruiter, or internal notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all text-app-text placeholder:text-app-muted/80"
          />
        </div>

        {/* Sort option and horizontal filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div className="flex border-b border-app-border/40 pb-px gap-4 overflow-x-auto shrink-0 max-w-full">
            {subTabs.map((tb) => {
              const isActive = activeFilter === tb.id;
              return (
                <button
                  key={tb.id}
                  onClick={() => setActiveFilter(tb.id)}
                  className={`pb-2.5 text-[10px] font-bold uppercase tracking-widest relative transition-all whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-brand-blue font-black' : 'text-app-muted hover:text-app-text'
                  }`}
                >
                  {tb.label}
                  {isActive && (
                    <motion.div 
                      layoutId="subTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-app-muted" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-app-bg border border-app-border rounded-lg py-1.5 px-3 text-[10px] font-bold text-app-text focus:outline-none cursor-pointer"
            >
              <option value="applied_newest">Applied: Newest First</option>
              <option value="applied_oldest">Applied: Oldest First</option>
              <option value="updated_newest">Last Active Update</option>
              <option value="job_az">Job Role: A-Z</option>
              <option value="company_az">Company: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 gap-4">
        {paginatedApps.length > 0 ? (
          <div className="space-y-3">
            {paginatedApps.map((app) => {
              const badge = getStatusDetails(app.status);
              return (
                <motion.div 
                  key={app.applicationId}
                  layoutId={`app-card-${app.applicationId}`}
                  className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-blue/30 transition-all group relative overflow-hidden"
                >
                  {/* Subtle decorative color highlight based on status */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1" 
                    style={{ backgroundColor: badge.color }}
                  />

                  <div className="flex items-start md:items-center gap-4 pl-1">
                    <div className="w-11 h-11 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                      <Building className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-app-text tracking-tight group-hover:text-brand-blue transition-colors">
                        {app.jobTitle}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-app-muted font-black uppercase tracking-wider">
                        <span className="text-app-text font-black">{app.companyName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                        {app.recruiterName && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-brand-violet">
                              <User className="w-3 h-3" /> Recruiter: {app.recruiterName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 border-t border-app-border/20 pt-3 md:pt-0 md:border-0 shrink-0">
                    <span 
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${badge.text} ${badge.bg} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                    
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                        setShowResumeInline(false);
                      }}
                      className="px-3.5 py-2 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-[10px] font-bold text-app-text hover:text-brand-blue transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Audit & Tracking <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {/* Pagination Panel */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-app-surface border border-app-border rounded-2xl mt-4">
                <span className="text-xs font-semibold text-app-muted font-mono">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} items
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-app-bg hover:bg-app-surface disabled:opacity-40 disabled:cursor-not-allowed border border-app-border rounded-xl text-xs font-bold text-app-text transition cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <span className="px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-xs font-bold text-brand-blue font-mono">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-app-bg hover:bg-app-surface disabled:opacity-40 disabled:cursor-not-allowed border border-app-border rounded-xl text-xs font-bold text-app-text transition cursor-pointer flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-16 text-center bg-app-surface border border-app-border rounded-[24px] space-y-4">
            <AlertCircle className="w-10 h-10 text-app-muted/60 mx-auto" />
            <div>
              <p className="text-app-text text-sm font-bold">No Applications Found</p>
              <p className="text-app-muted text-xs font-semibold mt-1 max-w-md mx-auto leading-relaxed">
                {searchQuery.trim() !== '' 
                  ? "We couldn't find any submissions matching your search term. Try resetting the filters or modifying your query."
                  : "You haven't submitted any job applications yet. Go to the Browse Jobs catalog to explore matching roles and apply instantly."}
              </p>
            </div>
            {searchQuery.trim() !== '' && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} 
                className="text-xs font-extrabold text-brand-blue underline cursor-pointer"
              >
                Clear active search filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* High-End Application Details Sliding Overlay Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedApp(null);
                setShowResumeInline(false);
              }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Sliding Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="relative w-full max-w-xl bg-app-bg border-l border-app-border h-full shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                    <Building className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-app-text tracking-tight">{selectedApp.jobTitle}</h3>
                    <p className="text-[10px] text-app-muted font-bold uppercase mt-0.5 tracking-wider">
                      {selectedApp.companyName} • ID: {selectedApp.applicationId}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedApp(null);
                    setShowResumeInline(false);
                  }}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Drawer Body Contents (Scrollable) */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                {/* Visual Status Highlight */}
                <div className="p-4 rounded-2xl bg-app-surface border border-app-border flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-black uppercase text-app-muted tracking-widest block">Current Application Status</span>
                    <span className="text-sm font-extrabold text-app-text mt-1 block">
                      {getStatusDetails(selectedApp.status).label}
                    </span>
                  </div>
                  <span 
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg border ${getStatusDetails(selectedApp.status).text} ${getStatusDetails(selectedApp.status).bg} ${getStatusDetails(selectedApp.status).border}`}
                  >
                    {getStatusDetails(selectedApp.status).label}
                  </span>
                </div>

                {/* Recruiter Details Panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border space-y-1">
                    <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider block">Assigned Recruiter</span>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-7 h-7 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center font-black text-xs shrink-0">
                        {selectedApp.recruiterName ? selectedApp.recruiterName.charAt(0) : 'R'}
                      </div>
                      <span className="text-xs font-extrabold text-app-text truncate">
                        {selectedApp.recruiterName || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border space-y-1">
                    <span className="text-[9px] font-bold text-app-muted uppercase tracking-wider block">Date Applied</span>
                    <span className="text-xs font-extrabold text-app-text block pt-2 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-app-muted" /> {new Date(selectedApp.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Interview Details (Dynamic Conditional UI) */}
                {renderInterviewSchedule(selectedApp.interviewSchedule)}

                {/* Offer Details Proposal (Dynamic Conditional UI) */}
                {renderOfferDetails(selectedApp.offerDetails)}

                {/* Recruiter Remarks */}
                <div className="space-y-2">
                  <h4 className="font-black text-app-text text-[10px] uppercase tracking-widest">Recruiter Feedback & Remarks</h4>
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border text-xs leading-relaxed font-semibold">
                    {(selectedApp.recruiterRemarks || selectedApp.recruiterNotes) ? (
                      <p className="text-app-text whitespace-pre-line">
                        {selectedApp.recruiterRemarks || selectedApp.recruiterNotes}
                      </p>
                    ) : (
                      <p className="text-app-muted italic">No specific remarks added by the recruiter yet.</p>
                    )}
                  </div>
                </div>

                {/* BDM Remarks (Read Only) */}
                <div className="space-y-2">
                  <h4 className="font-black text-app-text text-[10px] uppercase tracking-widest">BDM Remarks (Read Only)</h4>
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border text-xs leading-relaxed font-semibold">
                    {(selectedApp.bdmRemarks || selectedApp.bdmNotes) ? (
                      <p className="text-app-text whitespace-pre-line">
                        {selectedApp.bdmRemarks || selectedApp.bdmNotes}
                      </p>
                    ) : (
                      <p className="text-app-muted italic">Pending evaluation notes from Business Development Manager.</p>
                    )}
                  </div>
                </div>

                {/* Status Progress Timeline */}
                <div className="space-y-3">
                  <h4 className="font-black text-app-text text-[10px] uppercase tracking-widest">Application Timeline Logs</h4>
                  <div className="relative pl-6 space-y-5 border-l border-app-border/60 ml-2 pt-1.5">
                    {selectedApp.timeline && selectedApp.timeline.length > 0 ? (
                      selectedApp.timeline.map((step, idx) => {
                        const style = getStatusDetails(step.status);
                        return (
                          <div key={idx} className="relative">
                            {/* Connector dot */}
                            <span 
                              className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-app-bg flex items-center justify-center`}
                              style={{ borderColor: style.color }}
                            >
                              <span 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: style.color }}
                              />
                            </span>
                            
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${style.text} ${style.bg} ${style.border}`}>
                                  {style.label}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-app-muted">
                                  {new Date(step.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-app-muted mt-1.5 font-bold leading-relaxed">
                                {step.notes || `State transition to ${style.label}`}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-app-muted italic">No historic events logged for this submission.</div>
                    )}
                  </div>
                </div>

                {/* Job Description Summary */}
                <div className="space-y-2">
                  <h4 className="font-black text-app-text text-[10px] uppercase tracking-widest">Job Description Reference</h4>
                  <div className="p-4 rounded-2xl bg-app-surface/40 border border-app-border/40 text-xs text-app-muted leading-relaxed whitespace-pre-line font-bold max-h-[150px] overflow-y-auto">
                    {selectedApp.jobDescription || 'No description available.'}
                  </div>
                </div>

                {/* Submitted Resume Document */}
                <div className="space-y-2">
                  <h4 className="font-black text-app-text text-[10px] uppercase tracking-widest">Credentials Submitted</h4>
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                        <FileText className="w-5.5 h-5.5" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-extrabold text-app-text truncate">{selectedApp.resumeName || 'Primary Resume.pdf'}</p>
                        <p className="text-[9px] text-app-muted font-bold uppercase mt-0.5">Securely logged in system</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
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

                {/* Inline Resume Viewer */}
                {showResumeInline && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border border-app-border/60 bg-app-bg font-sans space-y-4"
                  >
                    <div className="border-b border-app-border/40 pb-3 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase text-indigo-400 tracking-wider">Document Previewer</span>
                      <span className="text-[9px] font-bold text-app-muted font-mono">1 PAGE</span>
                    </div>
                    <div className="space-y-4 text-xs leading-relaxed text-app-muted">
                      <div className="text-center space-y-1">
                        <h2 className="text-sm font-extrabold text-app-text">
                          {selectedApp.candidateName || userProfile?.fullName || jobSeekerProfile?.profile?.fullName}
                        </h2>
                        <p className="text-[10px] font-semibold">
                          {selectedApp.candidateEmail || userProfile?.email || jobSeekerProfile?.profile?.email} | ARYX AI Seeker
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-app-text border-b border-app-border/30 pb-0.5 text-[10px] uppercase">Education</h3>
                        <p className="font-bold text-app-text">Computer Science & Information Technology</p>
                        <p className="text-[10px] font-semibold">First Class / Distinction Credentials</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-extrabold text-app-text border-b border-app-border/30 pb-0.5 text-[10px] uppercase">Core Skillset</h3>
                        <p className="font-medium">React, TypeScript, Frontend Orchestration, Tailwind CSS, Firestore DB, git</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Drawer Footer */}
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
