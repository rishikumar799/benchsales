import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase, 
  Download, 
  Sparkles,
  Award,
  ArrowUpRight,
  TrendingDown,
  PieChart as PieIcon,
  CheckCircle,
  HelpCircle,
  XCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar,
  Legend,
  CartesianGrid
} from 'recharts';

export default function AnalyticsTab() {
  const [isExporting, setIsExporting] = useState(false);

  // Stats Card Info
  const analyticsStats = [
    { label: 'Total Jobs', value: '32', change: '+12 this month', isPositive: true, icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Openings', value: '138', change: '+48 this month', isPositive: true, icon: BarChart3, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Active Recruiters', value: '16', change: '+3 this month', isPositive: true, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Total Submissions', value: '247', change: '+78 this month', isPositive: true, icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  // Recruiter Analytics top row cards
  const recruiterAnalyticsStats = [
    { label: 'Total Recruiters', value: '16', sub: 'In Directory', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Active Partners', value: '12', sub: 'Active Sourcing', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Inactive Partners', value: '4', sub: 'On Hold', icon: XCircle, color: 'text-app-muted', bg: 'bg-white/5' },
    { label: 'Assigned Recruiters', value: '8', sub: 'Active On Job', icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Avg Success Rate', value: '81%', sub: 'Sourcing Quality', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Submission Conversion', value: '64%', sub: 'Avg Sub to Shortlist', icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Top Sourcing Partner', value: 'Rahul Singh', sub: '8 Placements (82%)', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  // Recharts Chart Data: Submissions Over Time
  const subOverTimeData = [
    { name: 'May 11-17', count: 25 },
    { name: 'May 18-24', count: 45 },
    { name: 'May 25-31', count: 65 },
    { name: 'Jun 1-7', count: 80 },
    { name: 'Jun 8-10', count: 100 },
  ];

  // Recharts Chart Data: Top Jobs distribution
  const topJobsData = [
    { name: 'Frontend Developer', value: 78, color: '#3b82f6' },
    { name: 'Java Developer', value: 54, color: '#8b5cf6' },
    { name: 'DevOps Engineer', value: 45, color: '#10b981' },
    { name: 'QA Engineer', value: 38, color: '#f59e0b' },
    { name: 'Others', value: 32, color: '#6b7280' },
  ];

  // Recruiter Performance Distribution Data
  const recruiterPerfData = [
    { name: 'Rahul S.', Submissions: 18, Shortlisted: 14, Selected: 8, Joined: 5 },
    { name: 'Priya S.', Submissions: 12, Shortlisted: 8, Selected: 5, Joined: 3 },
    { name: 'Akash V.', Submissions: 22, Shortlisted: 18, Selected: 12, Joined: 8 },
    { name: 'Neha P.', Submissions: 8, Shortlisted: 4, Selected: 2, Joined: 1 },
    { name: 'Karthik N.', Submissions: 14, Shortlisted: 10, Selected: 6, Joined: 4 }
  ];

  // Assignment Access Mode distribution
  const assignmentModeData = [
    { name: 'Open to All', value: 20, percentage: '62.5%', color: '#3b82f6' },
    { name: 'Restricted Access', value: 12, percentage: '37.5%', color: '#8b5cf6' }
  ];

  // Submissions by status stats matching image 6
  const statusDistribution = [
    { label: 'Submitted', count: 120, pct: 48, barColor: 'bg-blue-500' },
    { label: 'Shortlisted', count: 65, pct: 26, barColor: 'bg-emerald-500' },
    { label: 'In Review', count: 38, pct: 15, barColor: 'bg-yellow-500' },
    { label: 'Rejected', count: 24, pct: 11, barColor: 'bg-red-500' },
  ];

  // Top skills requested data
  const topSkills = [
    { name: 'React.js', demand: 72, color: 'bg-blue-500' },
    { name: 'Java', demand: 58, color: 'bg-violet-500' },
    { name: 'Node.js', demand: 46, color: 'bg-emerald-500' },
    { name: 'Python', demand: 32, color: 'bg-amber-500' },
    { name: 'AWS', demand: 28, color: 'bg-indigo-500' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Analytics</h1>
          <p className="text-app-muted mt-1">Insights and performance overview of your marketplace.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all shadow-lg shadow-brand-blue/15"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export Report
            </>
          )}
        </button>
      </div>

      {/* Recruiter Analytics Row */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider pl-1 flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-blue" />
          Recruiter Marketplace Insights (Real-Time)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {recruiterAnalyticsStats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-app-surface/30 border border-app-border/60 hover:border-brand-blue/30 transition-all flex flex-col justify-between">
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider leading-tight">
                  {stat.label}
                </span>
                <div className={`w-6 h-6 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-lg font-display font-black text-app-text tracking-tight truncate block">
                  {stat.value}
                </span>
                <span className="text-[9px] font-bold text-app-muted leading-none mt-0.5 block truncate">
                  {stat.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Row: General Job Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <div key={index} className="p-6 rounded-[28px] glass border border-app-border card-shadow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-app-muted uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-display font-black text-app-text">{stat.value}</span>
              <div className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-500">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts section: Submissions Over Time and Top Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Submissions over time */}
        <div className="lg:col-span-7 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-display font-bold text-base text-app-text">Submissions Over Time</h3>
              <p className="text-xs text-app-muted mt-0.5">Bi-weekly tracking of pipeline activity</p>
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/15 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24% Growth
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'var(--text-app-muted, #7c7c8c)', fontSize: 10, fontWeight: 600 }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: 'var(--text-app-muted, #7c7c8c)', fontSize: 10, fontWeight: 600 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#12121e', 
                    borderRadius: '12px', 
                    borderColor: 'rgba(255,255,255,0.08)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#ffffff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#areaColor)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie chart distribution */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-app-text mb-1">Top Jobs by Submissions</h3>
            <p className="text-xs text-app-muted mb-6">Distribution count of total 247 submittals</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              {/* Pie container */}
              <div className="h-44 w-44 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topJobsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {topJobsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute text-center">
                  <span className="text-2xl font-display font-black text-app-text block">247</span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-app-muted block">Files</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2 flex-1 w-full text-xs">
                {topJobsData.map((job, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: job.color }} />
                      <span className="font-semibold text-app-muted max-w-[120px] truncate">{job.name}</span>
                    </div>
                    <span className="font-extrabold text-app-text">{job.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ADDITIONAL RECRUITER PERFORMANCE DISTRIBUTION CHART */}
      <div className="p-6 rounded-[32px] glass border border-app-border card-shadow">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-display font-bold text-base text-app-text">Recruiter Performance Distribution</h3>
            <p className="text-xs text-app-muted mt-0.5">Sourcing conversion funnel per active recruiter (Excludes private details)</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-brand-blue/10 border border-brand-blue/15 text-brand-blue px-3 py-1 rounded-full uppercase">
            Sourcing Conversion Funnel
          </span>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={recruiterPerfData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'var(--text-app-muted, #7c7c8c)', fontSize: 10, fontWeight: 600 }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: 'var(--text-app-muted, #7c7c8c)', fontSize: 10, fontWeight: 600 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#12121e', 
                  borderRadius: '12px', 
                  borderColor: 'rgba(255,255,255,0.08)',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12.5px',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }} 
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#7c7c8c' }}
              />
              <Bar dataKey="Submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Shortlisted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Selected" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Joined" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ADDITIONAL ASSIGNMENT & CONVERSION ANALYTICS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Job Assignment Mode pie/donut chart */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-app-text mb-1">Recruiter Assignment Modes</h3>
            <p className="text-xs text-app-muted mb-6">Distribution of open vs restricted access requirements (32 Total)</p>

            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center pt-2">
              <div className="h-40 w-40 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assignmentModeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {assignmentModeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-xl font-display font-black text-app-text block">3.4</span>
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-app-muted block">Recs/Job</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 w-full text-xs">
                {assignmentModeData.map((mode, idx) => (
                  <div key={idx} className="p-3 bg-app-surface/20 border border-app-border/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: mode.color }} />
                      <span className="font-bold text-app-text">{mode.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-app-text block">{mode.value} Requirements</span>
                      <span className="text-[10px] font-bold text-app-muted block">{mode.percentage} ratio</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sourcing Leaders (Top Assigned & Most Successful Placements) */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-app-text mb-1">Marketplace Sourcing Leaders</h3>
            <p className="text-xs text-app-muted mb-4">Top recruiter assignments and successful placements</p>

            <div className="space-y-4">
              {/* Top Assigned */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Top Assigned Recruiters</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-app-border/40 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Akash Verma</span>
                    <span className="text-sm font-black text-brand-blue mt-0.5 block">5 Assigned</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-app-border/40 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Rahul Singh</span>
                    <span className="text-sm font-black text-brand-blue mt-0.5 block">4 Assigned</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-app-border/40 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Priya Sharma</span>
                    <span className="text-sm font-black text-brand-blue mt-0.5 block">3 Assigned</span>
                  </div>
                </div>
              </div>

              {/* Most Successful Placements */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Most Successful Placements</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Akash Verma</span>
                    <span className="text-sm font-black text-emerald-500 mt-0.5 block">12 Joined</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Rahul Singh</span>
                    <span className="text-sm font-black text-emerald-500 mt-0.5 block">8 Joined</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-app-surface/20 border border-emerald-500/15 text-center">
                    <span className="text-[10px] font-bold text-app-muted block">Karthik Nair</span>
                    <span className="text-sm font-black text-emerald-500 mt-0.5 block">6 Joined</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom statistical columns: Pipeline by Status & Top Skills Requested */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Pipeline status progress lines */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-bold text-base text-app-text mb-1">Submissions by Status</h3>
          <p className="text-xs text-app-muted mb-6">Aggregate ratios of current active submittals</p>
          
          <div className="space-y-4">
            {statusDistribution.map((st, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-app-text">{st.label}</span>
                  <div className="space-x-1 font-mono font-extrabold">
                    <span className="text-app-text">{st.count}</span>
                    <span className="text-app-muted">({st.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-app-bg h-2.5 rounded-full overflow-hidden border border-app-border/40">
                  <div className={`h-full ${st.barColor} rounded-full`} style={{ width: `${st.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Skills requested bar rating */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-bold text-base text-app-text mb-1">Top Skills Requested</h3>
          <p className="text-xs text-app-muted mb-6">Demand distribution percentage across 32 active requirements</p>
          
          <div className="space-y-4">
            {topSkills.map((sk, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-app-text">{sk.name}</span>
                  <span className="font-mono font-extrabold text-brand-blue">{sk.demand}% demand</span>
                </div>
                <div className="w-full bg-app-bg h-2 rounded-full overflow-hidden border border-app-border/40">
                  <div className={`h-full ${sk.color} rounded-full`} style={{ width: `${sk.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
