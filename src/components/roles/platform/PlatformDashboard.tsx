import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  FileDown, 
  AlertCircle, 
  Globe, 
  Zap, 
  GraduationCap,
  Percent,
  Lock,
  Database,
  Cpu,
  Shield,
  Server
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PlatformDashboardProps {
  onNavigate: (tab: string) => void;
  onExport: () => void;
}

const growtData = [
  { month: 'Dec', users: 65000, orgs: 1800, jobs: 11000, rev: 12.5, students: 34000, recruiters: 21000, managers: 10000, sub: 9.5, mkt: 2.1, other: 0.9 },
  { month: 'Jan', users: 71000, orgs: 1950, jobs: 12100, rev: 14.1, students: 37000, recruiters: 23000, managers: 11000, sub: 10.8, mkt: 2.4, other: 0.9 },
  { month: 'Feb', users: 78000, orgs: 2100, jobs: 13400, rev: 15.8, students: 41000, recruiters: 25500, managers: 11500, sub: 12.1, mkt: 2.8, other: 0.9 },
  { month: 'Mar', users: 82000, orgs: 2280, jobs: 14000, rev: 16.9, students: 43000, recruiters: 27000, managers: 12000, sub: 12.9, mkt: 3.0, other: 1.0 },
  { month: 'Apr', users: 84500, orgs: 2390, jobs: 14500, rev: 17.8, students: 44200, recruiters: 27800, managers: 12500, sub: 13.6, mkt: 3.1, other: 1.1 },
  { month: 'May', users: 86420, orgs: 2486, jobs: 14862, rev: 18.6, students: 45020, recruiters: 28540, managers: 12860, sub: 14.2, mkt: 3.2, other: 1.2 },
];

