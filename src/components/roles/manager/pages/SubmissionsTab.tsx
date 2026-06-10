import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Briefcase, 
  Users, 
  Calendar, 
  AlertCircle,
  Clock, 
  SlidersHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface SubmissionType {
  id: string;
  candidate: string;
  recruiter: string;
  job: string;
  date: string;
  status: 'Submitted' | 'Shortlisted' | 'In Review' | 'Rejected';
}

export default function SubmissionsTab() {
  
  // Real high-fidelity submissions list matching Image 5 exactly
  const [submissions, setSubmissions] = useState<SubmissionType[]>([
    { id: 'sub-1', candidate: 'Ravi Kumar', recruiter: 'Rahul Singh', job: 'Frontend Developer', date: '10 Jun 2026', status: 'Submitted' },
    { id: 'sub-2', candidate: 'Priya Sharma', recruiter: 'Akash Verma', job: 'Java Developer', date: '10 Jun 2026', status: 'Shortlisted' },
    { id: 'sub-3', candidate: 'Aman Gupta', recruiter: 'Priya Sharma', job: 'QA Engineer', date: '09 Jun 2026', status: 'In Review' },
    { id: 'sub-4', candidate: 'Sahil Mehta', recruiter: 'Rahul Singh', job: 'DevOps Engineer', date: '09 Jun 2026', status: 'Submitted' },
    { id: 'sub-5', candidate: 'Neha Verma', recruiter: 'Karthik Nair', job: 'Frontend Developer', date: '08 Jun 2026', status: 'Rejected' },
    { id: 'sub-6', candidate: 'Deepak Reddy', recruiter: 'Akash Verma', job: 'Java Developer', date: '08 Jun 2026', status: 'Shortlisted' },
    { id: 'sub-7', candidate: 'Sneha Iyer', recruiter: 'Priya Sharma', job: 'QA Engineer', date: '07 Jun 2026', status: 'In Review' },
    { id: 'sub-8', candidate: 'Vivek Singh', recruiter: 'Rahul Singh', job: 'DevOps Engineer', date: '07 Jun 2026', status: 'Submitted' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [jobFilter, setJobFilter] = useState('All');
  const [recruiterFilter, setRecruiterFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  // Filter keys
  const uniqueJobs = Array.from(new Set(submissions.map(s => s.job)));
  const uniqueRecruiters = Array.from(new Set(submissions.map(s => s.recruiter)));

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Spreadsheet compiled: Export of 247 global submittals complete.');
    }, 1200);
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.candidate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJob = jobFilter === 'All' || sub.job === jobFilter;
    const matchesRecruiter = recruiterFilter === 'All' || sub.recruiter === recruiterFilter;
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;

    return matchesSearch && matchesJob && matchesRecruiter && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Shortlisted':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'In Review':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
      case 'Rejected':
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'Submitted':
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Submissions</h1>
          <p className="text-app-muted mt-1">Track all active candidate submissions across workspace requirements.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all shrink-0 border border-brand-blue/20"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export listings
            </>
          )}
        </button>
      </div>

      {/* Complex layout filter system */}
      <div className="p-4 rounded-xl glass border border-app-border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search candidate profiles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
            />
          </div>

          {/* Sourcing parameters */}
          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            <div className="flex items-center gap-1 bg-app-surface border border-app-border px-3 py-2 rounded-xl text-xs font-bold text-app-muted shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Job */}
            <select 
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none max-w-[130px]"
            >
              <option value="All">All Jobs</option>
              {uniqueJobs.map((j, idx) => (
                <option key={idx} value={j}>{j}</option>
              ))}
            </select>

            {/* Recruiter */}
            <select 
              value={recruiterFilter}
              onChange={(e) => setRecruiterFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none max-w-[130px]"
            >
              <option value="All">All Recruiters</option>
              {uniqueRecruiters.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>

            {/* Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none max-w-[130px]"
            >
              <option value="All">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="In Review">In Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Submissions table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-4">Candidate</th>
                <th className="py-4 px-4">Recruiter</th>
                <th className="py-4 px-4">Job Requirement</th>
                <th className="py-4 px-4">Submitted On</th>
                <th className="py-4 px-4 text-right">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                    <td className="py-4 px-4 font-extrabold text-app-text">{sub.candidate}</td>
                    <td className="py-4 px-4 font-semibold text-app-muted">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-violet/10 flex items-center justify-center text-[10px] font-bold text-brand-violet text-center shrink-0">
                          {sub.recruiter.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span>{sub.recruiter}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                        <span className="font-semibold text-app-text">{sub.job}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-xs text-app-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{sub.date}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-block text-xs font-extrabold px-3.5 py-1 rounded-full border ${getStatusStyle(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-app-muted">
                    <AlertCircle className="w-10 h-10 mx-auto text-app-muted mb-3" />
                    <p className="font-semibold text-sm text-app-text">No submittals matched active queries</p>
                    <p className="text-xs text-app-muted mt-1">Review the search input fields or clear criteria selectors.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination component */}
      <div className="flex items-center justify-between text-xs font-semibold text-app-muted mt-4">
        <span>Showing 1 to {filteredSubmissions.length} of 247 submissions</span>
        <div className="flex items-center gap-1">
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
          <span className="text-app-muted px-1.5 font-bold">...</span>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">31</button>
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'>'}
          </button>
        </div>
      </div>

    </div>
  );
}
