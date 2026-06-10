import React from 'react';
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
  UserPlus
} from 'lucide-react';

interface CompanyManagerDashboardProps {
  onNavigate: (tab: string) => void;
  onCreateJobClick: () => void;
}

export default function CompanyManagerDashboard({ onNavigate, onCreateJobClick }: CompanyManagerDashboardProps) {
  
  // Real stats matching the top-left screenshot
  const stats = [
    { label: 'Active Jobs', value: '24', trend: '↑ 4 from last week', target: 'jobs', color: 'text-blue-500' },
    { label: 'Open Positions', value: '86', trend: '↑ 6 from last week', target: 'jobs', color: 'text-emerald-500' },
    { label: 'Recruiters Assigned', value: '8', trend: '↑ 1 from last week', target: 'recruiters', color: 'text-violet-500' },
    { label: 'Applications Received', value: '1,246', trend: '↑ 18% from last week', target: 'applications', color: 'text-amber-500' },
  ];

  // Jobs list matching the table in the screenshot
  const jobsOverview = [
    { title: 'Senior Software Engineer', dept: 'Engineering', applications: 82, openings: 4, recruiters: 2, status: 'Active' },
    { title: 'Cloud Engineer', dept: 'Engineering', applications: 41, openings: 2, recruiters: 1, status: 'Active' },
    { title: 'Tech Lead', dept: 'Engineering', applications: 26, openings: 1, recruiters: 1, status: 'Active' },
    { title: 'Data Scientist', dept: 'Data Science', applications: 18, openings: 2, recruiters: 2, status: 'Active' },
    { title: 'Product Manager', dept: 'Product', applications: 15, openings: 1, recruiters: 1, status: 'Draft' },
  ];

  // Recruiter activity matching the left bottom card in the screenshot
  const recruiterActivity = [
    { name: 'Priya Sharma', activeJobs: 4, applications: 248, avatar: 'https://picsum.photos/seed/priya/100/100' },
    { name: 'Rahul Verma', activeJobs: 3, applications: 186, avatar: 'https://picsum.photos/seed/rahulv/100/100' },
    { name: 'Neha Patel', activeJobs: 5, applications: 310, avatar: 'https://picsum.photos/seed/nehap/100/100' },
  ];

  // Recent applications matching the right bottom card in the screenshot
  const recentApplications = [
    { candidate: 'Rahul Kumar', role: 'Senior Software Engineer', recruiter: 'Priya Sharma', date: 'Today', status: 'Applied', statusColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { candidate: 'Anjali Sharma', role: 'Cloud Engineer', recruiter: 'Rahul Verma', date: 'Today', status: 'Shortlisted', statusColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { candidate: 'Vikram Patel', role: 'Tech Lead', recruiter: 'Neha Patel', date: 'Yesterday', status: 'Under Review', statusColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  ];

  // Hiring Summary cards at the bottom matching the screenshot
  const hiringStages = [
    { label: 'Applied', value: '1,246', bgColor: 'bg-blue-500/10', textColor: 'text-blue-500', borderColor: 'border-blue-500/25' },
    { label: 'Under Review', value: '382', bgColor: 'bg-amber-500/10', textColor: 'text-amber-500', borderColor: 'border-amber-500/25' },
    { label: 'Shortlisted', value: '188', bgColor: 'bg-teal-500/10', textColor: 'text-teal-500', borderColor: 'border-teal-500/25' },
    { label: 'Interview', value: '94', bgColor: 'bg-indigo-500/10', textColor: 'text-indigo-500', borderColor: 'border-indigo-500/25' },
    { label: 'Selected', value: '28', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-500', borderColor: 'border-emerald-500/25' },
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
            className="mt-4 px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md shrink-0"
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
                <span className="font-mono text-emerald-300">1,246 Applicants</span>
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
            className="text-xs font-bold text-brand-blue hover:underline flex items-center gap-1"
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
                <th className="pb-3 text-center">Applications</th>
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

      {/* 5. Left/Right Cards: Recruiter Activity & Recent Applications */}
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
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                View all recruiters
              </button>
            </div>
            <div className="space-y-4">
              {recruiterActivity.map((rec, i) => (
                <div key={i} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={rec.avatar} alt={rec.name} className="w-10 h-10 rounded-full object-cover border border-app-border" />
                    <div>
                      <h4 className="font-bold text-sm text-app-text">{rec.name}</h4>
                      <p className="text-xs text-app-muted mt-0.5 font-medium">Sourcing Specialist</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-app-text">{rec.activeJobs} Active Jobs</div>
                    <div className="text-xs text-brand-blue mt-0.5 font-bold">{rec.applications} Applications</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Recent Applications */}
        <div className="p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display font-black text-lg text-app-text tracking-tight">Recent Applications</h3>
                <p className="text-app-muted text-xs font-medium">New candidates entering your talent stream today.</p>
              </div>
              <button 
                onClick={() => onNavigate('applications')} 
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                View all applications
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

    </div>
  );
}
