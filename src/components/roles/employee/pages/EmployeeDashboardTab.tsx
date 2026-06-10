import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Zap, 
  FileText, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface EmployeeDashboardTabProps {
  onNavigate: (tabId: string) => void;
  onApplyJob?: (jobTitle: string, company: string) => void;
}

export default function EmployeeDashboardTab({ onNavigate, onApplyJob }: EmployeeDashboardTabProps) {
  const stats = [
    { label: 'Available Opportunities', value: '18', actionText: 'View all', tab: 'opportunities', color: 'text-violet-500' },
    { label: 'Applications Submitted', value: '6', actionText: 'View all', tab: 'applications', color: 'text-emerald-500' },
    { label: 'Uploaded Documents', value: '4', actionText: 'View all', tab: 'documents', color: 'text-amber-500' },
    { label: 'Profile Completion', value: '92%', actionText: 'Complete', tab: 'profile', color: 'text-blue-500' }
  ];

  const featuredJobs = [
    { id: '1', role: 'Senior Software Engineer', team: 'Engineering Team', type: 'Internal Mobility', location: 'Hyderabad', exp: '4+ Years', category: 'internal' },
    { id: '2', role: 'Cloud Engineer', team: 'Infrastructure Team', type: 'Internal Transfer', location: 'Bangalore', exp: '3+ Years', category: 'transfer' },
    { id: '3', role: 'Tech Lead', team: 'Platform Team', type: 'Internal Mobility', location: 'Hyderabad', exp: '5+ Years', category: 'internal' }
  ];

  const recentApps = [
    { role: 'Senior Software Engineer', team: 'Engineering Team', status: 'Applied', statusColor: 'emerald' },
    { role: 'Cloud Engineer', team: 'Infrastructure Team', status: 'Under Review', statusColor: 'amber' },
    { role: 'Tech Lead', team: 'Platform Team', status: 'Shortlisted', statusColor: 'violet' }
  ];

  const handleApply = (jobTitle: string) => {
    if (onApplyJob) {
      onApplyJob(jobTitle, 'Internal Platform');
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* 1. Welcoming Header banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-[32px] premium-gradient text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-3.5 z-10">
          <span className="text-xs bg-white/20 text-white font-extrabold uppercase px-3 py-1 rounded-full border border-white/10 tracking-widest">
            Internal Career Portal
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-black leading-tight tracking-tight">
            Discover internal opportunities and advance your career within the organization.
          </h2>
          <div className="flex flex-wrap gap-3 pt-1">
            <button 
              onClick={() => onNavigate('opportunities')}
              className="px-5 py-2.5 bg-white text-brand-blue font-bold rounded-2xl text-xs hover:bg-neutral-100 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Explore Opportunities <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => onNavigate('resume_builder')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Update Resume
            </button>
          </div>
        </div>

        {/* Dynamic Abstract Mascot Widget */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-[28px] shrink-0 flex items-center justify-center p-2 backdrop-blur-md border border-white/10 shadow-inner">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            <rect x="35" y="45" width="130" height="110" rx="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="45" y="55" width="110" height="85" rx="30" fill="#090E1A" />
            <circle cx="75" cy="90" r="10" fill="#3B82F6" />
            <circle cx="75" cy="90" r="4" fill="#00E5FF" />
            <circle cx="125" cy="90" r="10" fill="#3B82F6" />
            <circle cx="125" cy="90" r="4" fill="#00E5FF" />
            <path d="M 80,122 C 90,130 110,130 120,122" stroke="#00E5FF" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="95" y="25" width="10" height="20" fill="#94A3B8" />
            <circle cx="100" cy="20" r="8" fill="#F43F5E" />
          </svg>
        </div>
      </motion.div>

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between hover:border-brand-blue/30 transition-all group"
          >
            <div>
              <span className="text-xs font-bold text-app-muted uppercase tracking-widest block leading-tight">{st.label}</span>
              <span className="text-3xl font-display font-black text-app-text block mt-3 leading-none h-9">{st.value}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-app-border/40 flex items-center justify-between">
              {st.label === 'Profile Completion' ? (
                <div className="flex-1 mr-4">
                  <div className="w-full h-1.5 bg-app-bg border border-app-border rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              ) : null}
              <button 
                onClick={() => onNavigate(st.tab)}
                className="text-xs font-extrabold text-brand-blue hover:text-brand-violet transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{st.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. Outer Bento columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Bento: Featured & Recent & Learning */}
        <div className="lg:col-span-8 space-y-6">
          {/* Featured internal opportunities */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-black text-app-text">Featured Opportunities</h3>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredJobs.map((job) => (
                <div 
                  key={job.id} 
                  className="p-5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex flex-col justify-between gap-4 group transition-all duration-300 hover:border-brand-blue/30"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        job.category === 'transfer' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue'
                      } border`}>
                        {job.type}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-app-text leading-snug group-hover:text-brand-blue transition-colors line-clamp-1">{job.role}</h4>
                      <p className="text-[10px] text-app-muted font-bold mt-0.5">{job.team}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-[10px] text-app-muted font-medium pt-1">
                      <span className="flex items-center gap-1.5">📍 {job.location}</span>
                      <span className="flex items-center gap-1.5">💼 {job.exp}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleApply(job.role)}
                    className="w-full py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-[10px] rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent applications */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-black text-app-text">Recent Applications</h3>
              <button 
                onClick={() => onNavigate('applications')}
                className="text-xs font-bold text-brand-blue hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentApps.map((app, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between">
                  <div className="truncate pr-2">
                    <div className="text-xs font-extrabold text-app-text truncate">{app.role}</div>
                    <div className="text-[10px] text-app-muted font-bold mt-0.5">{app.team}</div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full whitespace-nowrap border ${
                    app.statusColor === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    app.statusColor === 'amber' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-purple-500/10 border-purple-500/20 text-purple-500'
                  }`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Bento: Resume Health */}
        <div className="lg:col-span-4">
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow text-center flex flex-col items-center justify-between h-full space-y-5">
            <h3 className="text-base font-display font-black text-app-text w-full text-left">Resume Health</h3>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-app-border" />
                <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="390" strokeDashoffset="35" className="text-emerald-500" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">91%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Good</span>
              </div>
            </div>

            <div className="w-full text-left space-y-3 pt-2">
              <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-widest block leading-none">Missing Fields:</span>
              
              <div className="space-y-2 pb-2">
                {[
                  { text: 'Certifications', complete: false },
                  { text: 'Leadership Experience', complete: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-app-text">{item.text}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('resume_builder')}
                className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md active:scale-[0.98] uppercase tracking-wider cursor-pointer"
              >
                Update Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
