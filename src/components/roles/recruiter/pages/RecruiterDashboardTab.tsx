import { 
  Briefcase, 
  Users, 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  TrendingUp, 
  Plus, 
  Activity,
  Award,
  ShieldAlert
} from 'lucide-react';

interface RecruiterDashboardTabProps {
  onNavigate: (tab: string) => void;
  onSelectCandidate: (candidateId: string) => void;
  stats: {
    activeJobs: number;
    totalCandidates: number;
    applications: number;
    openPositions: number;
  };
  activeJobsList: Array<{
    id: string;
    title: string;
    dept: string;
    location: string;
    applicationsCount: number;
    openings: number;
    status: string;
  }>;
  recentApplications: Array<{
    id: string;
    candidateName: string;
    role: string;
    date: string;
    status: string;
  }>;
  hiringProgress: {
    applied: number;
    underReview: number;
    shortlisted: number;
    interview: number;
    selected: number;
  };
}

export default function RecruiterDashboardTab({
  onNavigate,
  onSelectCandidate,
  stats,
  activeJobsList,
  recentApplications,
  hiringProgress
}: RecruiterDashboardTabProps) {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      
      {/* Top Banner (Recruitment Operations Center) */}
      <div className="relative p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-brand-blue to-indigo-600 text-white overflow-hidden shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300">
        <div className="relative z-10 max-w-lg space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md rounded-full text-white">
            <Activity className="w-3 h-3 text-emerald-300 animate-pulse" /> Active Session
          </span>
          <h1 className="text-2xl md:text-3xl font-display font-black tracking-tight text-white leading-tight">
            Recruitment Operations Center
          </h1>
          <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed">
            Manage hiring activities and candidate pipelines across company opportunities. Seamlessly track applications and optimize transitions.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => onNavigate('applications')}
              className="px-5 py-2.5 bg-white text-brand-blue font-bold text-xs rounded-xl hover:bg-opacity-95 transform active:scale-95 transition-all shadow-md active:shadow-sm flex items-center gap-2 cursor-pointer"
            >
              Review Submissions <ArrowRight className="w-4 h-4 text-brand-blue" />
            </button>
          </div>
        </div>
        {/* Abstract vector shape mimicking screenshot illustration */}
        <div className="absolute right-6 bottom-4 md:right-12 md:bottom-6 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute right-0 top-0 w-72 h-full opacity-15 bg-gradient-to-b from-transparent to-white/40 skew-x-12 pointer-events-none" />
      </div>

      {/* KPI Stats Row (matching screenshot perfectly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Briefcase, label: 'Active Jobs', value: stats.activeJobs.toString(), change: '+3 from last week', color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { icon: Users, label: 'Total Candidates', value: stats.totalCandidates.toString(), change: '+18 from last week', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: FileText, label: 'Submissions', value: stats.applications.toString(), change: '+56 from last week', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { icon: CheckSquare, label: 'Open Positions', value: stats.openPositions.toString(), change: '+5 from last week', color: 'text-amber-500', bg: 'bg-amber-500/10' }
        ].map((st, idx) => (
          <div key={idx} className="p-5 md:p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex items-start justify-between hover:border-brand-blue/30 transition-all duration-200">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider">{st.label}</span>
              <div className="text-3xl font-display font-black text-app-text">{st.value}</div>
              <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {st.change}
              </div>
            </div>
            <div className={`p-3 rounded-2xl ${st.bg} ${st.color}`}>
              <st.icon className="w-5.5 h-5.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Grid below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Active Jobs Box (Left column, span 6) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-black text-app-text">Active Jobs</h3>
            <button 
              onClick={() => onNavigate('jobs')}
              className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5">
            {activeJobsList.slice(0, 4).map((job) => (
              <div key={job.id} className="p-4 rounded-2xl bg-app-bg border border-app-border hover:border-brand-blue/30 transition-all flex items-center justify-between gap-4">
                <div className="truncate">
                  <div className="text-xs font-extrabold text-app-text truncate">{job.title}</div>
                  <div className="text-[10px] text-app-muted font-bold mt-1">
                    {job.dept} • {job.location}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-black text-app-text">{job.applicationsCount}</div>
                    <div className="text-[9px] text-app-muted font-bold">Applications</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-app-text">{job.openings}</div>
                    <div className="text-[9px] text-app-muted font-bold">Openings</div>
                  </div>
                  <span className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions Box (Right column, span 6) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-black text-app-text">Recent Submissions</h3>
            <button 
              onClick={() => onNavigate('applications')}
              className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          <div className="space-y-3.5">
            {recentApplications.slice(0, 4).map((app) => (
              <div 
                key={app.id} 
                className="p-4 rounded-2xl bg-app-bg border border-app-border hover:border-brand-blue/30 transition-all flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => {
                  onSelectCandidate(app.id);
                  onNavigate('candidates');
                }}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue font-black tracking-tighter text-xs">
                    {app.candidateName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-extrabold text-app-text hover:text-brand-blue transition-colors truncate">{app.candidateName}</div>
                    <div className="text-[10px] text-app-muted font-bold mt-1">{app.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-app-muted font-bold">{app.date}</span>
                  <span className={`text-[9px] font-bold border px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    app.status === 'Applied' ? 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue' :
                    app.status === 'Shortlisted' ? 'bg-violet-500/10 border-violet-500/20 text-violet-500' :
                    app.status === 'Interview' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Hiring Progress Segment */}
      <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-black text-app-text">Hiring Progress</h3>
            <p className="text-xs font-semibold text-app-muted mt-0.5">Pipeline status breakdown of active job candidatures.</p>
          </div>
          <button 
            onClick={() => onNavigate('pipeline')}
            className="px-4 py-2 bg-app-bg border border-app-border hover:border-brand-blue/35 transition-all text-xs font-bold text-app-text hover:text-brand-blue rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            View pipeline
          </button>
        </div>

        {/* 5 columns resembling progress milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Applied', count: hiringProgress.applied, progress: 100, color: 'text-brand-blue', bar: 'bg-brand-blue' },
            { label: 'Under Review', count: hiringProgress.underReview, progress: 65, color: 'text-violet-500', bar: 'bg-violet-500' },
            { label: 'Shortlisted', count: hiringProgress.shortlisted, progress: 42, color: 'text-pink-500', bar: 'bg-pink-500' },
            { label: 'Interview', count: hiringProgress.interview, progress: 18, color: 'text-amber-500', bar: 'bg-amber-500' },
            { label: 'Selected', count: hiringProgress.selected, progress: 8, color: 'text-emerald-500', bar: 'bg-emerald-500' }
          ].map((prog, index) => (
            <div key={index} className="p-4 rounded-2xl bg-app-bg border border-app-border flex flex-col justify-between hover:border-brand-blue/20 transition-all">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">{prog.label}</span>
              <div className={`text-2xl font-display font-black ${prog.color} mt-2`}>
                {prog.count}
              </div>
              <div className="mt-4 w-full h-1 bg-app-border rounded-full overflow-hidden">
                <div className={`h-full ${prog.bar}`} style={{ width: `${prog.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