export default function PlatformDashboard({ onNavigate, onExport }: PlatformDashboardProps) {
  const [dateRange, setDateRange] = useState('01 May 2024 - 31 May 2024');

  const stats = [
    { 
      label: 'Total Organizations', 
      value: '2,486', 
      change: '+16.6% from last month', 
      icon: Building2, 
      color: 'text-violet-500', 
      bg: 'bg-violet-500/10',
      breakdown: [
        { label: 'Companies', value: '1,128', pct: '45.4%', icon: Building2, color: 'text-violet-400' },
        { label: 'Universities', value: '240', pct: '9.7%', icon: GraduationCap, color: 'text-amber-400' },
        { label: 'Other Orgs', value: '1,118', pct: '44.9%', icon: Globe, color: 'text-fuchsia-400' },
      ]
    },
    { 
      label: 'Total Users', 
      value: '86,420', 
      change: '+21.4% from last month', 
      icon: Users, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10',
      breakdown: [
        { label: 'Students', value: '45,020', pct: '52.1%', icon: GraduationCap, color: 'text-emerald-400' },
        { label: 'Recruiters', value: '28,540', pct: '33.0%', icon: Users, color: 'text-blue-400' },
        { label: 'Managers / BDMs', value: '12,860', pct: '14.9%', icon: Briefcase, color: 'text-purple-400' },
      ]
    },
    { 
      label: 'Active Jobs', 
      value: '14,862', 
      change: '+15.7% from last month', 
      icon: Briefcase, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      breakdown: [
        { label: 'Marketplace Jobs', value: '6,742', pct: '45.3%', icon: Globe, color: 'text-blue-400' },
        { label: 'University Jobs', value: '4,118', pct: '27.7%', icon: GraduationCap, color: 'text-indigo-400' },
        { label: 'Company Jobs', value: '4,002', pct: '27.0%', icon: Building2, color: 'text-amber-400' },
      ]
    },
    { 
      label: 'Monthly Revenue', 
      value: '₹18.6L', 
      change: '+14.8% from last month', 
      icon: DollarSign, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      breakdown: [
        { label: 'Subscription', value: '₹14.2L', pct: '76.3%', icon: Zap, color: 'text-amber-400' },
        { label: 'Marketplace', value: '₹3.2L', pct: '17.2%', icon: Briefcase, color: 'text-emerald-400' },
        { label: 'Other Sources', value: '₹1.2L', pct: '6.5%', icon: Globe, color: 'text-slate-400' },
      ]
    },
  ];

  const initialActivities = [
    { text: 'Student Registered', detail: 'Rahul Sharma (Delhi University) completed profile', time: '10:45 AM', icon: GraduationCap, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { text: 'Recruiter Registered', detail: 'Priya Patel added to TechCorp Solutions', time: '10:30 AM', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { text: 'Manager Registered', detail: 'Sandeep Joshi joined Operations at TechCorp', time: '09:15 AM', icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { text: 'University Registered', detail: 'ABC University has joined the platform', time: '08:45 AM', icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { text: 'Company Registered', detail: 'TechCorp Solutions Pvt. Ltd has joined', time: '08:15 AM', icon: Building2, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { text: 'Subscription Upgraded', detail: 'InnovateX upgraded to Enterprise plan', time: 'Yesterday', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { text: 'Payment Received', detail: 'Payment of ₹2,43,000 received from TechCorp', time: 'Yesterday', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { text: 'Organization Suspended', detail: 'XYZ Institute has been suspended due to policy', time: 'Yesterday', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { text: 'New Job Posted', detail: 'SDE-1 (Java/React) listed by TechCorp', time: '2 days ago', icon: Briefcase, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  const userDistData = [
    { name: 'Students', value: 45020, color: '#10b981' },
    { name: 'Recruiters', value: 28540, color: '#3b82f6' },
    { name: 'Managers / BDMs', value: 12860, color: '#8b5cf6' },
  ];

  return (
    <div id="platform-dashboard-view" className="space-y-6">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Platform Admin</span>
          <h2 className="text-3xl font-display font-bold mt-1">ARYX Platform Command Center</h2>
          <p className="text-app-muted text-sm mt-1">Monitor platform performance, ecosystem activity and operational health.</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
          >
            <option>01 May 2024 - 31 May 2024</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
          </select>
          <button 
            onClick={onExport}
            className="px-4 py-2.5 bg-brand-blue text-white font-bold text-xs rounded-xl flex items-center gap-2 hover:bg-brand-blue/95 cursor-pointer transition-all"
          >
            <FileDown className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Stats Counter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-app-muted">{st.label}</span>
                  <div className={`p-2.5 rounded-2xl ${st.bg}`}>
                    <Icon className={`w-5 h-5 ${st.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-display font-bold text-app-text">{st.value}</div>
                  <div className="text-xs text-emerald-500 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> {st.change}
                  </div>
                </div>
              </div>

              {/* Dynamic breakdown grid */}
              {st.breakdown && (
                <div className="grid grid-cols-3 gap-2 pt-4 mt-4 border-t border-app-border/40 text-left">
                  {st.breakdown.map((item, bIdx) => {
                    const SubIcon = item.icon;
                    return (
                      <div key={bIdx} className="min-w-0">
                        <div className="flex items-center gap-1 text-[10px] font-black text-app-muted uppercase truncate">
                          <SubIcon className={`w-2.5 h-2.5 ${item.color} flex-shrink-0`} />
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="text-sm font-black text-app-text mt-0.5 truncate">{item.value}</div>
                        <div className="text-[10px] text-app-muted font-bold mt-0.5">{item.pct}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Ecosystem Overview + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Ecosystem Overview</h3>
              <p className="text-xs text-app-muted">Overview of all ecosystems connected on Aryx platform</p>
            </div>
            <button 
              onClick={() => onNavigate('marketplace')}
              className="text-xs text-brand-blue font-bold hover:underline"
            >
              Analyze Ecosystems →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Marketplace */}
            <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/10 space-y-3 hover:bg-violet-500/10 transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('marketplace')}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <span className="font-bold text-xs uppercase tracking-wider text-violet-400">Marketplace</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Students</span>
                    <strong className="text-app-text font-black">18,240</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Recruiters</span>
                    <strong className="text-app-text font-black">8,540</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Managers / BDMs</span>
                    <strong className="text-app-text font-black">1,460</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Jobs</span>
                    <strong className="text-app-text font-black">6,742</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Submissions</span>
                    <strong className="text-app-text font-black">42,188</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Universities */}
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3 hover:bg-blue-500/10 transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('universities')}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-400">Universities</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Universities</span>
                    <strong className="text-app-text font-black">240</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Students</span>
                    <strong className="text-app-text font-black">45,300</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Placement Officers</span>
                    <strong className="text-app-text font-black">2,180</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Jobs</span>
                    <strong className="text-app-text font-black">4,118</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Placements</span>
                    <strong className="text-app-text font-black">8,240</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Companies */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3 hover:bg-emerald-500/10 transition-all cursor-pointer flex flex-col justify-between" onClick={() => onNavigate('companies')}>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Companies</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Companies</span>
                    <strong className="text-app-text font-black">1,128</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Employees</span>
                    <strong className="text-app-text font-black">22,880</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Recruiters</span>
                    <strong className="text-app-text font-black">6,742</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Managers / BDMs</span>
                    <strong className="text-app-text font-black">1,960</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-app-muted">
                    <span>Jobs</span>
                    <strong className="text-app-text font-black">12,450</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
              {initialActivities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex gap-3 text-xs items-start">
                    <div className={`p-2 rounded-xl mt-0.5 ${act.bg} flex-shrink-0`}>
                      <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-app-text truncate">{act.text}</div>
                      <div className="text-app-muted mt-0.5 truncate">{act.detail}</div>
                    </div>
                    <span className="text-[10px] text-app-muted font-mono whitespace-nowrap">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('system')}
            className="w-full text-center py-2.5 bg-app-surface hover:bg-app-surface/60 border border-app-border text-xs font-bold text-app-text mt-4 rounded-xl cursor-pointer transition-all"
          >
            View System Operations Logs →
          </button>
        </div>
      </div>

      {/* Core Platform Health Row */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border border-app-border/80 card-shadow space-y-4">
        <div>
          <h3 className="text-lg font-bold">Core Platform Health</h3>
          <p className="text-xs text-app-muted">Hardware allocation telemetry, isolation layers and edge connectivity</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-emerald-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">API Status</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">99.98%</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">Healthy</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-emerald-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">AI Inference Pool</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">Active</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">68ms latency</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-emerald-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">Database Replica</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">Synced</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">Real-Time</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-violet-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">Isolation Guard</span>
            <span className="text-base font-black text-violet-500 mt-1 block">Lock Shield</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">Active</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-blue-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">Storage Usage</span>
            <span className="text-base font-black text-blue-500 mt-1 block">1.24 TB <span className="text-[10px] text-app-muted font-normal">/ 5 TB</span></span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">24.8% Capacity</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-emerald-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">Uptime</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">99.95%</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">This Month</span>
          </div>
          <div className="p-4 rounded-2xl bg-app-surface/60 border border-app-border hover:border-emerald-500/20 transition-all">
            <span className="text-xs text-app-muted block font-semibold">Security Monitoring</span>
            <span className="text-base font-black text-emerald-500 mt-1 block">Active</span>
            <span className="text-[10px] text-app-muted block mt-0.5 font-medium">24/7 Shield</span>
          </div>
        </div>
      </div>

      {/* Platform Growth Overview - Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User & Organization Growth */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Platform Account & Org Adoption</h3>
              <p className="text-xs text-app-muted">Simultaneous growth of platform accounts and organizations</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Users</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Orgs</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrgs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#f3f4f6' }} />
                <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="orgs" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrgs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Requisitions & Revenue Growth */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Economic Activity & Revenue</h3>
              <p className="text-xs text-app-muted">Monthly job postings scaled alongside SaaS licensing revenue (INR Lakhs)</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Active Jobs</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Revenue (Lakhs)</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#f3f4f6' }} />
                <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorJobs)" />
                <Area type="monotone" dataKey="rev" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Users Growth Trend */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">New Users Growth Trend</h3>
              <p className="text-xs text-app-muted">Monthly registration split by user roles</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Students</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Recruiters</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Managers</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecruiters" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorManagers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#f3f4f6' }} />
                <Area type="monotone" dataKey="students" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="recruiters" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecruiters)" />
                <Area type="monotone" dataKey="managers" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorManagers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth Trend */}
        <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">Revenue Growth Trend</h3>
              <p className="text-xs text-app-muted">Licensing & marketplace split (INR Lakhs)</p>
            </div>
            <div className="flex gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Subscription</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Marketplace</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Other</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growtData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMkt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={10} tickLine={false} />
                <YAxis stroke="#9ca3af" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#f3f4f6' }} />
                <Area type="monotone" dataKey="sub" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSub)" />
                <Area type="monotone" dataKey="mkt" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMkt)" />
                <Area type="monotone" dataKey="other" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOther)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Distribution Section */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border border-app-border/80 card-shadow">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-app-text">User Distribution</h3>
          <p className="text-xs text-app-muted">Breakdown of total platform users by role</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Donut Chart container */}
          <div className="md:col-span-4 flex justify-center relative">
            <div className="w-56 h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {userDistData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value.toLocaleString()} Users`]}
                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '12px', fontSize: '11px', color: '#f3f4f6' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center text inside the Donut Chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-display font-black text-app-text">86,420</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-app-muted mt-1">Total Users</span>
              </div>
            </div>
          </div>

          {/* Detailed breakdown cards */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {userDistData.map((role, rIdx) => {
              // Create a miniature trend dataset for sparkline
              const sparklineData = growtData.map(d => ({
                value: rIdx === 0 ? d.students : rIdx === 1 ? d.recruiters : d.managers
              }));

              const pct = ((role.value / 86420) * 100).toFixed(1) + '%';
              
              return (
                <div 
                  key={role.name}
                  className="p-5 rounded-[24px] bg-app-surface/60 border border-app-border flex flex-col justify-between h-40 relative overflow-hidden group hover:border-app-border-hover transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-app-muted uppercase tracking-wider">{role.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                    </div>
                    <div className="text-2xl font-display font-black text-app-text mt-2">
                      {role.value.toLocaleString()}
                    </div>
                    <div className="text-xs font-semibold text-emerald-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> {pct} active representation
                    </div>
                  </div>

                  {/* Sparkline in card */}
                  <div className="h-10 w-full mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke={role.color} 
                          strokeWidth={1.5} 
                          fill={role.color} 
                          fillOpacity={0.05} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

