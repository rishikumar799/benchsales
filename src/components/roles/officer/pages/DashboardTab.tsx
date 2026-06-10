import { motion } from 'motion/react';
import { 
  Building2, 
  Users, 
  FileText, 
  CheckCircle, 
  Sparkles, 
  Plus, 
  TrendingUp, 
  ArrowUpRight,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onCreateOpportunity?: () => void;
  onViewStudent?: (studentId: string) => void;
}

export default function DashboardTab({ onNavigate, onCreateOpportunity, onViewStudent }: DashboardTabProps) {
  const stats = [
    { label: 'Active Opportunities', value: '24', change: '+4 this month', tab: 'opportunities', icon: Briefcase, color: 'text-brand-blue bg-brand-blue/10' },
    { label: 'Eligible Students', value: '482', change: '86% verified', tab: 'students', icon: Users, color: 'text-violet-500 bg-violet-500/10' },
    { label: 'Applications Received', value: '1,248', change: '+320 this week', tab: 'applications', icon: FileText, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Students Placed', value: '186', change: '78% placement rate', tab: 'placements', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  const recentOpps = [
    { company: 'TCS', role: 'Software Engineer', status: 'Active', color: 'text-emerald-500 bg-emerald-500/10' },
    { company: 'Infosys', role: 'System Engineer', status: 'Active', color: 'text-emerald-500 bg-emerald-500/10' },
    { company: 'Wipro', role: 'Associate Engineer', status: 'Active', color: 'text-emerald-500 bg-emerald-500/10' },
  ];

  const partStats = [
    { dept: 'CSE', total: 180, applied: 160 },
    { dept: 'ECE', total: 120, applied: 96 },
    { dept: 'IT', total: 95, applied: 74 },
    { dept: 'MBA', total: 87, applied: 58 },
    { dept: 'ME', total: 60, applied: 42 },
  ];

  const recentApps = [
    { name: 'Rahul Kumar', company: 'TCS', status: 'Applied', avatar: 'https://picsum.photos/seed/rahul/100/100', color: 'bg-brand-blue/10 text-brand-blue border border-brand-blue/20' },
    { name: 'Anjali Sharma', company: 'Infosys', status: 'Shortlisted', avatar: 'https://picsum.photos/seed/anjali/100/100', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' },
    { name: 'Vikram Patel', company: 'Wipro', status: 'Under Review', avatar: 'https://picsum.photos/seed/vikram/100/100', color: 'bg-amber-500/10 text-amber-500 border border-amber-500/20' },
  ];

  const insights = [
    { title: '32', label: 'Placed This Month', desc: '+12 from last month', color: 'text-emerald-500' },
    { title: '18 LPA', label: 'Highest Package', desc: 'Sourced by TCS', color: 'text-violet-500' },
    { title: '6.8 LPA', label: 'Average Package', desc: '+0.5 from last year', color: 'text-brand-blue' },
    { title: '78%', label: 'Placement Rate', desc: '+6% from last year', color: 'text-emerald-500 font-bold' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Welcome */}
      <div>
        <h2 className="text-3xl font-display font-bold text-app-text">Dashboard</h2>
        <p className="text-app-muted">Welcome back, Priya! Here\'s what\'s happening in your placement center.</p>
      </div>

      {/* Hero Banner Grid Card */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col md:flex-row justify-between items-center gap-6 premium-gradient text-white overflow-hidden relative">
        <div className="space-y-4 max-w-xl z-10 relative">
          <h3 className="text-3xl sm:text-4xl font-display font-bold leading-tight">Placement Operations Center</h3>
          <p className="text-white/80 text-sm font-semibold leading-relaxed">
            Create opportunities, track applications and placements, and monitor placement outcomes for students across all departments.
          </p>
          <div className="flex gap-2.5 pt-2">
            <button 
              onClick={onCreateOpportunity}
              className="px-5 py-3 bg-white hover:bg-neutral-100 text-slate-900 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-lg"
            >
              <Plus className="w-4 h-4" /> Create Opportunity
            </button>
          </div>
        </div>

        {/* Custom Decorative Floating Graph Representation inside Hero */}
        <div className="w-full md:w-56 shrink-0 relative flex items-center justify-center h-40">
          <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl" />
          <div className="relative glass border-white/20 p-5 rounded-2xl w-48 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-white/70 uppercase">DRIVE STATS</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white/90">Placement Progress</div>
              <div className="text-xl font-bold font-display">186/482</div>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '38.5%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((st) => (
          <div 
            key={st.label} 
            onClick={() => onNavigate(st.tab)}
            className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between hover:border-brand-blue/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-app-muted">{st.label}</span>
              <div className={`p-2 rounded-xl ${st.color}`}>
                <st.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="space-y-1 mt-4">
              <div className="text-4xl font-display font-extrabold text-app-text-active group-hover:text-brand-blue transition-colors">{st.value}</div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-app-muted">{st.change}</span>
                <span className="text-xs font-bold text-brand-blue flex items-center group-hover:translate-x-1 transition-transform">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Stats Split Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Opportunities List */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h4 className="font-display font-bold text-lg text-app-text">Recent Opportunities</h4>
              <button 
                onClick={() => onNavigate('opportunities')}
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              {recentOpps.map((op, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-black text-xs">
                      {op.company}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-app-text">{op.role}</div>
                      <div className="text-xs text-app-muted font-medium">{op.company} • Full Time</div>
                    </div>
                  </div>
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${op.color}`}>
                    {op.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('opportunities')}
            className="w-full text-center mt-6 text-xs font-bold text-brand-blue hover:underline py-3 bg-brand-blue/5 border border-brand-blue/10 rounded-xl"
          >
            Create New Job Drive →
          </button>
        </div>

        {/* Student Participation Stat */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
          <h4 className="font-display font-bold text-lg text-app-text mb-5">Student Participation</h4>
          
          <div className="space-y-4">
            {partStats.map((part) => {
              const reqPct = Math.round((part.applied / part.total) * 100);
              return (
                <div key={part.dept} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <div>
                      <span className="text-app-text font-black">{part.dept}</span>
                      <span className="text-app-muted ml-2">({part.total} total)</span>
                    </div>
                    <span className="text-brand-blue font-bold">{part.applied} applied • {reqPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-app-surface border border-app-border rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-brand-blue rounded-full" 
                      style={{ width: `${reqPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications List */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-display font-bold text-lg text-app-text">Recent Applications</h4>
            <button 
              onClick={() => onNavigate('applications')}
              className="text-xs font-bold text-brand-blue hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3.5">
            {recentApps.map((app, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={app.avatar} 
                    alt={app.name} 
                    className="w-10 h-10 rounded-full object-cover border border-app-border" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-sm text-app-text">{app.name}</div>
                    <div className="text-xs text-app-muted font-medium">Applied to {app.company}</div>
                  </div>
                </div>
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full ${app.color}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Placement Insights Summary Grid Section */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow">
        <h4 className="font-display font-bold text-lg text-app-text mb-5">Placement Insights</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((ins, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-app-surface/50 border border-app-border space-y-1 font-semibold hover:border-brand-blue/20 transition-all cursor-default">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{ins.label}</span>
              <div className={`text-3xl font-display font-extrabold ${ins.color}`}>{ins.title}</div>
              <p className="text-xs text-app-muted font-medium">{ins.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
