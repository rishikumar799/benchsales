import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { 
  Search, 
  Download, 
  Users, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  X,
  Sparkles,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Briefcase
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  activeJobs: number;
  submissions: number;
  shortlisted: number;
  selected: number;
  successRate: string;
  placementRate: string;
  lastActive: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  img: string;
  assignedJobs: string[];
  email: string;
  phoneNumber: string;
  company: string;
  experience: string;
  skills: string;
  department: string;
}

export default function RecruitersTab() {
  
  const { user } = useAuth();
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let recsData: any[] = [];
    let subsData: any[] = [];
    let jobsData: any[] = [];

    const unsubRecs = onSnapshot(collection(db, 'marketplace_recruiters'), (snapshot) => {
      recsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      updateDerivedStates();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'marketplace_recruiters');
    });

    const unsubSubs = onSnapshot(collection(db, 'marketplace_submissions'), (snapshot) => {
      subsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllSubmissions(subsData);
      updateDerivedStates();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'marketplace_submissions');
    });

    const unsubJobs = onSnapshot(collection(db, 'marketplace_jobs'), (snapshot) => {
      jobsData = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      setAllJobs(jobsData);
      updateDerivedStates();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'marketplace_jobs');
    });

    function updateDerivedStates() {
      const activeBdmJobs = jobsData.filter(j => j.status !== 'archived');
      const mappedRecs = recsData.map(rec => {
        const id = rec.id;
        const profile = rec.profile || {};
        
        // Step 2: Fallback chain for real recruiter name:
        // profile.fullName -> fullName -> name -> displayName -> email prefix -> "Unknown Recruiter"
        const email = profile.email || rec.email || '';
        const emailPrefix = email ? email.split('@')[0] : '';
        const displayName = rec.displayName || profile.displayName || '';
        const name = profile.fullName || rec.fullName || profile.name || rec.name || displayName || emailPrefix || 'Unknown Recruiter';
        
        const status = profile.status === 'approved' || rec.status === 'Active' || rec.status === 'approved' || profile.status === 'Active' ? 'Active' : 'Inactive';
        
        // Step 5: Profile photo fallback order:
        // photoURL -> avatar -> profile.photo -> Firebase Auth photoURL -> default avatar
        let img = '';
        if (rec.photoURL) {
          img = rec.photoURL;
        } else if (rec.avatar) {
          img = rec.avatar;
        } else if (profile.photo) {
          img = profile.photo;
        } else if (profile.photoURL) {
          img = profile.photoURL;
        } else if (rec.profilePic) {
          img = rec.profilePic;
        } else {
          img = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
        }

        let joinDate = 'Not Available';
        const rawJoin = profile.createdAt || rec.createdAt;
        if (rawJoin) {
          try {
            const dateObj = (rawJoin.toDate) ? rawJoin.toDate() : new Date(rawJoin);
            if (!isNaN(dateObj.getTime())) {
              joinDate = dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
            }
          } catch(e) {}
        }
        if (joinDate === 'Not Available' && (profile.joinDate || rec.joinDate)) {
          joinDate = profile.joinDate || rec.joinDate;
        }

        const isStatus = (sVal: string, target: string) => {
          return sVal?.trim().toLowerCase() === target.toLowerCase();
        };

        // Submissions for this recruiter
        const recruiterSubs = subsData.filter(s => s.recruiterUid === id || s.recruiterId === id);

        // Step 4: Last Activity (Retrieve the recruiter's most recent activity timestamp. If no activity, "No Activity Yet")
        let lastActive = 'No Activity Yet';
        let latestTimestampObj: Date | null = null;
        const rawActive = profile.lastActive || rec.lastActive;
        if (rawActive) {
          try {
            const dateObj = (rawActive.toDate) ? rawActive.toDate() : new Date(rawActive);
            if (!isNaN(dateObj.getTime())) {
              latestTimestampObj = dateObj;
            }
          } catch(e) {}
        }
        recruiterSubs.forEach(s => {
          const rawSubDate = s.createdAt || s.submittedAt;
          if (rawSubDate) {
            try {
              const dateObj = (rawSubDate.toDate) ? rawSubDate.toDate() : new Date(rawSubDate);
              if (!isNaN(dateObj.getTime())) {
                if (!latestTimestampObj || dateObj > latestTimestampObj) {
                  latestTimestampObj = dateObj;
                }
              }
            } catch (e) {}
          }
        });
        if (latestTimestampObj) {
          lastActive = latestTimestampObj.toLocaleDateString() + ' ' + latestTimestampObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        const phoneNumber = profile.phoneNumber || profile.phone || rec.phoneNumber || rec.phone || 'Not Available';
        const company = profile.company || rec.company || profile.organization || rec.organization || 'Not Available';
        const experience = profile.experience || rec.experience || 'Not Available';
        
        let skills = 'Not Available';
        const rawSkills = profile.skills || rec.skills;
        if (rawSkills) {
          if (Array.isArray(rawSkills)) {
            skills = rawSkills.join(', ');
          } else if (typeof rawSkills === 'string') {
            skills = rawSkills;
          }
        }

        const department = profile.department || profile.dept || rec.department || rec.dept || 'Not Available';

        // Count jobs where this recruiter is assigned
        const assignedBdmJobs = activeBdmJobs.filter(j => j.assignedRecruiters?.includes(id));
        const activeJobsCount = assignedBdmJobs.length;
        const assignedJobTitles = assignedBdmJobs.map(j => j.title || 'Requirement');

        // Metrics from Firestore
        const submissionsCount = recruiterSubs.length;
        const shortlistedCount = recruiterSubs.filter(s => isStatus(s.status, 'shortlisted')).length;
        const selectedCount = recruiterSubs.filter(s => isStatus(s.status, 'selected') || isStatus(s.status, 'joined') || isStatus(s.status, 'hired')).length;

        // Success Rate = selected / total submissions (as requested by Step 4: "selected / total submissions")
        // Placement Rate = calculated from successful placements
        const successRateVal = submissionsCount > 0 ? Math.round((selectedCount / submissionsCount) * 100) : 0;
        const successRate = successRateVal + '%';

        const placementRateVal = submissionsCount > 0 ? Math.round((selectedCount / submissionsCount) * 100) : 0;
        const placementRate = placementRateVal + '%';

        return {
          id,
          name,
          activeJobs: activeJobsCount,
          submissions: submissionsCount,
          shortlisted: shortlistedCount,
          selected: selectedCount,
          successRate,
          placementRate,
          lastActive,
          joinDate,
          status,
          img,
          assignedJobs: assignedJobTitles,
          email: email || 'Not Available',
          phoneNumber,
          company,
          experience,
          skills,
          department
        } as RecruiterType;
      });

      setRecruiters(mappedRecs);
      setLoading(false);
    }

    return () => {
      unsubRecs();
      unsubSubs();
      unsubJobs();
    };
  }, [user]);

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'selected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType | null>(null);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  const filteredRecruiters = recruiters.filter(rec => {
    // Search filter: Name, Company, Department, Skills, Email. NOT Firebase UID.
    const queryStr = searchQuery.toLowerCase();
    const matchesSearch = 
      (rec.name && rec.name.toLowerCase().includes(queryStr)) || 
      (rec.company && rec.company.toLowerCase().includes(queryStr)) ||
      (rec.department && rec.department.toLowerCase().includes(queryStr)) ||
      (rec.skills && rec.skills.toLowerCase().includes(queryStr)) ||
      (rec.email && rec.email.toLowerCase().includes(queryStr));
    
    // Status filter
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    
    // Company filter
    const matchesCompany = companyFilter === 'All' || rec.company === companyFilter;
    
    // Department filter
    const matchesDepartment = departmentFilter === 'All' || rec.department === departmentFilter;

    // Experience filter
    const matchesExperience = experienceFilter === 'All' || rec.experience === experienceFilter;

    // Sub-tab filter (Selected vs All)
    const matchesTab = activeSubTab === 'all' || rec.assignedJobs.length > 0;

    return matchesSearch && matchesStatus && matchesCompany && matchesDepartment && matchesExperience && matchesTab;
  });

  // Unique companies, departments, and experiences list for the filter options (computed from raw recruiters)
  const uniqueCompanies = Array.from(new Set(recruiters.map(r => r.company).filter(c => c && c !== 'Not Available')));
  const uniqueDepartments = Array.from(new Set(recruiters.map(r => r.department).filter(d => d && d !== 'Not Available')));
  const uniqueExperiences = Array.from(new Set(recruiters.map(r => r.experience).filter(e => e && e !== 'Not Available')));

  // Apply sorting: Newest, Oldest, Name A-Z, Most Active Recruiters, Highest Submission Count
  const sortedRecruiters = [...filteredRecruiters].sort((a, b) => {
    if (sortBy === 'Name A-Z') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'Newest') {
      const dateA = a.joinDate && a.joinDate !== 'Not Available' ? new Date(a.joinDate).getTime() : 0;
      const dateB = b.joinDate && b.joinDate !== 'Not Available' ? new Date(b.joinDate).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'Oldest') {
      const dateA = a.joinDate && a.joinDate !== 'Not Available' ? new Date(a.joinDate).getTime() : Infinity;
      const dateB = b.joinDate && b.joinDate !== 'Not Available' ? new Date(b.joinDate).getTime() : Infinity;
      return dateA - dateB;
    }
    if (sortBy === 'Most Active Recruiters') {
      return b.activeJobs - a.activeJobs;
    }
    if (sortBy === 'Highest Submission Count') {
      return b.submissions - a.submissions;
    }
    return 0;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Recruiters</h1>
          <p className="text-app-muted mt-1">Monitor, assign and coordinate marketplace sourcing partners.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shrink-0 border border-brand-blue/20"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export recruiters directory
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher UI */}
      <div className="flex border-b border-app-border/40 gap-6">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`pb-4 text-sm font-bold transition-all relative select-none ${
            activeSubTab === 'all' 
              ? 'text-brand-blue' 
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          All Available Recruiters
          {activeSubTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('selected')}
          className={`pb-4 text-sm font-bold transition-all relative select-none ${
            activeSubTab === 'selected' 
              ? 'text-brand-blue' 
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Selected Recruiters
          {activeSubTab === 'selected' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col xl:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by name, email, company, department or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto shrink-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Partners</option>
            <option value="Inactive">Inactive Partners</option>
          </select>

          <select 
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All Companies</option>
            {uniqueCompanies.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All Departments</option>
            {uniqueDepartments.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </select>

          <select 
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All Experiences</option>
            {uniqueExperiences.map((exp, i) => (
              <option key={i} value={exp}>{exp}</option>
            ))}
          </select>

          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="Name A-Z">Name A-Z</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
            <option value="Most Active Recruiters">Most Active</option>
            <option value="Highest Submission Count">Highest Submissions</option>
          </select>
        </div>
      </div>

      {/* Recruiters catalog table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          {activeSubTab === 'all' ? (
            /* TAB 1: ALL AVAILABLE RECRUITERS */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider">
                  <th className="py-4 px-4">Recruiter</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Active Jobs</th>
                  <th className="py-4 px-4 text-center">Total Submissions</th>
                  <th className="py-4 px-4 text-center">Success Rate</th>
                  <th className="py-4 px-4 text-center">Placement Rate</th>
                  <th className="py-4 px-4">Last Active</th>
                  <th className="py-4 px-4">Join Date</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-xs">
                {sortedRecruiters.length > 0 ? (
                  sortedRecruiters.map((rec) => (
                    <tr key={rec.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rec.img} 
                            alt={rec.name} 
                            className="w-9 h-9 rounded-full object-cover border border-app-border shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-app-text block">{rec.name}</span>
                            {(() => {
                              const subtitleParts = [];
                              if (rec.company && rec.company !== 'Not Available') subtitleParts.push(rec.company);
                              if (rec.department && rec.department !== 'Not Available') subtitleParts.push(rec.department);
                              if (subtitleParts.length === 0 && rec.email && rec.email !== 'Not Available') subtitleParts.push(rec.email);
                              return subtitleParts.length > 0 ? (
                                <span className="text-[10px] text-app-muted block font-semibold mt-0.5">{subtitleParts.join(' • ')}</span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          rec.status === 'Active' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-white/5 border-app-border text-app-muted'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${rec.status === 'Active' ? 'bg-emerald-500' : 'bg-app-muted'}`} />
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-app-text">{rec.activeJobs}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-blue">{rec.submissions}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.successRate}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-purple">{rec.placementRate}</td>
                      <td className="py-4 px-4 font-semibold text-app-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{rec.lastActive}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-app-muted">{rec.joinDate}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecruiter(rec)}
                          className="px-3 py-1.5 rounded-xl bg-brand-blue/10 hover:bg-brand-blue hover:text-white text-brand-blue text-[11px] font-bold transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-app-muted">
                      <ShieldAlert className="w-10 h-10 mx-auto text-app-muted mb-3" />
                      <p className="font-semibold text-sm text-app-text">No available partner matches filters</p>
                      <p className="text-xs text-app-muted mt-1">Refine your keywords or reset active selectors.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* TAB 2: SELECTED RECRUITERS */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider">
                  <th className="py-4 px-4">Recruiter</th>
                  <th className="py-4 px-4">Assigned Jobs</th>
                  <th className="py-4 px-4 text-center">Active Jobs</th>
                  <th className="py-4 px-4 text-center">Submissions</th>
                  <th className="py-4 px-4 text-center">Shortlisted</th>
                  <th className="py-4 px-4 text-center">Selected</th>
                  <th className="py-4 px-4 text-center">Success Rate</th>
                  <th className="py-4 px-4">Last Activity</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-xs">
                {sortedRecruiters.length > 0 ? (
                  sortedRecruiters.map((rec) => (
                    <tr key={rec.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rec.img} 
                            alt={rec.name} 
                            className="w-9 h-9 rounded-full object-cover border border-app-border shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-app-text block">{rec.name}</span>
                            {(() => {
                              const subtitleParts = [];
                              if (rec.company && rec.company !== 'Not Available') subtitleParts.push(rec.company);
                              if (rec.department && rec.department !== 'Not Available') subtitleParts.push(rec.department);
                              if (subtitleParts.length === 0 && rec.email && rec.email !== 'Not Available') subtitleParts.push(rec.email);
                              return subtitleParts.length > 0 ? (
                                <span className="text-[10px] text-app-muted block font-semibold mt-0.5">{subtitleParts.join(' • ')}</span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {rec.assignedJobs.map((jobName, idx) => (
                            <span 
                              key={idx}
                              className="text-[9px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/15 px-2 py-0.5 rounded"
                            >
                              {jobName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-app-text">{rec.activeJobs}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-blue">{rec.submissions}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-purple">{rec.shortlisted}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.selected}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.successRate}</td>
                      <td className="py-4 px-4 font-semibold text-app-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{rec.lastActive}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecruiter(rec)}
                          className="px-3 py-1.5 rounded-xl bg-brand-purple/10 hover:bg-brand-purple hover:text-white text-brand-purple text-[11px] font-bold transition-all whitespace-nowrap"
                        >
                          Manage Assignment
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-app-muted">
                      <ShieldAlert className="w-10 h-10 mx-auto text-app-muted mb-3" />
                      <p className="font-semibold text-sm text-app-text">No selected partner matches filters</p>
                      <p className="text-xs text-app-muted mt-1">Refine your keywords or choose assignable recruiters on jobs page.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination segment */}
      <div className="flex items-center justify-between text-xs font-semibold text-app-muted mt-4">
        <span>Showing 1 to {sortedRecruiters.length} of {activeSubTab === 'all' ? recruiters.length : recruiters.filter(r => r.assignedJobs.length > 0).length} recruiters</span>
        <div className="flex items-center gap-1">
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'>'}
          </button>
        </div>
      </div>

      {/* Recruiter Details Modal Overlay */}
      {selectedRecruiter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-app-bg border border-app-border rounded-[32px] w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto card-shadow flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedRecruiter.img} 
                    className="w-14 h-14 rounded-full object-cover border border-app-border shadow" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-2xl font-display font-bold text-app-text flex items-center gap-2">
                      {selectedRecruiter.name}
                      {selectedRecruiter.company && selectedRecruiter.company !== 'Not Available' && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue">
                          {selectedRecruiter.company}
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-app-muted mt-1 font-semibold">
                      Sourcing Partner since <span className="text-app-text">{selectedRecruiter.joinDate}</span> • Status: <span className="text-emerald-500 font-bold">{selectedRecruiter.status}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecruiter(null)}
                  className="p-2 hover:bg-app-surface border border-app-border hover:border-app-muted rounded-full text-app-muted hover:text-app-text transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Performance Indicator Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Top Performer
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  High Placement Rate
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-brand-purple/10 text-brand-purple border-brand-purple/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  High Submission Rate
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-brand-blue/10 text-brand-blue border-brand-blue/20 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Consistent Recruiter
                </span>
              </div>

              {/* Business Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Active Jobs Worked</span>
                  <span className="text-lg font-display font-black text-app-text mt-1 block">
                    {selectedRecruiter.activeJobs}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Sourcing Conversions</span>
                  <div className="text-sm font-semibold text-app-text mt-1 space-y-0.5">
                    <div>Submissions: <span className="font-bold text-brand-blue">{selectedRecruiter.submissions}</span></div>
                    <div>Shortlisted: <span className="font-bold text-brand-purple">{selectedRecruiter.shortlisted}</span></div>
                    <div>Selected: <span className="font-bold text-emerald-500">{selectedRecruiter.selected}</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Placement Success Rate</span>
                  <span className="text-lg font-display font-black text-emerald-500 mt-1 block">
                    {selectedRecruiter.successRate}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Response SLA</span>
                  <span className="text-sm font-semibold text-app-text mt-1 block font-mono">
                    ~ 15 minutes
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Top Sourcing Skillset</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {selectedRecruiter.skills && selectedRecruiter.skills !== 'Not Available' ? (
                      selectedRecruiter.skills.split(',').map((s: string, idx: number) => (
                        <span key={idx} className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 border border-app-border text-app-muted">
                          {s.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] font-bold text-app-muted">Not Available</span>
                    )}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Most Active Vertical</span>
                  <span className="text-sm font-semibold text-brand-blue mt-1 block">
                    {selectedRecruiter.department && selectedRecruiter.department !== 'Not Available' ? selectedRecruiter.department : 'Not Available'}
                  </span>
                </div>
              </div>

              {/* Detailed Profile Grid */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Detailed Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 p-4 rounded-2xl bg-app-surface/20 border border-app-border/60 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Email Address</span>
                    <span className="text-app-text font-medium select-all">{selectedRecruiter.email}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Phone Number</span>
                    <span className="text-app-text font-medium">{selectedRecruiter.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Company</span>
                    <span className="text-app-text font-semibold text-brand-blue">{selectedRecruiter.company}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Department</span>
                    <span className="text-app-text font-medium">{selectedRecruiter.department}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Experience</span>
                    <span className="text-app-text font-medium">{selectedRecruiter.experience}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30">
                    <span className="text-app-muted">Last Active</span>
                    <span className="text-app-text font-medium">{selectedRecruiter.lastActive}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-app-border/30 col-span-1 md:col-span-2">
                    <span className="text-app-muted shrink-0">Skills</span>
                    <span className="text-app-text font-medium text-right break-words max-w-md">{selectedRecruiter.skills}</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Recent Sourcing Activity</h3>
                <p className="text-xs font-medium text-app-text bg-app-surface/10 p-3 rounded-xl border border-app-border/40 font-mono">
                  Sourced {selectedRecruiter.submissions} total files. Last active timestamp: Today ({selectedRecruiter.lastActive}). Currently managing candidates for {selectedRecruiter.assignedJobs.length > 0 ? selectedRecruiter.assignedJobs.join(', ') : 'no current assigned roles'}.
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
                      {(() => {
                        const recSubs = allSubmissions
                          .filter(s => s.recruiterUid === selectedRecruiter.id || s.recruiterId === selectedRecruiter.id)
                          .sort((a, b) => {
                            const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
                            const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
                            return dateB - dateA;
                          })
                          .slice(0, 5);

                        if (recSubs.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="py-4 px-4 text-center text-app-muted text-xs font-semibold">
                                No submissions found for this recruiter.
                              </td>
                            </tr>
                          );
                        }

                        return recSubs.map((sub, sIdx) => {
                          let formattedDate = 'Not Available';
                          const rawDate = sub.createdAt || sub.submittedAt || sub.submissionDate;
                          if (rawDate) {
                            try {
                              const dateObj = (rawDate.toDate) ? rawDate.toDate() : new Date(rawDate);
                              if (!isNaN(dateObj.getTime())) {
                                formattedDate = dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
                              }
                            } catch (e) {}
                          }

                          return (
                            <tr key={sub.id || sIdx} className="hover:bg-app-surface/20 transition-colors">
                              <td className="py-3 px-4 font-bold text-app-text">{sub.candidateName || 'Anonymous Candidate'}</td>
                              <td className="py-3 px-4 text-brand-purple font-semibold">{sub.jobTitle || 'General Application'}</td>
                              <td className="py-3 px-4">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                  sub.status?.toLowerCase() === 'selected' || sub.status?.toLowerCase() === 'hired' || sub.status?.toLowerCase() === 'joined'
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25'
                                    : sub.status?.toLowerCase() === 'shortlisted'
                                    ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/25'
                                    : 'bg-white/5 text-app-muted border-app-border'
                                }`}>
                                  {sub.status || 'Submitted'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-[11px]">{formattedDate}</td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-app-border/40">
              <button
                type="button"
                onClick={() => setSelectedRecruiter(null)}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 rounded-xl text-xs font-extrabold text-white transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
