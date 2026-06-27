import React from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  ArrowUpRight, 
  TrendingUp, 
  Clock, 
  Plus, 
  Building,
  UserPlus
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface CompanyAdminDashboardProps {
  onNavigate: (tab: string) => void;
  onAddManagerClick: () => void;
}

export default function CompanyAdminDashboard({ onNavigate, onAddManagerClick }: CompanyAdminDashboardProps) {
  
  const stats = [
    { label: 'Total Employees', value: '4,826', trend: '↑ 139 this month', color: 'text-blue-500', bg: 'bg-blue-500/5', icon: Users, tab: 'employees' },
    { label: 'Managers', value: '24', trend: '↑ 3 this month', color: 'text-violet-500', bg: 'bg-violet-500/5', icon: Users, tab: 'managers' },
    { label: 'Recruiters', value: '38', trend: '↑ 5 this month', color: 'text-emerald-500', bg: 'bg-emerald-500/5', icon: Users, tab: 'recruiters' },
    { label: 'Pending Assignments', value: '12', description: 'Jobs awaiting manager or recruiter assignment', color: 'text-amber-500', bg: 'bg-amber-500/5', icon: Briefcase, tab: 'jobs' },
  ];

  const workforceData = [
    { name: 'Engineering', value: 1850, percentage: '38%', color: '#3b82f6' },
    { name: 'Product', value: 620, percentage: '13%', color: '#a855f7' },
    { name: 'Sales', value: 980, percentage: '20%', color: '#10b981' },
    { name: 'Operations', value: 740, percentage: '15%', color: '#f59e0b' },
    { name: 'HR & Finance', value: 636, percentage: '14%', color: '#ec4899' },
  ];

  const managerPerformance = [
    { name: 'Amit Verma', jobs: 24, submissions: '1,246', hires: 28, avatar: 'https://picsum.photos/seed/amitverma/100/100' },
    { name: 'Priya Sharma', jobs: 18, submissions: '982', hires: 22, avatar: 'https://picsum.photos/seed/priyasharma/100/100' },
    { name: 'Rahul Verma', jobs: 14, submissions: '746', hires: 17, avatar: 'https://picsum.photos/seed/rahulv/100/100' },
    { name: 'Neha Patel', jobs: 10, submissions: '508', hires: 12, avatar: 'https://picsum.photos/seed/nehap/100/100' },
    { name: 'Sandeep Iyer', jobs: 8, submissions: '312', hires: 9, avatar: 'https://picsum.photos/seed/sandeep/100/100' },
  ];

  const recentActivities = [
    { user: 'Amit Verma', action: 'created a new job', subject: 'Senior Software Engineer', time: '10:30 AM', avatar: 'https://picsum.photos/seed/amitverma/100/100' },
    { user: 'Priya Sharma', action: 'submitted a candidate', subject: 'Rahul Kumar for Tech Lead', time: '09:45 AM', avatar: 'https://picsum.photos/seed/priyasharma/100/100' },
    { user: 'Anjali Sharma', action: 'applied for', subject: 'Cloud Engineer', time: '09:15 AM', avatar: 'https://picsum.photos/seed/anjali/100/100' },
    { user: 'Rahul Verma', action: 'closed a job', subject: 'Data Analyst', time: 'Yesterday', avatar: 'https://picsum.photos/seed/rahulv/100/100' },
    { user: 'Neha Patel', action: 'hired a candidate', subject: 'Vikram Joshi for DevOps Engineer', time: 'Yesterday', avatar: 'https://picsum.photos/seed/nehap/100/100' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header section matching exact copy */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">Overview of your company workforce and hiring operations.</p>
        </div>
        <button 
          onClick={onAddManagerClick}
          className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Add Manager
        </button>
      </div>

      {/* Metric Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, idx) => (
          <div 
            key={idx} 
            onClick={() => onNavigate(st.tab)}
            className="p-6 rounded-[32px] glass border-app-border card-shadow cursor-pointer hover:border-brand-blue/30 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-widest text-app-muted">{st.label}</span>
              <div className={`p-2.5 rounded-2xl ${st.bg} group-hover:scale-110 transition-transform`}>
                <st.icon className={`w-5 h-5 ${st.color}`} />
              </div>
            </div>
            <div className="text-3xl font-display font-black text-app-text mt-3">{st.value}</div>
            <div className="text-xs font-bold mt-2 flex items-center gap-1">
              {st.description ? (
                <span className="text-app-muted font-normal leading-relaxed">{st.description}</span>
              ) : (
                <span className="text-emerald-500">{st.trend}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid of details: charts & performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Workforce Overview Doughnut Chart */}
        <div className="p-6 md:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-app-text font-display">Workforce Overview</h3>
            <p className="text-xs text-app-muted font-semibold mt-1">Department distribution across all active company contracts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center my-6">
            <div className="relative h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={workforceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {workforceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-app-surface, #1e1e2d)', 
                      borderColor: 'var(--color-app-border, #2b2b3d)',
                      borderRadius: '16px',
                      color: 'var(--color-app-text, #ffffff)' 
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-display text-app-text leading-none">4,826</span>
                <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest mt-1">Personnel</span>
              </div>
            </div>

            {/* Legend checklist */}
            <div className="space-y-3 font-semibold">
              {workforceData.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                    <span className="text-app-text font-bold">{dept.name}</span>
                  </div>
                  <div className="text-right text-app-muted">
                    <span className="text-app-text mr-1.5 font-bold">{dept.value.toLocaleString()}</span>
                    <span>({dept.percentage})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('reports')}
            className="w-full py-3 border border-app-border rounded-2xl text-xs font-bold text-brand-blue hover:bg-brand-blue/5 transition-all text-center flex items-center justify-center gap-1.5 mt-2"
          >
            <span>View Full Report</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Hiring Overview cards summary */}
        <div className="p-6 md:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-app-text font-display">Hiring Overview</h3>
            <p className="text-xs text-app-muted font-semibold mt-1">Placement acquisition funnel and interview metrics</p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-6">
            {[
              { label: 'Submissions', count: '3,482', trend: '+18% vs last month', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Interviews', count: '642', trend: '+14% vs last month', color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Offers', count: '148', trend: '+12% vs last month', color: 'text-violet-500', bg: 'bg-violet-500/10' },
              { label: 'Hires', count: '96', trend: '+20% vs last month', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((stat, i) => (
              <div key={i} className="p-5 rounded-2xl bg-app-surface/50 border border-app-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-app-muted">{stat.label}</span>
                <div className="text-2xl font-display font-black text-app-text mt-2">{stat.count}</div>
                <div className="text-[10px] font-bold text-emerald-500 mt-1">{stat.trend}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('reports')}
            className="w-full py-3 border border-app-border rounded-2xl text-xs font-bold text-brand-blue hover:bg-brand-blue/5 transition-all text-center flex items-center justify-center gap-1.5"
          >
            <span>View Hiring Funnel</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Row 2: Manager Performance vs Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Manager performance ranking */}
        <div className="p-6 md:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-app-text font-display">Manager Performance <span className="text-xs text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-md font-mono font-bold">Top 5</span></h3>
                <p className="text-xs text-app-muted font-semibold mt-1">Leading project administrators by allocation rate</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-4 text-[10px] font-extrabold uppercase tracking-wider text-app-muted border-b border-app-border pb-2.5">
                <span className="col-span-2">Manager</span>
                <span className="text-center">Jobs</span>
                <span className="text-center">Submissions</span>
                <span className="text-center">Hires</span>
              </div>

              {managerPerformance.map((mgr, i) => (
                <div key={i} className="grid grid-cols-4 items-center gap-2 border-b border-app-border/40 pb-2 flex-grow">
                  <div className="col-span-2 flex items-center gap-3">
                    <img src={mgr.avatar} alt={mgr.name} className="w-8 h-8 rounded-full object-cover border border-app-border" />
                    <span className="text-xs font-bold text-app-text truncate">{mgr.name}</span>
                  </div>
                  <span className="text-center text-xs font-semibold text-app-muted">{mgr.jobs}</span>
                  <span className="text-center text-xs font-semibold text-app-muted">{mgr.submissions}</span>
                  <span className="text-center text-xs font-bold text-emerald-500">{mgr.hires}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('managers')}
            className="w-full py-3 border border-app-border rounded-2xl text-xs font-bold text-brand-blue hover:bg-brand-blue/5 transition-all text-center flex items-center justify-center gap-1.5 mt-5"
          >
            <span>View All Managers</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent recruitment activity logs */}
        <div className="p-6 md:p-8 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-app-text font-display">Recent Activities</h3>
            <p className="text-xs text-app-muted font-semibold mt-1">Real-time placement and requisition telemetry logs</p>

            <div className="mt-6 space-y-4">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start justify-between gap-4 border-b border-app-border/40 pb-3 h-12">
                  <div className="flex items-center gap-3 truncate">
                    <img src={act.avatar} alt={act.user} className="w-8 h-8 rounded-full object-cover border border-app-border shrink-0" />
                    <div className="text-xs truncate font-semibold leading-relaxed">
                      <span className="font-extrabold text-app-text block sm:inline mr-1">{act.user}</span>
                      <span className="text-app-muted">{act.action} </span>
                      <span className="font-bold text-brand-blue">{act.subject}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-app-muted whitespace-nowrap pt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('reports')}
            className="w-full py-3 border border-app-border rounded-2xl text-xs font-bold text-brand-blue hover:bg-brand-blue/5 transition-all text-center flex items-center justify-center gap-1.5 mt-5"
          >
            <span>View All Activities</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
