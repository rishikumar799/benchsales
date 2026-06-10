import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase, 
  Calendar, 
  Download, 
  Sparkles,
  Award,
  ArrowUpRight,
  TrendingDown
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
  Bar 
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
      alert('Comprehensive analytical PDF generated and initialized downloader.');
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

      {/* Row of 4 cards */}
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
