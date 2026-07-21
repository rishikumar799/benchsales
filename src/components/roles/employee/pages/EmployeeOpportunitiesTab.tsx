import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, CheckCircle2, CircleDot, AlertCircle } from 'lucide-react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot, query, where, doc, setDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

interface EmployeeOpportunitiesTabProps {
  onApplyJob?: (jobTitle: string, company: string) => void;
}

export default function EmployeeOpportunitiesTab({ onApplyJob }: EmployeeOpportunitiesTabProps) {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (!userProfile?.organizationId) return;

    // Listen to open/Active jobs
    const jobsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'jobs');
    const unsubscribeJobs = onSnapshot(jobsCol, (snapshot) => {
      const fetchedJobs = snapshot.docs.map(snapDoc => {
        const data = snapDoc.data();
        return {
          id: snapDoc.id,
          role: data.title || data.role || '',
          team: data.dept || data.team || data.department || 'Engineering Team',
          matchType: data.matchType || 'Internal Mobility',
          location: data.location || 'Hyderabad, India',
          exp: data.experience || data.exp || '3+ Years',
          type: data.type || 'Full Time',
          department: data.dept || data.department || 'Engineering',
          status: data.status || 'Active',
          createdAt: data.createdAt || new Date().toISOString(),
          assignedRecruiterId: data.assignedRecruiterId || data.recruiterUid || ''
        };
      });
      setJobs(fetchedJobs);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to jobs:", error);
      setLoading(false);
    });

    // Listen to current employee's applications
    const appsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'applications');
    const qApps = query(appsCol, where('employeeUid', '==', userProfile.uid));
    const unsubscribeApps = onSnapshot(qApps, (snapshot) => {
      const fetchedApps = snapshot.docs.map(snapDoc => snapDoc.data());
      setAppliedJobs(fetchedApps);
    }, (error) => {
      console.error("Error listening to applications:", error);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApps();
    };
  }, [userProfile?.organizationId, userProfile?.uid]);

  const filteredJobs = useMemo(() => {
    // Only display jobs where status is 'open' or 'active' (to support seeded jobs)
    const openJobs = jobs.filter(job => job.status?.toLowerCase() === 'open' || job.status?.toLowerCase() === 'active');

    const results = openJobs.filter(job => {
      const matchSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'All' || job.department.toLowerCase() === deptFilter.toLowerCase();
      const matchLoc = locFilter === 'All' || job.location.toLowerCase().includes(locFilter.toLowerCase());
      const matchExp = expFilter === 'All' || job.exp.toLowerCase().includes(expFilter.toLowerCase());
      const matchType = typeFilter === 'All' || job.type.toLowerCase().includes(typeFilter.toLowerCase());
      return matchSearch && matchDept && matchLoc && matchExp && matchType;
    });

    return results.sort((a, b) => {
      if (sortOrder === 'Newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'Oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'Title') {
        return a.role.localeCompare(b.role);
      }
      return 0;
    });
  }, [jobs, searchTerm, deptFilter, locFilter, expFilter, typeFilter, sortOrder]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, deptFilter, locFilter, expFilter, typeFilter, sortOrder]);

  const departments = useMemo(() => {
    const list = new Set(jobs.map(j => j.department).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [jobs]);

  const locations = useMemo(() => {
    const list = new Set(jobs.map(j => j.location.split(',')[0].trim()).filter(Boolean));
    return ['All', ...Array.from(list)];
  }, [jobs]);

  const experiences = ['All', '2+ Years', '3+ Years', '4+ Years', '5+ Years', '3-5 Years', '4-6 Years', '6-8 Years'];
  const jobTypes = ['All', 'Full-time', 'Full Time', 'Contract'];

  const handleApply = async (job: any) => {
    if (!userProfile?.organizationId || !userProfile?.uid) {
      setErrorMsg('Unauthorized action. Please sign in again.');
      return;
    }

    const isDuplicate = appliedJobs.some(
      app => app.jobId === job.id || (app.jobTitle === job.role && app.employeeUid === userProfile.uid)
    );

    if (isDuplicate) {
      setErrorMsg(`You have already applied for the "${job.role}" position.`);
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    try {
      const appsCol = collection(db, 'organizations_companies', userProfile.organizationId, 'applications');
      const newAppDocRef = doc(appsCol);
      const applicationId = newAppDocRef.id;

      const applicationData = {
        applicationId,
        jobId: job.id,
        jobTitle: job.role,
        employeeUid: userProfile.uid,
        employeeName: userProfile.fullName || userProfile.displayName || 'Employee',
        organizationId: userProfile.organizationId,
        recruiterUid: job.assignedRecruiterId || '',
        status: 'Applied',
        timeline: [
          { status: 'Applied', date: new Date().toISOString(), label: 'Applied' }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(newAppDocRef, applicationData);

      // Log Corporate Activity
      try {
        const actCol = collection(db, 'organizations_companies', userProfile.organizationId, 'activity');
        await addDoc(actCol, {
          userName: userProfile.fullName || userProfile.displayName || 'Employee',
          action: `applied for`,
          subject: job.role,
          time: 'Just Now',
          avatar: (userProfile as any).avatar || userProfile.photoURL || 'https://picsum.photos/seed/emp/100/100',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.error("Error logging activity:", err);
      }

      if (onApplyJob) {
        onApplyJob(job.role, 'Internal Sourcing Portal');
      }

      setSuccessMsg(`✓ Application for "${job.role}" submitted successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error("Error applying to job:", err);
      setErrorMsg("Failed to submit application. Please try again.");
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  if (!userProfile?.organizationId) {
    return (
      <div className="p-8 text-center text-app-muted font-bold text-xs">
        Loading Corporate Workspace...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Visual Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text">Opportunities</h2>
        <p className="text-xs text-app-muted mt-1 font-semibold">Explore and apply for secure internal openings.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-bold text-xs">
          {errorMsg}
        </div>
      )}

      {/* Filter and search controllers */}
      <div className="p-5 md:p-6 rounded-3xl bg-app-surface border border-app-border card-shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search opportunities..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-2xl py-3 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-4 py-3 bg-app-bg border border-app-border rounded-2xl text-xs font-bold text-app-text hover:bg-app-surface focus:outline-none cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Title">Title A-Z</option>
            </select>
            <button className="px-5 py-3 border border-app-border rounded-2xl text-xs font-bold text-app-text bg-app-bg hover:bg-app-surface flex items-center gap-2 shrink-0 transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Department</label>
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-blue"
            >
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Location</label>
            <select 
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-blue"
            >
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Experience</label>
            <select 
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-blue"
            >
              {experiences.map((exp) => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Job Type</label>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-app-bg border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-brand-blue"
            >
              {jobTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center rounded-[32px] bg-app-surface border border-app-border text-app-muted text-xs py-16 font-bold">
            Loading internal positions in real-time...
          </div>
        ) : paginatedJobs.length > 0 ? (
          paginatedJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-blue bg-brand-blue/10 px-3 py-0.5 rounded-md border border-brand-blue/10">
                    {job.matchType}
                  </span>
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">
                    Posted on {job.date}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-display font-black text-app-text">{job.role}</h3>
                  <p className="text-xs font-semibold text-app-muted mt-0.5">{job.team} • Group Sourcing</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-app-muted">
                  <span className="flex items-center gap-1.5">📍 {job.location}</span>
                  <span className="flex items-center gap-1.5">💼 {job.exp}</span>
                  <span className="flex items-center gap-1.5">🕒 {job.type}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-none pt-4 md:pt-0">
                <button 
                  onClick={() => alert(`Details View for ${job.role}: \nIncludes detailed responsibilities, grade conversion (L3 -> L4), and matching metrics.`)}
                  className="flex-1 md:flex-initial px-4 py-3 bg-app-bg hover:bg-app-surface border border-app-border text-app-text hover:text-brand-blue font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  View Details
                </button>
                {appliedJobs.some(app => app.jobId === job.id || app.jobTitle === job.role) ? (
                  <button 
                    disabled
                    className="flex-1 md:flex-initial px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                  </button>
                ) : (
                  <button 
                    onClick={() => handleApply(job)}
                    className="flex-1 md:flex-initial px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-[32px] bg-app-surface border border-app-border text-app-muted text-sm py-16">
            No internal postings meet your exact filter criteria.
          </div>
        )}
      </div>

      {/* Pagination panel */}
      {filteredJobs.length > 0 && (
        <div className="flex justify-between items-center pt-4">
          <span className="text-[11px] font-bold text-app-muted">
            Showing {Math.min(filteredJobs.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredJobs.length, currentPage * itemsPerPage)} of {filteredJobs.length} opportunities
          </span>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted disabled:opacity-50 cursor-pointer"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  currentPage === i + 1 ? 'bg-brand-blue text-white' : 'border border-app-border bg-app-surface text-app-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted disabled:opacity-50 cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
