import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Bookmark, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  X,
  Upload,
  FileText,
  Clock,
  Building,
  Eye
} from 'lucide-react';

import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useJobSeeker } from '../../../../context/JobSeekerContext';
import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';

interface Job {
  id: string;
  role: string;
  company: string;
  logo: string;
  logoBg: string;
  posted: string;
  match: number;
  location: string;
  experience: string;
  salary: string;
  employmentType: string;
  openings: string | number;
  skills: string[];
  whyMatch: { skill: string; pct: number }[];
  missingSkills: { skill: string; gap: number }[];
  description: string;
  requirements: string;
  recruiterCount: number;
  submissionCount: number;
  createdAt: any;
  updatedAt: any;
  assignedRecruiters?: string[];
  createdBy?: string;
  companyId?: string;
  companyName?: string;
}

// Helper utilities for computing display-only elements cleanly
const getLogoBg = (company: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-600', 'bg-orange-500', 'bg-amber-600', 
    'bg-emerald-600', 'bg-violet-600', 'bg-indigo-600', 'bg-pink-600'
  ];
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getRelativeTime = (ts: any) => {
  if (!ts) return '1 day ago';
  let date: Date;
  if (typeof ts.toDate === 'function') {
    date = ts.toDate();
  } else if (ts.seconds) {
    date = new Date(ts.seconds * 1000);
  } else {
    date = new Date(ts);
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Just now';
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const getMatchScore = (jobId: string) => {
  let hash = 0;
  for (let i = 0; i < jobId.length; i++) {
    hash = jobId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return 85 + (Math.abs(hash) % 15);
};

const getWhyMatch = (skills: string[]) => {
  return skills.slice(0, 3).map((s, idx) => ({
    skill: s,
    pct: 95 - idx * 5
  }));
};

const getMissingSkills = (skills: string[]) => {
  const allPossible = ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'System Design'];
  return allPossible
    .filter(s => !skills.includes(s))
    .slice(0, 2)
    .map((s, idx) => ({
      skill: s,
      gap: 20 + idx * 10
    }));
};

const formatTimestamp = (ts: any) => {
  if (!ts) return 'N/A';
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleDateString();
  }
  if (ts.seconds) {
    return new Date(ts.seconds * 1000).toLocaleDateString();
  }
  return new Date(ts).toLocaleDateString();
};

export default function JobsTab() {
  const { userProfile } = useAuth();
  const { jobSeekerProfile, loading: profileLoading, profileCompletion, resumeCompletion } = useJobSeeker();
  const [jobs, setJobs] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Browse Jobs / Saved Jobs selection
  const [activeSubTab, setActiveSubTab] = useState<'browse' | 'saved'>('browse');

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedSalary, setSelectedSalary] = useState('All');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'newest' | 'salary' | 'experience'>('relevance');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [showResumeInlineDetails, setShowResumeInlineDetails] = useState(false);
  const [applyResumeOption, setApplyResumeOption] = useState<'existing' | 'upload'>('existing');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // Sync Resume Builder default name if present - Cloud-first, fallback-safe
  const existingResumeName = jobSeekerProfile?.resume?.uploadedResume?.name || "Primary Resume (from Resume Builder)";

  // Completeness Checks
  const isProfileIncomplete = profileCompletion < 30 || !jobSeekerProfile?.profile?.fullName || !jobSeekerProfile?.profile?.email;
  const isResumeIncomplete = resumeCompletion < 30 && !jobSeekerProfile?.resume?.uploadedResume?.name && !jobSeekerProfile?.resume?.personalInfo?.fullName;

  // Reset pagination to first page when any filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedLocation, selectedExperience, selectedSalary, selectedEmploymentType, sortBy, activeSubTab]);

  // 1. Subscribe to open jobs in real-time
  useEffect(() => {
    const qJobs = query(collection(db, 'marketplace_jobs'), where('status', '==', 'open'));
    const unsubscribeJobs = onSnapshot(qJobs, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setJobs(fetchedJobs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'marketplace_jobs');
      setLoading(false);
    });

    return () => unsubscribeJobs();
  }, []);

  // 2. Subscribe to candidate applications in real-time
  useEffect(() => {
    if (!userProfile?.uid) return;

    const qApps = query(
      collection(db, 'marketplace_applications'),
      where('candidateUid', '==', userProfile.uid)
    );
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      const fetchedApps = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setMyApplications(fetchedApps);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'marketplace_applications');
    });

    return () => unsubscribeApps();
  }, [userProfile?.uid]);

  const savedJobIds: string[] = jobSeekerProfile?.saved_jobs || [];
  const appliedJobIds: string[] = myApplications.map(app => app.jobId);

  const getAppliedResumeForJob = (jobId: string) => {
    const matchedApp = myApplications.find(app => app.jobId === jobId);
    return matchedApp?.resumeName || "Primary Resume (from Resume Builder)";
  };

  const toggleSave = async (id: string) => {
    if (!userProfile?.uid) return;
    let nextSaved: string[];
    if (savedJobIds.includes(id)) {
      nextSaved = savedJobIds.filter(jobId => jobId !== id);
    } else {
      nextSaved = [...savedJobIds, id];
    }
    
    try {
      const seekerRef = doc(db, 'marketplace_jobseekers', userProfile.uid);
      await setDoc(seekerRef, { saved_jobs: nextSaved }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${userProfile.uid}`);
    }
  };

  const handleApplyClick = (job: Job) => {
    if (appliedJobIds.includes(job.id)) {
      setSelectedJobForDetails(job);
    } else {
      setSelectedJobForApply(job);
    }
  };

  const handleFinalApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply || !userProfile?.uid) return;
    
    const resumeName = applyResumeOption === 'upload' 
      ? (uploadedFileName || "My_Uploaded_Resume.pdf")
      : existingResumeName;
      
    const jobId = selectedJobForApply.id;

    // Prevent duplicate applications
    const alreadyApplied = appliedJobIds.includes(jobId);
    if (alreadyApplied) {
      alert("You have already applied to this job.");
      setSelectedJobForApply(null);
      return;
    }

    try {
      const appCol = collection(db, 'marketplace_applications');
      const appDocRef = doc(appCol);
      const applicationId = appDocRef.id;

      const applicationData = {
        applicationId,
        candidateUid: userProfile.uid,
        candidateName: userProfile.fullName || userProfile.displayName || 'Anonymous Seeker',
        candidateEmail: userProfile.email || '',
        jobId,
        jobTitle: selectedJobForApply.role || (selectedJobForApply as any).title || '',
        companyId: selectedJobForApply.companyId || 'company-1',
        companyName: selectedJobForApply.company || selectedJobForApply.companyName || 'Unknown Company',
        recruiterUid: (selectedJobForApply.assignedRecruiters && selectedJobForApply.assignedRecruiters.length > 0)
          ? selectedJobForApply.assignedRecruiters[0]
          : 'recruiter-1',
        recruiterName: 'Rohan Sen',
        bdmUid: selectedJobForApply.createdBy || 'bdm-1',
        status: 'submitted',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resumeName,
        jobDescription: selectedJobForApply.description || 'No description available.',
        timeline: [
          { status: 'submitted', timestamp: new Date().toISOString(), notes: 'Application submitted successfully.' }
        ]
      };

      await setDoc(appDocRef, applicationData);

      setIsSubmitSuccess(true);
      
      setTimeout(() => {
        setIsSubmitSuccess(false);
        setSelectedJobForApply(null);
        setUploadedFileName('');
      }, 1500);

    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'marketplace_applications');
    }
  };

  // Map and filter jobs
  const mappedJobs: Job[] = jobs.map(job => {
    const company = job.companyName || job.company || job.client || 'Unknown Company';
    const role = job.title || job.role || 'Software Engineer';
    const skillsArray = typeof job.skills === 'string'
      ? job.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : (Array.isArray(job.skills) ? job.skills : []);

    return {
      ...job,
      id: job.id,
      role,
      company,
      logo: company.charAt(0).toUpperCase(),
      logoBg: getLogoBg(company),
      posted: getRelativeTime(job.createdAt),
      match: getMatchScore(job.id),
      location: job.location || 'Remote',
      experience: job.experience || '2-4 Yrs',
      salary: job.salary || '₹6 - 10 LPA',
      employmentType: job.employmentType || 'Full-time',
      openings: job.openings || '1 Position',
      skills: skillsArray,
      whyMatch: getWhyMatch(skillsArray),
      missingSkills: getMissingSkills(skillsArray),
      description: job.description || 'No description available.',
      requirements: job.requirements || job.responsibilities || 'No requirements available.',
      recruiterCount: job.recruiterCount || job.assignedRecruiters?.length || 0,
      submissionCount: job.submissionCount || job.submissionsCount || 0,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  });

  // Extract filters dynamically from mappedJobs
  const uniqueLocations = ['All', ...Array.from(new Set(mappedJobs.map(j => j.location).filter(Boolean)))];
  const uniqueExperiences = ['All', ...Array.from(new Set(mappedJobs.map(j => j.experience).filter(Boolean)))];
  const uniqueSalaries = ['All', ...Array.from(new Set(mappedJobs.map(j => j.salary).filter(Boolean)))];
  const uniqueEmploymentTypes = ['All', ...Array.from(new Set(mappedJobs.map(j => j.employmentType).filter(Boolean)))];

  // Primary filtering
  const filteredJobs = mappedJobs.filter(job => {
    // If active tab is "Saved Jobs", filter by saved ids first
    if (activeSubTab === 'saved' && !savedJobIds.includes(job.id)) {
      return false;
    }

    const matchesSearch = job.role.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
                          job.description.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    const matchesExperience = selectedExperience === 'All' || job.experience === selectedExperience;
    const matchesSalary = selectedSalary === 'All' || job.salary === selectedSalary;
    const matchesEmploymentType = selectedEmploymentType === 'All' || job.employmentType === selectedEmploymentType;

    return matchesSearch && matchesLocation && matchesExperience && matchesSalary && matchesEmploymentType;
  });

  // Sorting helper
  const sortJobs = (jobsList: Job[]) => {
    return [...jobsList].sort((a, b) => {
      if (sortBy === 'relevance') {
        return b.match - a.match;
      }
      if (sortBy === 'newest') {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      }
      if (sortBy === 'salary') {
        const parseSalary = (salStr: string) => {
          const matched = salStr.match(/(\d+)/g);
          if (matched && matched.length > 0) {
            return Math.max(...matched.map(Number));
          }
          return 0;
        };
        return parseSalary(b.salary) - parseSalary(a.salary);
      }
      if (sortBy === 'experience') {
        const parseExp = (expStr: string) => {
          const matched = expStr.match(/(\d+)/g);
          if (matched && matched.length > 0) {
            return Math.min(...matched.map(Number));
          }
          return 0;
        };
        return parseExp(a.experience) - parseExp(b.experience);
      }
      return 0;
    });
  };

  const sortedJobs = sortJobs(filteredJobs);

  // Pagination calculations
  const totalItems = sortedJobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const paginatedJobs = sortedJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Active selected job on the list for match insights
  useEffect(() => {
    if (paginatedJobs.length > 0) {
      const isStillInList = paginatedJobs.some(j => j.id === activeJobId);
      if (!isStillInList) {
        setActiveJobId(paginatedJobs[0].id);
      }
    } else {
      setActiveJobId(null);
    }
  }, [search, selectedLocation, selectedExperience, selectedSalary, selectedEmploymentType, sortBy, activeSubTab, currentPage]);

  const activeJob = paginatedJobs.find(j => j.id === activeJobId) || paginatedJobs[0];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-app-muted text-xs font-semibold">Syncing with Marketplace Jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Find Your Dream Job</h1>
          <p className="text-app-muted text-sm mt-1">Discover the best opportunities matching your skills and experience.</p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-app-border/40 gap-6">
        <button
          onClick={() => setActiveSubTab('browse')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'browse'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Browse Jobs ({mappedJobs.length})
        </button>
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'saved'
              ? 'border-brand-blue text-brand-blue font-extrabold'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Saved Jobs ({savedJobIds.length})
        </button>
      </div>

      {/* Advanced Filter, Search, and Sort Panel */}
      <div className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow space-y-4 animate-fadeIn">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-app-muted" />
          <input
            type="text"
            placeholder="Search by job title, skills, description or companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all text-app-text"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {/* Location Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wide block pl-1">Location</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-text focus:outline-none cursor-pointer"
            >
              <option value="All">All Locations</option>
              {uniqueLocations.filter(loc => loc !== 'All').map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wide block pl-1">Experience</span>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-text focus:outline-none cursor-pointer"
            >
              <option value="All">All Experiences</option>
              {uniqueExperiences.filter(exp => exp !== 'All').map((exp, idx) => (
                <option key={idx} value={exp}>{exp}</option>
              ))}
            </select>
          </div>

          {/* Employment Type Filter */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wide block pl-1">Job Type</span>
            <select
              value={selectedEmploymentType}
              onChange={(e) => setSelectedEmploymentType(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-text focus:outline-none cursor-pointer"
            >
              <option value="All">All Job Types</option>
              {uniqueEmploymentTypes.filter(et => et !== 'All').map((et, idx) => (
                <option key={idx} value={et}>{et}</option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-black uppercase text-app-muted tracking-wide block pl-1">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 px-3 text-xs font-bold text-app-text focus:outline-none cursor-pointer"
            >
              <option value="relevance">AI Match Score</option>
              <option value="newest">Newest First</option>
              <option value="salary">Highest Salary</option>
              <option value="experience">Least Experience Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main split display: left matches, right matching metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {paginatedJobs.length > 0 ? (
              paginatedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  onClick={() => setActiveJobId(job.id)}
                  className={`p-6 rounded-[24px] border transition-all cursor-pointer card-shadow flex flex-col justify-between gap-4 ${
                    activeJobId === job.id 
                      ? 'border-brand-blue bg-brand-blue/5' 
                      : 'border-app-border bg-app-surface hover:border-brand-blue/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl ${job.logoBg} flex items-center justify-center text-white font-display font-extrabold text-base shadow-sm shrink-0`}>
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-app-text">{job.role}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-app-muted">{job.company}</span>
                            <span className="text-app-muted/30">•</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedJobForDetails(job);
                              }}
                              className="text-[10px] font-extrabold text-brand-blue hover:underline tracking-tight cursor-pointer"
                            >
                              View Description
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-app-muted font-mono shrink-0">{job.posted}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-app-muted">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-blue" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-brand-blue" /> {job.experience}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-brand-blue" /> {job.salary}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-brand-blue" /> {job.employmentType}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {job.skills.map((sk, idx) => (
                        <span key={idx} className="bg-app-bg border border-app-border rounded-lg px-2.5 py-1 text-[10px] font-semibold text-app-text">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {/* Metadata block showing remaining required fields */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-app-muted font-semibold pt-3 border-t border-app-border/40">
                      <span>Openings: <strong className="text-app-text font-bold">{job.openings}</strong></span>
                      <span>•</span>
                      <span>Recruiters: <strong className="text-app-text font-bold">{job.recruiterCount}</strong></span>
                      <span>•</span>
                      <span>Submissions: <strong className="text-app-text font-bold">{job.submissionCount}</strong></span>
                      <span>•</span>
                      <span>Created: <strong className="text-app-text font-bold">{formatTimestamp(job.createdAt)}</strong></span>
                      <span>•</span>
                      <span>Updated: <strong className="text-app-text font-bold">{formatTimestamp(job.updatedAt)}</strong></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4 pt-4 border-t border-app-border/40">
                    <div>
                      <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">AI Match Index</span>
                      <span className="text-base font-display font-black text-brand-blue block">{job.match}% Match</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          savedJobIds.includes(job.id)
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            : 'bg-app-bg hover:bg-app-surface border-app-border text-app-muted hover:text-app-text'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current stroke-current" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(job);
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all uppercase tracking-wide min-w-[90px] cursor-pointer ${
                          appliedJobIds.includes(job.id)
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600 font-bold'
                            : 'bg-brand-blue text-white hover:bg-brand-blue/90 font-bold shadow-lg shadow-brand-blue/15'
                        }`}
                      >
                        {appliedJobIds.includes(job.id) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center bg-app-surface border border-app-border rounded-[24px] space-y-3">
                <p className="text-app-muted text-sm font-semibold">No jobs found matching your search values.</p>
                <button onClick={() => { setSearch(''); setSelectedLocation('All'); setSelectedExperience('All'); setSelectedSalary('All'); setSelectedEmploymentType('All'); }} className="text-xs font-bold text-brand-blue underline cursor-pointer">
                  Reset search filters
                </button>
              </div>
            )}
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-app-surface border border-app-border rounded-2xl mt-4 animate-fadeIn">
              <span className="text-xs font-semibold text-app-muted font-mono">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} jobs
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-app-bg hover:bg-app-surface disabled:opacity-40 border border-app-border rounded-xl text-xs font-bold text-app-text transition cursor-pointer"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 bg-brand-blue/10 border border-brand-blue/20 rounded-xl text-xs font-bold text-brand-blue font-mono">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-app-bg hover:bg-app-surface disabled:opacity-40 border border-app-border rounded-xl text-xs font-bold text-app-text transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side match analysis */}
        <div className="lg:col-span-4 space-y-6">
          {activeJob ? (
            <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-6">
              <div>
                <h3 className="text-base font-bold text-app-text">AI Match Insights</h3>
                <p className="text-[11px] text-app-muted font-semibold mt-0.5">Why does <strong className="text-brand-blue">{activeJob.company}</strong> match your index?</p>
              </div>

              {/* Standard Skill alignment bars */}
              <div className="space-y-4">
                {activeJob.whyMatch.map((match, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-app-text">
                      <span>{match.skill}</span>
                      <span className="text-emerald-500 font-mono">{match.pct}%</span>
                    </div>
                    <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border/40">
                      <div 
                        className="h-full bg-emerald-500/80 rounded-full transition-all duration-500"
                        style={{ width: `${match.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing skills blocks */}
              <div className="space-y-3 pt-2 border-t border-app-border/40">
                <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">Missing Skills</span>
                <div className="space-y-2">
                  {activeJob.missingSkills.map((sk, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-semibold bg-app-bg border border-app-border rounded-xl p-2.5">
                      <span className="text-app-text">{sk.skill}</span>
                      <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-lg">~{sk.gap}% Match Gap</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improve score alert box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-blue text-white relative overflow-hidden shadow-lg space-y-3">
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span className="font-bold text-sm tracking-tight text-white">Improve Your Match Score</span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/80 font-medium">
                  Add recommended portfolio elements or certs to bridge the gap with recruiters.
                </p>
                <button className="w-full py-2.5 bg-white text-brand-violet text-xs font-extrabold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider">
                  Boost Score
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow text-center py-12">
              <Building className="w-10 h-10 text-app-muted mx-auto mb-3 opacity-60" />
              <p className="text-app-muted text-xs font-semibold">Select a job to view match insights.</p>
            </div>
          )}
        </div>
      </div>

      {/* 1. View Job Description Modal */}
      <AnimatePresence>
        {selectedJobForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${selectedJobForDetails.logoBg} flex items-center justify-center text-white font-black text-sm`}>
                    {selectedJobForDetails.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-app-text">{selectedJobForDetails.role}</h3>
                    <p className="text-xs font-bold text-app-muted mt-0.5">{selectedJobForDetails.company} • {selectedJobForDetails.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJobForDetails(null)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                {/* Highlights bar */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-app-surface border border-app-border text-xs font-bold text-app-muted">
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Experience</span>
                    <span className="text-app-text font-semibold flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-brand-blue" /> {selectedJobForDetails.experience}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Salary Range</span>
                    <span className="text-app-text font-semibold flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-brand-blue" /> {selectedJobForDetails.salary}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Match Index</span>
                    <span className="text-brand-blue font-extrabold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {selectedJobForDetails.match}% Match</span>
                  </div>
                </div>

                {/* Additional detailed metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-app-surface border border-app-border text-xs font-bold text-app-muted">
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Employment Type</span>
                    <span className="text-app-text font-semibold">{selectedJobForDetails.employmentType}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Openings</span>
                    <span className="text-app-text font-semibold">{selectedJobForDetails.openings}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Recruiter Count</span>
                    <span className="text-app-text font-semibold">{selectedJobForDetails.recruiterCount}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Submission Count</span>
                    <span className="text-app-text font-semibold">{selectedJobForDetails.submissionCount}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Complete Job Description</h4>
                  <div className="text-xs text-app-muted leading-relaxed whitespace-pre-line bg-app-surface/40 p-4 rounded-2xl border border-app-border/40 font-medium">
                    {selectedJobForDetails.description}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Requirements / Responsibilities</h4>
                  <div className="text-xs text-app-muted leading-relaxed whitespace-pre-line bg-app-surface/40 p-4 rounded-2xl border border-app-border/40 font-medium">
                    {selectedJobForDetails.requirements}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForDetails.skills.map((sk, idx) => (
                      <span key={idx} className="bg-app-surface border border-app-border px-3 py-1.5 rounded-lg text-xs text-app-text font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-app-muted border-t border-app-border/30 pt-3">
                  <span>Created: {formatTimestamp(selectedJobForDetails.createdAt)}</span>
                  <span>Updated: {formatTimestamp(selectedJobForDetails.updatedAt)}</span>
                </div>

                {/* Submitted Resume Info */}
                {appliedJobIds.includes(selectedJobForDetails.id) && (
                  <div className="space-y-3 pt-4 border-t border-app-border/40">
                    <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Your Submitted Application</h4>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                          <FileText className="w-5.5 h-5.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-app-text truncate">
                            {getAppliedResumeForJob(selectedJobForDetails.id)}
                          </p>
                          <p className="text-[9px] text-emerald-500 font-bold uppercase mt-0.5">Applied Successfully</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowResumeInlineDetails(!showResumeInlineDetails)}
                        className="px-3.5 py-2 bg-app-bg hover:bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-blue" />
                        {showResumeInlineDetails ? "Hide Preview" : "View Resume Inline"}
                      </button>
                    </div>

                    {showResumeInlineDetails && (
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
                            <h2 className="text-sm font-bold text-app-text">{userProfile?.fullName || 'Candidate Seeker'}</h2>
                            <p className="text-[10px]">{userProfile?.email || 'rishi.kumar@example.com'}</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Education</h3>
                            <p className="font-semibold text-app-text">B.Tech in Computer Science & Engineering</p>
                            <p className="text-[10px]">Aryx University | CGPA: 9.2/10 (2022 - 2026)</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Core Tech Stack</h3>
                            <p>React, Next.js, Node.js, Express, TypeScript, Tailwind CSS, PostgreSQL, MongoDB, Git</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Declarative Status</h3>
                            <p className="italic text-[10px]">Submitted securely via ARYX AI Gateway. System certified on-demand cryptographic stamp attached.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-app-border/40 flex justify-end gap-3 shrink-0 bg-app-surface/50">
                <button
                  onClick={() => {
                    setSelectedJobForDetails(null);
                    setShowResumeInlineDetails(false);
                  }}
                  className="px-5 py-2.5 bg-app-surface border border-app-border text-xs font-bold text-app-text rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                >
                  Close
                </button>
                {appliedJobIds.includes(selectedJobForDetails.id) ? (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl cursor-not-allowed"
                  >
                    Applied Successfully
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedJobForApply(selectedJobForDetails);
                      setSelectedJobForDetails(null);
                      setShowResumeInlineDetails(false);
                    }}
                    className="px-6 py-2.5 bg-brand-blue text-white hover:bg-brand-blue/90 text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-brand-blue/15"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Apply Modal with Resume Selector */}
      <AnimatePresence>
        {selectedJobForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow p-6"
            >
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-app-text">Apply for Position</h3>
                  <p className="text-xs text-app-muted mt-0.5">{selectedJobForApply.role} at {selectedJobForApply.company}</p>
                </div>
                <button 
                  onClick={() => setSelectedJobForApply(null)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSubmitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-app-text">Application Submitted!</h4>
                  <p className="text-xs text-app-muted">Successfully transmitted to {selectedJobForApply.company} hiring managers.</p>
                </div>
              ) : (
                <form onSubmit={handleFinalApplySubmit} className="space-y-6">
                  {/* Option Choice Tabs */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-app-muted block">Choose Resume to Submit</label>
                    <div className="grid grid-cols-2 gap-2 bg-app-surface border border-app-border p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setApplyResumeOption('existing')}
                        className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          applyResumeOption === 'existing' 
                            ? 'bg-brand-blue text-white shadow-md' 
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        Use Built Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplyResumeOption('upload')}
                        className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          applyResumeOption === 'upload' 
                            ? 'bg-brand-blue text-white shadow-md' 
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        Upload Custom
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Content Pane */}
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border">
                    {applyResumeOption === 'existing' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-app-text truncate">{existingResumeName}</p>
                          <p className="text-[9px] text-app-muted font-bold mt-0.5">SYNCED WITH ARYX RESUME BUILDER</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedFileName ? (
                          <div className="flex items-center justify-between bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-xl">
                            <span className="text-xs font-bold text-indigo-400 truncate max-w-[220px]">{uploadedFileName}</span>
                            <button 
                              type="button"
                              onClick={() => setUploadedFileName('')}
                              className="text-[10px] text-app-muted hover:text-red-500 font-bold cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-app-border rounded-xl p-6 text-center space-y-2 hover:border-brand-blue transition-colors relative">
                            <Upload className="w-6 h-6 text-app-muted mx-auto" />
                            <div>
                              <p className="text-[10px] font-bold text-app-text">Select a resume file (.pdf, .docx)</p>
                            </div>
                            <label className="inline-block px-3 py-1.5 bg-app-bg border border-app-border text-[9px] font-bold text-app-text rounded-lg cursor-pointer">
                              Choose File
                              <input 
                                type="file" 
                                accept=".pdf,.docx" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setUploadedFileName(e.target.files[0].name);
                                  }
                                }} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Completeness Warning Alerts */}
                  {(isProfileIncomplete || (applyResumeOption === 'existing' && isResumeIncomplete)) && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                      <div className="flex gap-2.5 items-start">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-extrabold text-app-text">Application Blocked</h4>
                          <p className="text-[10px] text-app-muted leading-relaxed mt-0.5">
                            Please complete the following requirement(s) before submitting your application:
                          </p>
                          <ul className="list-disc list-inside mt-1.5 space-y-1 text-[10px] text-app-muted font-bold">
                            {isProfileIncomplete && (
                              <li>
                                <strong className="text-red-500">Incomplete Profile:</strong> Go to the <span className="text-brand-blue">Profile</span> tab and fill out your Name and Email.
                              </li>
                            )}
                            {applyResumeOption === 'existing' && isResumeIncomplete && (
                              <li>
                                <strong className="text-red-500">No Resume Found:</strong> Build your resume under <span className="text-brand-blue">Resume Builder</span> first or choose 'Upload Custom' above.
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJobForApply(null)}
                      className="w-full py-3 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isProfileIncomplete || (applyResumeOption === 'existing' && isResumeIncomplete)}
                      className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold cursor-pointer transition shadow-lg shadow-brand-blue/15 uppercase tracking-wide"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
