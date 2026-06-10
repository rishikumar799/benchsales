import React from 'react';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Plus, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Zap, 
  Award, 
  ArrowRight,
  PieChart,
  Target
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onCreateJobClick: () => void;
}

export default function DashboardTab({ onNavigate, onCreateJobClick }: DashboardTabProps) {
  
  // Simulated stats matching image 1
  const stats = [
    { label: 'Active Jobs', value: '24', desc: 'View all jobs', color: 'text-blue-500', target: 'jobs' },
    { label: 'Open Positions', value: '138', desc: 'Across all jobs', color: 'text-violet-500', target: 'jobs' },
    { label: 'Recruiters Working', value: '16', desc: 'On active jobs', color: 'text-emerald-500', target: 'recruiters' },
    { label: 'Candidate Submissions', value: '247', desc: 'Total submissions', color: 'text-amber-500', target: 'submissions' },
  ];

  // Recent jobs matching image 1
  const recentJobs = [
    { id: '1', title: 'Frontend Developer', company: 'ABC Technologies', openings: '15 Positions', status: 'Active' },
    { id: '2', title: 'Java Developer', company: 'Infosoft', openings: '8 Positions', status: 'Active' },
    { id: '3', title: 'QA Engineer', company: 'X Corp', openings: '6 Positions', status: 'Active' },
    { id: '4', title: 'DevOps Engineer', company: 'CloudNet Solutions', openings: '10 Positions', status: 'Active' },
  ];

  // Recruiter Activity list matching image 1
  const recruiterActivity = [
    { id: '1', name: 'Rahul Singh', activeJobs: 4, submissions: 18, img: 'https://picsum.photos/seed/rahul/100/100' },
    { id: '2', name: 'Priya Sharma', activeJobs: 3, submissions: 12, img: 'https://picsum.photos/seed/priya/100/100' },
    { id: '3', name: 'Akash Verma', activeJobs: 5, submissions: 22, img: 'https://picsum.photos/seed/akash/100/100' },
    { id: '4', name: 'Neha Patel', activeJobs: 2, submissions: 8, img: 'https://picsum.photos/seed/neha/100/100' },
    { id: '5', name: 'Karthik Nair', activeJobs: 3, submissions: 14, img: 'https://picsum.photos/seed/karthik/100/100' },
  ];

  // Recent submissions matching image 1
  const recentSubmissions = [
    { id: 's1', candidate: 'Ravi Kumar', recruiter: 'Rahul Singh', job: 'Frontend Developer', date: '10 Jun 2026' },
    { id: 's2', candidate: 'Priya Sharma', recruiter: 'Akash Verma', job: 'Java Developer', date: '10 Jun 2026' },
    { id: 's3', candidate: 'Aman Gupta', recruiter: 'Priya Sharma', job: 'QA Engineer', date: '09 Jun 2026' },
  ];

  // Insights matching image 1
  const Insights = [
    { icon: Target, label: 'Most Active Job', value: 'Frontend Developer', desc: '18 submittals' },
    { icon: Zap, label: 'Most Requested Skill', value: 'React.js', desc: '72 mentions' },
    { icon: Award, label: 'Top Recruiter', value: 'Rahul Singh', desc: '18 submissions' },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-app-text">
      
      {/* 1. Header with details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Dashboard</h1>
          <p className="text-app-muted mt-1">Welcome back, Rohit! Here's what's happening in your marketplace.</p>
        </div>
      </div>

      {/* 2. Hero Action Banner */}
      <div className="p-6 md:p-8 rounded-[32px] premium-gradient text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            BDM Control Center
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-2">Marketplace Hiring Workspace</h2>
          <p className="text-white/85 text-sm leading-relaxed">
            Create and manage job requirements for recruiters across the marketplace and monitor hiring pipeline fill rates.
          </p>
        </div>
        <button 
          onClick={onCreateJobClick} 
          className="relative z-10 px-6 py-3.5 bg-white text-brand-blue font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl shrink-0"
        >
          <Plus className="w-4 h-4 text-brand-blue stroke-[3px]" /> Create New Job
        </button>
        {/* Abstract design elements */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-violet/20 blur-3xl rounded-full" />
      </div>

      {/* 3. Stat Metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, idx) => (
          <button 
            key={idx}
            onClick={() => onNavigate(st.target)}
            className="p-6 rounded-[28px] glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group card-shadow cursor-pointer flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-app-muted">{st.label}</span>
              <div className={`text-3.5xl font-display font-black mt-2 ${st.color}`}>{st.value}</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-app-border/40 w-full">
              <span className="text-xs font-semibold text-app-muted group-hover:text-app-text transition-colors">{st.desc}</span>
              <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-app-text group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* 4. Middle Layout: Recent Jobs & Recruiter Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Recent Jobs */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Recent Jobs</h3>
              <button 
                onClick={() => onNavigate('jobs')} 
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View All Jobs
              </button>
            </div>
            <div className="space-y-4">
              {recentJobs.map((j) => (
                <div key={j.id} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-app-text">{j.title}</h4>
                      <p className="text-xs text-app-muted mt-0.5 font-semibold">{j.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                      {j.openings}
                    </span>
                    <span className="ml-2 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/15">
                      {j.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('jobs')} 
            className="w-full text-center py-3 border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-2xl mt-6 transition-all"
          >
            Manage Active Sourcing Requirements →
          </button>
        </div>

        {/* Right column: Recruiter Activity */}
        <div className="lg:col-span-7 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Recruiter Activity</h3>
              <button 
                onClick={() => onNavigate('recruiters')} 
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-3 px-2">Recruiter</th>
                    <th className="py-3 px-2 text-center">Active Jobs</th>
                    <th className="py-3 px-2 text-right">Submissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-xs">
                  {recruiterActivity.map((r) => (
                    <tr key={r.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={r.img} 
                            alt={r.name} 
                            className="w-8 h-8 rounded-full object-cover border border-app-border" 
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-bold text-app-text">{r.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-extrabold text-app-text">{r.activeJobs}</td>
                      <td className="py-3 px-2 text-right font-extrabold text-brand-blue">{r.submissions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('recruiters')} 
            className="w-full text-center py-3 bg-app-bg hover:bg-app-surface text-xs font-bold text-brand-blue border border-app-border rounded-2xl mt-6 transition-all"
          >
            Review Marketplace Sourcing Partners
          </button>
        </div>

      </div>

      {/* 5. Bottom Rows Layout: Recent Submissions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Recent Submissions */}
        <div className="lg:col-span-8 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Recent Submissions</h3>
              <button 
                onClick={() => onNavigate('submissions')} 
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View All Submissions
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-3 px-2">Candidate</th>
                    <th className="py-3 px-2">Recruiter</th>
                    <th className="py-3 px-2">Job</th>
                    <th className="py-3 px-2 text-right">Submitted On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-xs">
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4.5 px-2 font-bold text-app-text">{sub.candidate}</td>
                      <td className="py-4.5 px-2 font-semibold text-app-muted">{sub.recruiter}</td>
                      <td className="py-4.5 px-2 font-mono font-bold text-brand-purple">{sub.job}</td>
                      <td className="py-4.5 px-2 text-right font-semibold text-app-muted font-mono">{sub.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Marketplace Insights */}
        <div className="lg:col-span-4 p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 border border-brand-violet/20 card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-6">Marketplace Insights</h3>
            <div className="space-y-6">
              {Insights.map((ins, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-app-surface rounded-xl flex items-center justify-center shadow-md shrink-0">
                    <ins.icon className="w-5 h-5 text-brand-violet" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">{ins.label}</span>
                    <span className="font-bold text-sm text-app-text mt-0.5 block">{ins.value}</span>
                    <span className="text-xs text-app-muted">{ins.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('analytics')} 
            className="w-full mt-6 py-3.5 bg-brand-violet text-white text-xs font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-violet/15"
          >
            Open Market Intelligence Reports
          </button>
        </div>

      </div>

    </div>
  );
}
