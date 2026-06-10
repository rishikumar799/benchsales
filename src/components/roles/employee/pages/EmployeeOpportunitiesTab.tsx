import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, SlidersHorizontal, CheckCircle2, CircleDot } from 'lucide-react';

interface EmployeeOpportunitiesTabProps {
  onApplyJob?: (jobTitle: string, company: string) => void;
}

export default function EmployeeOpportunitiesTab({ onApplyJob }: EmployeeOpportunitiesTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [locFilter, setLocFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  const originalJobs = [
    { id: '1', role: 'Senior Software Engineer', team: 'Engineering Team', matchType: 'Internal Mobility', location: 'Hyderabad', exp: '4+ Years', type: 'Full Time', department: 'Engineering', date: '25 May 2024' },
    { id: '2', role: 'Cloud Engineer', team: 'Infrastructure Team', matchType: 'Internal Transfer', location: 'Bangalore', exp: '3+ Years', type: 'Full Time', department: 'Infrastructure', date: '24 May 2024' },
    { id: '3', role: 'Tech Lead', team: 'Platform Team', matchType: 'Internal Mobility', location: 'Hyderabad', exp: '5+ Years', type: 'Full Time', department: 'Platform', date: '23 May 2024' },
    { id: '4', role: 'Data Scientist', team: 'Data Team', matchType: 'Internal Sourcing', location: 'Pune', exp: '3+ Years', type: 'Full Time', department: 'Data Science', date: '22 May 2024' },
    { id: '5', role: 'DevOps Architect', team: 'Infrastructure Team', matchType: 'Internal Sourcing', location: 'Remote', exp: '5+ Years', type: 'Full Time', department: 'Infrastructure', date: '20 May 2024' },
    { id: '6', role: 'Technical Program Manager', team: 'Engineering Team', matchType: 'Internal Mobility', location: 'Hyderabad', exp: '4+ Years', type: 'Full Time', department: 'Engineering', date: '19 May 2024' },
    { id: '7', role: 'ML Engineer', team: 'Data Team', matchType: 'Internal Transfer', location: 'Remote', exp: '3+ Years', type: 'Full Time', department: 'Data Science', date: '18 May 2024' },
    { id: '8', role: 'Security Analyst', team: 'Security Team', matchType: 'Internal Hiring', location: 'Pune', exp: '2+ Years', type: 'Full Time', department: 'Security', date: '15 May 2024' }
  ];

  const filteredJobs = useMemo(() => {
    return originalJobs.filter(job => {
      const matchSearch = job.role.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'All' || job.department === deptFilter;
      const matchLoc = locFilter === 'All' || job.location === locFilter;
      const matchExp = expFilter === 'All' || job.exp === expFilter;
      const matchType = typeFilter === 'All' || job.type === typeFilter;
      return matchSearch && matchDept && matchLoc && matchExp && matchType;
    });
  }, [searchTerm, deptFilter, locFilter, expFilter, typeFilter]);

  const departments = ['All', 'Engineering', 'Infrastructure', 'Platform', 'Data Science', 'Security'];
  const locations = ['All', 'Hyderabad', 'Bangalore', 'Pune', 'Remote'];
  const experiences = ['All', '2+ Years', '3+ Years', '4+ Years', '5+ Years'];
  const jobTypes = ['All', 'Full Time', 'Contract'];

  const handleApply = (jobTitle: string) => {
    if (onApplyJob) {
      onApplyJob(jobTitle, 'Internal Sourcing Portal');
    }
    setSuccessMsg(`✓ Transfer request for "${jobTitle}" submitted successfully!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

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
          <button className="px-5 py-3 border border-app-border rounded-2xl text-xs font-bold text-app-text hover:bg-app-bg flex items-center gap-2 shrink-0 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
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
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
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
                <button 
                  onClick={() => handleApply(job.role)}
                  className="flex-1 md:flex-initial px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Apply
                </button>
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
            Showing 1 to {filteredJobs.length} of {filteredJobs.length} opportunities
          </span>
          <div className="flex items-center gap-1.5">
            <button className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted disabled:opacity-50" disabled>
              &lt;
            </button>
            <button className="px-3.5 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold">1</button>
            <button className="px-3.5 py-2 border border-app-border bg-app-surface text-app-muted rounded-xl text-xs font-bold">2</button>
            <button className="p-2 border border-app-border rounded-xl text-xs font-bold bg-app-surface text-app-muted">
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
