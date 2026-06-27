import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  FileText, 
  Mail, 
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  FileSpreadsheet,
  Download,
  Percent,
  Calendar,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function CompanyAdminReports() {
  const [activeReportSubTab, setActiveReportSubTab] = useState('Overview');

  const trendData = [
    { month: 'Dec', submissions: 480 },
    { month: 'Jan', submissions: 610 },
    { month: 'Feb', submissions: 580 },
    { month: 'Mar', submissions: 760 },
    { month: 'Apr', submissions: 710 },
    { month: 'May', submissions: 840 },
  ];

  const reportButtons = [
    { title: 'Department Hiring Report', desc: 'Queries of vacancies filled by business unit', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Employee Growth Report', desc: 'Roster progression statistics & transfers', color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { title: 'Recruitment Report', desc: 'Inbound source channel effectiveness tracking', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Manager Performance Report', desc: 'Audit log of hiring lead requisition activities', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Recruiter Performance Report', desc: 'Specialist efficiency, interviews & selections', color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
    { title: 'Time to Hire Report', desc: 'Fulfillment times for active requisitions', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Offer & Acceptance Report', desc: 'Calculated ratios of written offer letters accepted', color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { title: 'Attrition Report', desc: 'Corporate roster leakage & retention modeling', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Title + Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Reports & Analytics
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">Audit operational hiring funnel progression and workforce roster statistics.</p>
        </div>
        <button className="px-4 py-2.5 bg-app-surface border border-app-border text-app-text font-bold rounded-xl flex items-center gap-2 hover:bg-app-surface/60 transition-all text-xs shadow-sm">
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export System Registry
        </button>
      </div>

      {/* Grid containing Left: Reports list, Right: Hiring Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left reports menu panel */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
          <div className="p-4 rounded-3xl glass border border-app-border/80 card-shadow">
            <div className="space-y-1">
              {['Overview', 'Hiring Reports', 'Employee Reports', 'Manager Reports', 'Recruiter Reports'].map((subtab) => (
                <button
                  key={subtab}
                  onClick={() => setActiveReportSubTab(subtab)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    activeReportSubTab === subtab 
                      ? 'bg-brand-blue text-white shadow-md' 
                      : 'text-app-muted hover:text-app-text hover:bg-app-surface/50'
                  }`}
                >
                  <span>{subtab}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass border border-app-border/80 card-shadow space-y-4">
            <h3 className="text-sm font-bold text-app-text">Active Core Metrics</h3>
            <div className="space-y-3 font-semibold text-xs">
              <div className="flex justify-between items-center p-3 rounded-xl bg-app-surface/40 border border-app-border/50">
                <span className="text-app-muted">Total Employees</span>
                <span className="font-extrabold text-app-text">4,826</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-app-surface/40 border border-app-border/50">
                <span className="text-app-muted">Active Jobs</span>
                <span className="font-extrabold text-app-text">67</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-app-surface/40 border border-app-border/50">
                <span className="text-app-muted">Submissions</span>
                <span className="font-extrabold text-app-text">3,482</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-app-surface/40 border border-app-border/50">
                <span className="text-app-muted">Hires This Month</span>
                <span className="font-extrabold text-app-text">18</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center/Right Reports overview workspace */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          {activeReportSubTab === 'Overview' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reportButtons.map((rpt, i) => (
                <div key={i} className="p-5 rounded-3xl bg-app-surface/55 border border-app-border hover:border-brand-blue/30 transition-all cursor-pointer group flex flex-col justify-between">
                  <div>
                    <div className={`w-9 h-9 rounded-xl ${rpt.bg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                      <BarChart3 className={`w-4 h-4 ${rpt.color}`} />
                    </div>
                    <h4 className="text-sm font-extrabold text-app-text">{rpt.title}</h4>
                    <p className="text-[11px] text-app-muted font-bold mt-1 line-clamp-2 leading-relaxed">{rpt.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-brand-blue text-[10px] font-black uppercase mt-4">
                    <span>Generate Log Report</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-[32px] glass border border-app-border/80 card-shadow text-center py-16 space-y-3">
              <BarChart3 className="w-12 h-12 text-brand-blue/40 mx-auto" />
              <h3 className="text-base font-bold text-app-text">{activeReportSubTab} Workspace</h3>
              <p className="text-xs text-app-muted max-w-sm mx-auto font-medium">Enterprise telemetry logs compile dynamically from decentralized personnel databases.</p>
              <button 
                onClick={() => setActiveReportSubTab('Overview')} 
                className="mt-4 px-4 py-2 bg-brand-blue text-white font-extrabold rounded-lg text-xs"
              >
                Back to Reports Catalog
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Row 2: Hiring Pipeline & Submissions Trend */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Hiring pipeline Funnel */}
        <div className="col-span-1 xl:col-span-6 p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-app-text font-display">Hiring Pipeline Overview</h3>
            <p className="text-xs text-app-muted font-semibold mt-1">Acquisition conversions from candidates to roster assignments</p>
 
            {/* Simulated funnel graphics aligning values */}
            <div className="mt-8 space-y-3 font-bold select-none">
              {[
                { stage: 'Submitted', raw: '3,482', pct: '100%', width: 'w-full', bg: 'bg-blue-500' },
                { stage: 'Under Review', raw: '1,246', pct: '36%', width: 'w-[80%]', bg: 'bg-indigo-500' },
                { stage: 'Shortlisted', raw: '382', pct: '11%', width: 'w-[60%]', bg: 'bg-violet-500' },
                { stage: 'Interview', raw: '94', pct: '3%', width: 'w-[40%]', bg: 'bg-amber-500' },
                { stage: 'Selected', raw: '28', pct: '1%', width: 'w-[20%]', bg: 'bg-emerald-500' },
              ].map((fn, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] uppercase text-app-muted tracking-wide font-mono px-1">
                    <span>{fn.stage}</span>
                    <span>{fn.raw} ({fn.pct})</span>
                  </div>
                  <div className="w-full h-8 bg-app-surface border border-app-border/40 rounded-xl overflow-hidden flex items-center px-1">
                    <div className={`h-6 rounded-lg ${fn.bg} flex items-center justify-end pr-2 font-mono text-[10px] text-white transition-all duration-500 ${fn.width}`}>
                      {fn.pct}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
 
        {/* Submissions Trend charts */}
        <div className="col-span-1 xl:col-span-6 p-6 md:p-8 rounded-[32px] glass border border-app-border/80 card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center select-all">
              <div>
                <h3 className="text-base font-bold text-app-text font-display">Submissions Trend</h3>
                <p className="text-xs text-app-muted font-semibold mt-1">Telemetry log of submissions parsed by volume</p>
              </div>
              <span className="text-[10px] font-bold text-app-muted uppercase bg-app-surface border border-app-border px-2.5 py-1 rounded-lg">Last 6 Months</span>
            </div>
 
            <div className="h-48 w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="month" stroke="var(--color-app-muted)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <YAxis stroke="var(--color-app-muted)" fontSize={10} fontWeight="bold" tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-app-surface, #1e1e2d)', 
                      borderColor: 'var(--color-app-border, #2b2b3d)',
                      borderRadius: '16px',
                      color: 'var(--color-app-text, #ffffff)' 
                    }} 
                  />
                  <Line type="monotone" dataKey="submissions" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Fourth Row from screenshot: 4 metrics at very bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-text">
        {[
          { label: 'Average Time to Hire', value: '23', suffix: 'Days', change: '↓ 4 days vs last month', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Offer Acceptance Rate', value: '78', suffix: '%', change: '↑ 6% vs last month', icon: Percent, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Interview to Offer Ratio', value: '15', suffix: '%', change: '↑ 2% vs last month', icon: BarChart3, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          { label: 'Hires This Month', value: '18', suffix: '', change: '↑ 3% vs last month', icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((item, index) => (
          <div key={index} className="p-6 rounded-[32px] glass border border-app-border/80 card-shadow flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider">{item.label}</span>
              <div className={`p-2 rounded-xl ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-display font-black text-app-text flex items-baseline gap-1">
                <span>{item.value}</span>
                <span className="text-sm font-bold text-app-muted">{item.suffix}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 block mt-1">{item.change}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
