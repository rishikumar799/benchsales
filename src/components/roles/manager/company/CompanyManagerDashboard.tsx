import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Search,
  UserCheck, 
  Building,
  UserPlus,
  X
} from 'lucide-react';

interface CompanyManagerDashboardProps {
  onNavigate: (tab: string) => void;
  onCreateJobClick: () => void;
}

export default function CompanyManagerDashboard({ onNavigate, onCreateJobClick }: CompanyManagerDashboardProps) {
  
  const [selectedRecruiter, setSelectedRecruiter] = useState<any | null>(null);

  // Real stats matching the top-left screenshot - updated target to placements for Submissions Received
  const stats = [
    { label: 'Active Jobs', value: '24', trend: '↑ 4 from last week', target: 'jobs', color: 'text-blue-500' },
    { label: 'Open Positions', value: '86', trend: '↑ 6 from last week', target: 'jobs', color: 'text-emerald-500' },
    { label: 'Recruiters Assigned', value: '8', trend: '↑ 1 from last week', target: 'recruiters', color: 'text-violet-500' },
    { label: 'Submissions Received', value: '1,246', trend: '↑ 18% from last week', target: 'placements', color: 'text-amber-500' },
  ];

  // Jobs list matching the table in the screenshot
  const jobsOverview = [
    { title: 'Senior Software Engineer', dept: 'Engineering', applications: 82, openings: 4, recruiters: 2, status: 'Active' },
    { title: 'Cloud Engineer', dept: 'Engineering', applications: 41, openings: 2, recruiters: 1, status: 'Active' },
    { title: 'Tech Lead', dept: 'Engineering', applications: 26, openings: 1, recruiters: 1, status: 'Active' },
    { title: 'Data Scientist', dept: 'Data Science', applications: 18, openings: 2, recruiters: 2, status: 'Active' },
    { title: 'Product Manager', dept: 'Product', applications: 15, openings: 1, recruiters: 1, status: 'Draft' },
  ];

  // Recruiter activity with detailed metrics for popup & card display
  const recruiterActivity = [
    { 
      name: 'Priya Sharma', 
      activeJobs: 4, 
      submissions: 248, 
      interviews: 26, 
      hires: 8, 
      avatar: 'https://picsum.photos/seed/priya/100/100',
      email: 'priya.sharma@company.com',
      dept: 'Engineering Dept.',
      lastActive: '2 hrs ago',
      shortlisted: 54,
      assignedJobs: ['Senior Software Engineer', 'Cloud Engineer', 'Tech Lead', 'Data Scientist']
    },
    { 
      name: 'Rahul Verma', 
      activeJobs: 3, 
      submissions: 186, 
      interviews: 18, 
      hires: 6, 
      avatar: 'https://picsum.photos/seed/rahulv/100/100',
      email: 'rahul.verma@company.com',
      dept: 'Infrastructure Dept.',
      lastActive: '4 hrs ago',
      shortlisted: 36,
      assignedJobs: ['Senior Software Engineer', 'Cloud Engineer', 'DevOps Engineer']
    },
    { 
      name: 'Neha Patel', 
      activeJobs: 5, 
      submissions: 310, 
      interviews: 30, 
      hires: 9, 
      avatar: 'https://picsum.photos/seed/nehap/100/100',
      email: 'neha.patel@company.com',
      dept: 'Engineering Dept.',
      lastActive: 'Just now',
      shortlisted: 68,
      assignedJobs: ['Senior Software Engineer', 'Tech Lead', 'Data Scientist', 'DevOps Engineer']
    },
  ];

  // Recent submissions matching the right bottom card in the screenshot
  const recentApplications = [
    { candidate: 'Rahul Kumar', role: 'Senior Software Engineer', recruiter: 'Priya Sharma', date: 'Today', status: 'Applied', statusColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { candidate: 'Anjali Sharma', role: 'Cloud Engineer', recruiter: 'Rahul Verma', date: 'Today', status: 'Shortlisted', statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { candidate: 'Vikram Patel', role: 'Tech Lead', recruiter: 'Neha Patel', date: 'Yesterday', status: 'Under Review', statusColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  ];

  // Hiring Summary cards at the bottom matching the screenshot
  const hiringStages = [
    { label: 'Submissions', value: '1,246', bgColor: 'bg-blue-500/10', textColor: 'text-blue-500', borderColor: 'border-blue-500/25' },
    { label: 'Under Review', value: '382', bgColor: 'bg-amber-500/10', textColor: 'text-amber-500', borderColor: 'border-amber-500/25' },
    { label: 'Shortlisted', value: '188', bgColor: 'bg-teal-500/10', textColor: 'text-teal-500', borderColor: 'border-teal-500/25' },
    { label: 'Interview', value: '94', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-500', borderColor: 'border-indigo-500/25' },
    { label: 'Selected / Hired', value: '28', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-500', borderColor: 'border-emerald-500/25' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* 1. Welcoming Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Dashboard</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Welcome back, Amit Verma! Manage your hiring operations and team performance.</p>
        </div>
      </div>

      {/* 2. Hero Action Banner: Workforce Hiring Command Center */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
            Workforce Hiring Command Center
          </span>
          <h2 className="text-2xl md:text-3.5xl font-display font-black tracking-tight mt-3 mb-2">Grow and Manage Your Teams</h2>
          <p className="text-white/85 text-sm leading-relaxed font-medium">
            Manage hiring requirements, recruiter activity and workforce growth across your organization.
          </p>
          <button 
            onClick={onCreateJobClick} 
            className="mt-4 px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3px]" /> Create Job Requisition
          </button>
        </div>
        
        {/* Right side vector-like recruiting visualization */}
        <div className="relative z-10 hidden lg:flex items-center justify-center p-4">
          <div className="relative w-64 h-40 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 p-4 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Building className="w-5 h-5 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">ARYX AI ORG</span>
            </div>
            <div className="space-y-2 py-3">
              <div className="flex items-center justify-between text-[10px] text-white/80">
                <span>Active Funnel</span>
                <span className="font-mono text-emerald-300">1,246 Submissions</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '74%' }} />
              </div>
            </div>
            <div className="flex justify-between items-center text-[10px] text-white/60">
              <span>8 Active Recruiters</span>
              <span>24 Open Reqs</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-violet-500/30 blur-3xl rounded-full" />
      </div>

      {/* 3. Stats Rows with Weekly Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, idx) => (
          <button 
            key={idx}
            onClick={() => onNavigate(st.target)}
            className="p-6 rounded-[28px] glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group card-shadow cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-app-muted">{st.label}</span>
              <div className={`text-4xl font-display font-black mt-2 tracking-tight ${st.color}`}>{st.value}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-app-border/40 w-full">
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-xl">{st.trend}</span>
              <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-text group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* 4. Job Overview Table */}
      <div className="p-6 rounded-[32px] glass border border-app-border card-shadow">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-display font-black text-lg text-app-text tracking-tight">Job Overview</h3>
            <p className="text-app-muted text-xs font-medium">Quick overview of current requisition funnels and open positions.</p>
          </div>
          <button 
            onClick={() => onNavigate('jobs')} 
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
          >
            View all jobs
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/60 text-app-muted text-[11px] font-extrabold uppercase tracking-wider">
                <th className="pb-3 pl-4">Job Title</th>
                <th className="pb-3">Department</th>
                <th className="pb-3 text-center">Submissions</th>
                <th className="pb-3 text-center">Openings</th>
                <th className="pb-3 text-center">Recruiters</th>
                <th className="pb-3 text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {jobsOverview.map((job, idx) => (
                <tr key={idx} className="border-b border-app-border/40 hover:bg-app-surface/30 transition-colors">
                  <td className="py-3.5 pl-4 font-bold text-sm text-app-text">{job.title}</td>
                  <td className="py-3.5 text-sm font-semibold text-app-muted">{job.dept}</td>
                  <td className="py-3.5 text-sm font-extrabold text-center text-app-text">{job.applications}</td>
                  <td className="py-3.5 text-sm font-extrabold text-center text-app-text">{job.openings}</td>
                  <td className="py-3.5 text-sm font-bold text-center text-brand-violet">{job.recruiters} Assigned</td>
                  <td className="py-3.5 text-right pr-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      job.status === 'Active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-app-surface border-app-border text-app-muted'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Left/Right Cards: Recruiter Activity & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Recruiter Activity */}
        <div className="p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-black text-lg text-app-text tracking-tight">Recruiter Activity</h3>
                <p className="text-app-muted text-xs font-medium">Top recruiters active on company briefs.</p>
              </div>
              <button 
                onClick={() => onNavigate('recruiters')} 
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View all recruiters
              </button>
            </div>
            <div className="space-y-4">
              {recruiterActivity.map((rec, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedRecruiter(rec)}
                  className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-brand-blue/30 hover:scale-[1.01] transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={rec.avatar} alt={rec.name} className="w-10 h-10 rounded-full object-cover border border-app-border" />
                    <div>
                      <h4 className="font-bold text-sm text-app-text">{rec.name}</h4>
                      <p className="text-xs text-app-muted mt-0.5 font-medium">Sourcing Specialist</p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-bold text-app-text space-y-1">
                    <div className="flex gap-2 justify-end">
                      <span className="text-brand-blue">{rec.submissions} Submissions</span>
                      <span className="text-app-muted">•</span>
                      <span className="text-brand-violet">{rec.interviews} Interviews</span>
                    </div>
                    <div className="flex gap-2 justify-end text-[10px] text-app-muted">
                      <span>{rec.activeJobs} Active Jobs</span>
                      <span>•</span>
                      <span className="text-emerald-500">{rec.hires} Hires</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Submissions */}
        <div className="p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-black text-lg text-app-text tracking-tight">Recent Submissions</h3>
                <p className="text-app-muted text-xs font-medium">New recruiter submissions on active requirements today.</p>
              </div>
              <button 
                onClick={() => onNavigate('placements')} 
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View all submissions
              </button>
            </div>
            <div className="space-y-4">
              {recentApplications.map((app, i) => (
                <div key={i} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between gap-4">
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-app-text truncate">{app.candidate}</h4>
                    <p className="text-xs text-app-muted mt-0.5 truncate font-semibold">{app.role} • <span className="text-brand-violet">{app.recruiter}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${app.statusColor}`}>
                      {app.status}
                    </span>
                    <div className="text-[10px] text-app-muted mt-1.5 font-bold">{app.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 6. Hiring Summary Distribution Banner */}
      <div className="p-6 rounded-[32px] glass border border-app-border card-shadow">
        <h3 className="font-display font-black text-base text-app-text tracking-tight mb-4">Hiring Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {hiringStages.map((stage, sIdx) => (
            <div key={sIdx} className={`p-5 rounded-2xl border ${stage.borderColor} ${stage.bgColor} text-center`}>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">{stage.label}</span>
              <div className={`text-2xl font-display font-black mt-1.5 ${stage.textColor}`}>{stage.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter Details Popup Modal */}
      {selectedRecruiter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-app-bg border border-app-border rounded-[32px] max-w-xl w-full p-6 sm:p-8 card-shadow space-y-6">
            <div className="flex justify-between items-center border-b border-app-border/60 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedRecruiter.avatar} alt={selectedRecruiter.name} className="w-12 h-12 rounded-full border border-app-border object-cover" />
                <div>
                  <h3 className="font-display font-black text-lg text-app-text">{selectedRecruiter.name}</h3>
                  <div className="text-xs text-app-muted font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded text-[10px] font-extrabold">{selectedRecruiter.dept}</span>
                    <span>•</span>
                    <span className="text-app-muted font-normal">Last active: {selectedRecruiter.lastActive}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecruiter(null)}
                className="p-1.5 border border-app-border hover:bg-app-surface rounded-lg text-app-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Jobs</div>
                <div className="text-lg font-black text-blue-500 mt-1">{selectedRecruiter.activeJobs}</div>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase font-sans">Submissions</div>
                <div className="text-lg font-black text-emerald-500 mt-1">{selectedRecruiter.submissions}</div>
              </div>
              <div className="p-3 bg-violet-500/5 rounded-xl border border-violet-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Shortlisted</div>
                <div className="text-lg font-black text-violet-500 mt-1">{selectedRecruiter.shortlisted}</div>
              </div>
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Hires</div>
                <div className="text-lg font-black text-amber-500 mt-1">{selectedRecruiter.hires}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-app-muted">Assigned Requirements</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecruiter.assignedJobs.map((jobName: string, jIdx: number) => (
                  <span key={jIdx} className="bg-app-surface border border-app-border text-app-text px-3 py-1.5 rounded-xl text-xs font-bold">
                    {jobName}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-blue/5 to-indigo-500/5 border border-brand-blue/15 space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-blue">Performance Analytics</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-app-text pt-1">
                <div>
                  <span className="text-app-muted font-normal block">Interview Conversion Rate</span>
                  <span>{Math.round((selectedRecruiter.interviews / selectedRecruiter.submissions) * 100)}%</span>
                </div>
                <div>
                  <span className="text-app-muted font-normal block">Hiring Success Ratio</span>
                  <span>{Math.round((selectedRecruiter.hires / selectedRecruiter.interviews) * 100)}%</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedRecruiter(null)}
              className="w-full py-3 bg-app-surface border border-app-border hover:bg-app-surface/80 rounded-xl text-xs font-extrabold text-app-text cursor-pointer"
            >
              Close Recruiter Profile
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
