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
  Clock,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  BarChart as ReBarChart, 
  Bar 
} from 'recharts';

export default function CompanyManagerAnalytics() {
  const [isExporting, setIsExporting] = useState(false);

  // Stats Card Info matching bottom-right screenshot
  const analyticsStats = [
    { label: 'Active Jobs', value: '24', change: '↑ 4 from last month', isPositive: true, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Open Positions', value: '86', change: '↑ 7 from last month', isPositive: true, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Applications', value: '1,246', change: '↑ 18% from last month', isPositive: true, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Recruiters', value: '8', change: '↑ 1 from last month', isPositive: true, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Hires (Selected)', value: '28', change: '↑ 12% from last month', isPositive: true, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  // Recharts: Applications Over Time
  const appsOverTimeData = [
    { date: '1 May', applications: 150 },
    { date: '8 May', applications: 210 },
    { date: '15 May', applications: 180 },
    { date: '22 May', applications: 290 },
    { date: '29 May', applications: 350 },
  ];

  // Recharts: Hiring Funnel
  const hiringFunnelData = [
    { name: 'Applied', count: 1246, fill: '#3b82f6' },
    { name: 'Under Review', count: 382, fill: '#f59e0b' },
    { name: 'Shortlisted', count: 188, fill: '#14b8a6' },
    { name: 'Interview', count: 94, fill: '#6366f1' },
    { name: 'Selected', count: 28, fill: '#10b981' },
  ];

  // Recharts: Applications by Department donut
  const appsByDept = [
    { name: 'Engineering', value: 773, color: '#3b82f6' },
    { name: 'Product', value: 187, color: '#10b981' },
    { name: 'Data Science', value: 125, color: '#8b5cf6' },
    { name: 'Design', value: 87, color: '#ec4899' },
    { name: 'Others', value: 74, color: '#6b7280' },
  ];

  // Top recruiters by hires horizontal bar
  const topRecruiters = [
    { name: 'Priya Sharma', hires: 8, max: 10, color: 'bg-blue-500' },
    { name: 'Neha Patel', hires: 7, max: 10, color: 'bg-violet-500' },
    { name: 'Rahul Verma', hires: 6, max: 10, color: 'bg-emerald-500' },
    { name: 'Amit Singh', hires: 3, max: 10, color: 'bg-amber-500' },
    { name: 'Kavya Reddy', hires: 2, max: 10, color: 'bg-indigo-500' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Generating high-fidelity recruitment analytics PDF. Download initiated.');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Analytics</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Track hiring performance and key organizational metrics.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-app-surface/60 border border-app-border rounded-xl px-4 py-2.5 text-xs font-bold text-app-text flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-app-muted" />
            <span>01 May 2024 - 31 May 2024</span>
            <ChevronDown className="w-3.5 h-3.5 text-app-muted" />
          </div>
          <button 
            onClick={handleExport}
            className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-all shadow-lg shadow-brand-blue/15"
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
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {analyticsStats.map((st, sIdx) => (
          <div key={sIdx} className="p-5 rounded-2xl glass border border-app-border card-shadow">
            <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-widest block leading-none">{st.label}</span>
            <div className="text-3xl font-display font-black text-app-text tracking-tight mt-3 mb-1">{st.value}</div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-lg">{st.change}</span>
          </div>
        ))}
      </div>

      {/* Line Chart & Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Applications over time */}
        <div className="p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-black text-base text-app-text tracking-tight mb-6">Applications Over Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appsOverTimeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Funnel Bar Chart */}
        <div className="p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-black text-base text-app-text tracking-tight mb-6">Hiring Funnel</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={hiringFunnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '16px' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {hiringFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Donuts + Recruiters horizontal stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">

        {/* Applications by Department Donut */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-base text-app-text tracking-tight mb-4">Applications by Department</h3>
            <div className="w-full h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={appsByDept}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {appsByDept.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-display font-black text-app-text">1,246</span>
                <span className="text-[9px] font-bold text-app-muted uppercase">Apps</span>
              </div>
            </div>

            {/* Micro Legenda checklist */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-bold text-app-muted">
              {appsByDept.map((dep, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dep.color }} />
                  <span className="truncate">{dep.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Top Recruiters by Hires list */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-black text-base text-app-text tracking-tight mb-4">Top Recruiters by Hires</h3>
          <div className="space-y-3.5">
            {topRecruiters.map((rec, rIdx) => {
              const widthPct = `${(rec.hires / rec.max) * 100}%`;
              return (
                <div key={rIdx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-app-text">{rec.name}</span>
                    <span className="text-brand-blue font-black">{rec.hires} Hires</span>
                  </div>
                  <div className="w-full h-2.5 bg-app-surface border border-app-border rounded-full overflow-hidden">
                    <div className={`h-full ${rec.color} rounded-full transition-all duration-500`} style={{ width: widthPct }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Average Time to Hire card */}
        <div className="lg:col-span-3 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between text-center bg-gradient-to-tr from-brand-blue/5 to-brand-violet/5 hover:from-brand-blue/10 hover:to-brand-violet/10 transition-all duration-300">
          <div>
            <h3 className="font-display font-black text-base text-app-text tracking-tight mb-2">Average Time to Hire</h3>
            <p className="text-[11px] text-app-muted font-bold uppercase tracking-widest">Industry Benchmark: 30 Days</p>
          </div>
          
          <div className="py-6">
            <span className="text-5xl font-display font-black text-brand-blue tracking-tight">23</span>
            <span className="text-sm font-bold text-app-muted block mt-2">Days average cycle</span>
          </div>

          <div className="pt-2">
            <span className="inline-block text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              ✓ 4 days faster from last month
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
