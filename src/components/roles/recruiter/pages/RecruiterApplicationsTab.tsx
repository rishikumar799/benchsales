import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Eye, 
  ChevronDown, 
  Mail, 
  Phone,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface RecruiterApplicationsTabProps {
  onNavigate: (tab: string) => void;
  applications: Array<{
    id: string;
    candidateName: string;
    role: string;
    date: string;
    status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
    dept: string;
  }>;
  onSelectCandidate: (id: string) => void;
  hiringProgress: {
    applied: number;
    underReview: number;
    shortlisted: number;
    interview: number;
    selected: number;
  };
}

export default function RecruiterApplicationsTab({
  onNavigate,
  applications,
  onSelectCandidate,
  hiringProgress
}: RecruiterApplicationsTabProps) {
  const [activeTabStatus, setActiveTabStatus] = useState<'All' | 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');

  // Counts of each
  const counts = {
    All: applications.length,
    Applied: applications.filter(a => a.status === 'Applied').length,
    UnderReview: applications.filter(a => a.status === 'Under Review').length,
    Shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    Interview: applications.filter(a => a.status === 'Interview').length,
    Selected: applications.filter(a => a.status === 'Selected').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const filteredApps = applications.filter(app => {
    const matchesStatus = activeTabStatus === 'All' || app.status === activeTabStatus;
    const matchesSearch = app.candidateName.toLowerCase().includes(search.toLowerCase()) || 
                          app.role.toLowerCase().includes(search.toLowerCase());
    const matchesJob = selectedJob === 'All' || app.role === selectedJob;
    const matchesDept = selectedDept === 'All' || app.dept === selectedDept;

    return matchesStatus && matchesSearch && matchesJob && matchesDept;
  });

  const uniqueRoles = Array.from(new Set(applications.map(a => a.role)));
  const uniqueDepts = Array.from(new Set(applications.map(a => a.dept)));

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Applications</h1>
        <p className="text-app-muted text-sm mt-1">Track all database applications across your job openings.</p>
      </div>

      {/* Status Filter Tabs bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-app-border pb-4 overflow-x-auto">
        {[
          { id: 'All', label: 'All', count: counts.All },
          { id: 'Applied', label: 'Applied', count: counts.Applied || hiringProgress.applied },
          { id: 'Under Review', label: 'Under Review', count: counts.UnderReview || hiringProgress.underReview },
          { id: 'Shortlisted', label: 'Shortlisted', count: counts.Shortlisted || hiringProgress.shortlisted },
          { id: 'Interview', label: 'Interview', count: counts.Interview || hiringProgress.interview },
          { id: 'Selected', label: 'Selected', count: counts.Selected || hiringProgress.selected },
          { id: 'Rejected', label: 'Rejected', count: counts.Rejected }
        ].map((tab) => {
          const isActive = activeTabStatus === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabStatus(tab.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                isActive 
                  ? 'bg-brand-blue text-white shadow-md' 
                  : 'bg-app-surface text-app-muted hover:text-app-text border border-app-border'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                isActive ? 'bg-white text-brand-blue' : 'bg-app-bg text-app-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and research block */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-app-surface border border-app-border card-shadow flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Job Filter */}
          <div className="relative">
            <select 
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-app-bg border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">All Jobs</option>
              {uniqueRoles.map((role, rIdx) => (
                <option key={rIdx} value={role}>{role}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-app-bg border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map((dept, dIdx) => (
                <option key={dIdx} value={dept}>{dept}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="rounded-3xl bg-app-surface border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/60 bg-app-surface text-xs font-bold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Job</th>
                <th className="py-4 px-6">Applied Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-xs font-bold text-app-text">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-app-bg/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold shrink-0">
                        {app.candidateName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-extrabold text-app-text">{app.candidateName}</div>
                        <div className="text-[10px] text-app-muted font-normal">Candidate Reference: APP{app.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-extrabold text-app-text">{app.role}</div>
                      <div className="text-[10px] text-app-muted font-medium mt-0.5">{app.dept} Division</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-app-muted font-semibold">
                    {app.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                      app.status === 'Selected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      app.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                      app.status === 'Interview' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      app.status === 'Under Review' ? 'bg-violet-500/10 border-violet-500/20 text-violet-500' :
                      app.status === 'Shortlisted' ? 'bg-pink-500/10 border-pink-500/20 text-pink-500' :
                      'bg-brand-blue/10 border-brand-blue/20 text-brand-blue'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button 
                      onClick={() => {
                        onSelectCandidate(app.id);
                        onNavigate('candidates');
                      }}
                      className="p-2 bg-app-bg hover:bg-brand-blue hover:text-white rounded-xl border border-app-border text-app-muted hover:border-brand-blue transition-all cursor-pointer inline-flex items-center justify-center shadow-sm"
                      title="View Candidate Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info/pagination mockup */}
        <div className="p-4 bg-app-bg/40 border-t border-app-border/40 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-bold text-app-muted">
          <span>Showing 1 to {filteredApps.length} of {filteredApps.length} candidates</span>
          <div className="flex items-center gap-1.5">
            <button className="px-2.5 py-1.5 bg-app-surface hover:bg-app-bg rounded-lg border border-app-border transition-all cursor-pointer">
              Previous
            </button>
            <button className="px-3.5 py-1.5 bg-brand-blue text-white rounded-lg transition-all">
              1
            </button>
            <button className="px-2.5 py-1.5 bg-app-surface hover:bg-app-bg rounded-lg border border-app-border transition-all cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
