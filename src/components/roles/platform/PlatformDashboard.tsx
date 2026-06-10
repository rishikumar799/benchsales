import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Plus, 
  FileDown, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Cpu, 
  Zap, 
  GraduationCap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

interface PlatformDashboardProps {
  onNavigate: (tab: string) => void;
  onExport: () => void;
}

const growtData = [
  { month: 'Dec', users: 65000, orgs: 1800, jobs: 11000, rev: 12.5 },
  { month: 'Jan', users: 71000, orgs: 1950, jobs: 12100, rev: 14.1 },
  { month: 'Feb', users: 78000, orgs: 2100, jobs: 13400, rev: 15.8 },
  { month: 'Mar', users: 82000, orgs: 2280, jobs: 14000, rev: 16.9 },
  { month: 'Apr', users: 84500, orgs: 2390, jobs: 14500, rev: 17.8 },
  { month: 'May', users: 86420, orgs: 2486, jobs: 14862, rev: 18.6 },
];

export default function PlatformDashboard({ onNavigate, onExport }: PlatformDashboardProps) {
  const [dateRange, setDateRange] = useState('01 May 2024 - 31 May 2024');

  const stats = [
    { label: 'Total Organizations', value: '2,486', change: '+16.6% from last month', icon: Building2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Total Users', value: '86,420', change: '+21.4% from last month', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Jobs', value: '14,862', change: '+15.7% from last month', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Monthly Revenue', value: '₹18.6L', change: '+14.8% from last month', icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const initialActivities = [
    { text: 'New University Registered', detail: 'ABC University has joined the platform', time: '10:30 AM', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { text: 'New Company Registered', detail: 'TechCorp Solutions Pvt. Ltd has joined', time: '09:15 AM', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { text: 'Subscription Upgraded', detail: 'InnovateX upgraded to Enterprise plan', time: '08:45 AM', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { text: 'Organization Suspended', detail: 'XYZ Institute has been suspended due to policy', time: 'Yesterday', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { text: 'Payment Received', detail: 'Payment of ₹2,43,000 received from TechCorp', time: 'Yesterday', icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/10 space-y-3 hover:bg-violet-500/10 transition-all cursor-pointer" onClick={() => onNavigate('marketplace')}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <span className="font-bold text-xs uppercase tracking-wider text-violet-400">Marketplace</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-app-muted">Users: <strong className="text-app-text">18,240</strong></div>
                <div className="text-xs text-app-muted">Organizations: <strong className="text-app-text">482</strong></div>
                <div className="text-xs text-app-muted">Applications: <strong className="text-app-text">42,188</strong></div>
              </div>
            </div>

            {/* Universities */}
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3 hover:bg-blue-500/10 transition-all cursor-pointer" onClick={() => onNavigate('universities')}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-xs uppercase tracking-wider text-blue-400">Universities</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-app-muted">Organizations: <strong className="text-app-text">240</strong></div>
                <div className="text-xs text-app-muted">Students: <strong className="text-app-text">45,300</strong></div>
                <div className="text-xs text-app-muted">Placements: <strong className="text-app-text">8,240</strong></div>
              </div>
            </div>

            {/* Companies */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3 hover:bg-emerald-500/10 transition-all cursor-pointer" onClick={() => onNavigate('companies')}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-400">Companies</span>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-app-muted">Organizations: <strong className="text-app-text">1,128</strong></div>
                <div className="text-xs text-app-muted">Employees: <strong className="text-app-text">22,880</strong></div>
                <div className="text-xs text-app-muted">Jobs Postings: <strong className="text-app-text">6,742</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-app-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-app-muted mb-4">Core Platform Hardware Allocation</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-app-surface border border-app-border">
                <span className="text-xs text-app-muted block">API Server Status</span>
                <span className="text-sm font-bold text-emerald-500 mt-1 block">99.98% Healthy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-app-surface border border-app-border">
                <span className="text-xs text-app-muted block">AI Inference Pool</span>
                <span className="text-sm font-bold text-emerald-500 mt-1 block">Active (68ms)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-app-surface border border-app-border">
                <span className="text-xs text-app-muted block">Database Replica</span>
                <span className="text-sm font-bold text-emerald-500 mt-1 block">Synced Real-Time</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-app-surface border border-app-border">
                <span className="text-xs text-app-muted block">Isolation Guard</span>
                <span className="text-sm font-bold text-violet-500 mt-1 block">Lock Shield Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
            <div className="space-y-4">
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
      </div>
    </div>
  );
}
