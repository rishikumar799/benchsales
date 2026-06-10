import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onAddOfficer: () => void;
  onViewOfficer: (officer: any) => void;
}

export default function DashboardTab({ onNavigate, onAddOfficer, onViewOfficer }: DashboardTabProps) {
  const departments = [
    { name: 'CSE', count: 1250, percent: 26, color: 'bg-emerald-500' },
    { name: 'ECE', count: 980, percent: 20, color: 'bg-blue-500' },
    { name: 'IT', count: 760, percent: 16, color: 'bg-brand-violet' },
    { name: 'MBA', count: 540, percent: 11, color: 'bg-amber-500' },
    { name: 'Mechanical', count: 460, percent: 10, color: 'bg-pink-500' },
    { name: 'Others', count: 836, percent: 17, color: 'bg-gray-400' },
  ];

  const recentPlacements = [
    { student: 'Rahul Kumar', dept: 'CSE', company: 'TCS', package: '7.0 LPA', time: 'Today', avatar: 'https://picsum.photos/seed/rahul/100/100' },
    { student: 'Anjali Sharma', dept: 'ECE', company: 'Infosys', package: '6.5 LPA', time: 'Yesterday', avatar: 'https://picsum.photos/seed/anjali/100/100' },
    { student: 'Vivek Singh', dept: 'CSE', company: 'Wipro', package: '5.8 LPA', time: '2 days ago', avatar: 'https://picsum.photos/seed/vivek/100/100' },
    { student: 'Pooja Patel', dept: 'ECE', company: 'Accenture', package: '6.2 LPA', time: '2 days ago', avatar: 'https://picsum.photos/seed/pooja/100/100' },
  ];

  const topOfficers = [
    { name: 'Priya Sharma', dept: 'Training & Placement', opportunities: 24, placements: 186, avatar: 'https://picsum.photos/seed/priyasharma/100/100', email: 'priya.sharma@ssu.edu.in', phone: '+91 98124 53210', status: 'Active' },
    { name: 'Rahul Verma', dept: 'Placement Cell', opportunities: 18, placements: 142, avatar: 'https://picsum.photos/seed/rahulv/100/100', email: 'rahul.verma@ssu.edu.in', phone: '+91 98124 53211', status: 'Active' },
    { name: 'Neha Patel', dept: 'Placement Cell', opportunities: 15, placements: 118, avatar: 'https://picsum.photos/seed/nehap/100/100', email: 'neha.patel@ssu.edu.in', phone: '+91 98124 53212', status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with welcome, date, and CTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-black text-app-text tracking-tight">Dashboard</h2>
          <p className="text-sm text-app-muted font-semibold mt-1">
            Welcome back, <span className="text-brand-blue">Dr. Sandeep Jain!</span> Here's the overview of your university placement ecosystem.
          </p>
        </div>
        <button 
          onClick={onAddOfficer}
          className="px-5 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all cursor-pointer"
        >
          <Users className="w-4 h-4" />
          Add Placement Officer
        </button>
      </div>

      {/* Main KPI metrics bento cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '4,826', detail: '+120 this month', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Placement Officers', value: '12', detail: 'Active Officers', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Opportunities', value: '48', detail: '+6 this week', icon: Briefcase, color: 'text-brand-violet', bg: 'bg-brand-violet/10' },
          { label: 'Students Placed', value: '1,268', detail: '+85 this month', icon: ShieldCheck, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        ].map((kpi, idx) => (
          <div key={idx} className="p-6 rounded-[32px] bg-app-surface/60 border border-app-border flex flex-col justify-between hover:border-app-border/80 transition-all hover:bg-app-surface/80 card-shadow h-44">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-app-muted">{kpi.label}</span>
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-display font-black text-app-text">{kpi.value}</div>
              <div className="text-xs font-bold text-app-muted mt-1.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{kpi.detail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Grid: Placement Officer Overview & Department Pie-like view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Officer Overview */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-display font-black text-app-text">Placement Officer Overview</h3>
                <p className="text-xs text-app-muted font-bold mt-0.5">Top performing departmental career coordinates</p>
              </div>
              <button 
                onClick={() => onNavigate('placement_officers')}
                className="text-xs font-extrabold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1 transition-all"
              >
                View All Officers <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-app-border text-left text-[10px] font-bold uppercase tracking-wider text-app-muted h-10">
                    <th className="pb-3">Officer</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3 text-center">Opportunities</th>
                    <th className="pb-3 text-center">Placements</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border">
                  {topOfficers.map((off, idx) => (
                    <tr key={idx} className="group hover:bg-app-surface/40 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={off.avatar} 
                            alt={off.name} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-app-bg shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="text-sm font-extrabold text-app-text leading-snug group-hover:text-brand-blue transition-colors">{off.name}</div>
                            <div className="text-[10px] text-app-muted font-bold mt-0.5">St. Xavier's University</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-xs font-extrabold text-app-text bg-app-bg px-3 py-1.5 rounded-lg border border-app-border">{off.dept}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-black text-brand-violet">{off.opportunities}</span>
                      </td>
                      <td className="py-4 text-center">
                        <span className="text-sm font-black text-emerald-500">{off.placements}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => onViewOfficer(off)}
                          className="px-3 py-1.5 text-[11px] font-extrabold text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department chart mockup */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-black text-app-text">Student Overview by Department</h3>
            <p className="text-xs text-app-muted font-bold mt-0.5 mb-6">Distribution of 4,826 total active candidates</p>

            <div className="flex justify-center items-center py-4 relative mb-4">
              {/* Radial mockup circle */}
              <div className="w-36 h-36 rounded-full border-12 border-emerald-500 flex flex-col justify-center items-center relative">
                {/* Secondary arcs representation via absolute rings */}
                <div className="absolute inset-0 w-36 h-36 rounded-full border-12 border-blue-500 border-t-transparent border-r-transparent -rotate-45" />
                <div className="absolute inset-0 w-36 h-36 rounded-full border-12 border-brand-violet border-t-transparent border-r-transparent border-l-transparent rotate-90" />
                <div className="text-center z-10">
                  <div className="text-2xl font-black text-app-text">4,826</div>
                  <div className="text-[9px] font-extrabold text-app-muted uppercase tracking-wider">Total Students</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {departments.map((dept, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 font-bold text-app-muted">
                    <span className={`w-2.5 h-2.5 rounded-full ${dept.color}`} />
                    <span>{dept.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-extrabold">
                    <span className="text-app-text">{dept.count.toLocaleString()}</span>
                    <span className="text-app-muted text-[10px]">({dept.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('reports')}
            className="w-full text-center py-2.5 mt-4 text-xs font-bold text-app-muted hover:text-brand-blue border-t border-app-border/50 pt-4 flex justify-between items-center transition-colors"
          >
            <span>View Detailed Reports</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Placements & University Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Placements Activity list */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-display font-black text-app-text">Recent Placement Activity</h3>
              <p className="text-xs text-app-muted font-bold mt-0.5">Live records of students graduating in 2026</p>
            </div>
            <button 
              onClick={() => onNavigate('placements')}
              className="text-xs font-extrabold text-brand-blue hover:text-brand-blue/80 flex items-center gap-1 transition-all"
            >
              View All Placements <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {recentPlacements.map((rp, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl bg-app-bg border border-app-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={rp.avatar} 
                    alt={rp.student} 
                    className="w-10 h-10 rounded-full object-cover border border-app-border shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-sm font-extrabold text-app-text leading-tight">{rp.student}</div>
                    <div className="text-[10px] text-app-muted font-bold mt-0.5">Department: <span className="text-brand-blue">{rp.dept}</span> | 2026 Batch</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-app-muted">Placed at</span>
                    <div className="text-sm font-black text-app-text">{rp.company}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-extrabold text-center min-w-[70px]">
                    {rp.package}
                  </div>
                  <span className="text-[10px] text-app-muted font-bold px-2 py-1 bg-app-surface border border-app-border rounded-md">
                    {rp.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* University Statistics with verified badge */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-app-surface/60 border border-app-border hover:border-app-border/80 transition-all card-shadow flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-display font-black text-app-text">University Statistics</h3>
              <p className="text-xs text-app-muted font-bold mt-0.5">Accumulated metrics of Xavier's University</p>
            </div>

            <div className="space-y-4">
              {/* Placement rate info */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-app-muted">Placement Rate</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-500">78%</span>
                    <span className="text-[9px] font-extrabold text-emerald-500 block">+4% this month</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-app-bg border border-app-border rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              {/* Highest Package */}
              <div className="p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Highest Package</span>
                  <div className="text-lg font-display font-black text-brand-violet mt-0.5">18.0 LPA</div>
                </div>
                <span className="text-[9px] font-bold text-brand-violet bg-brand-violet/10 px-2 py-1 rounded-md">
                  Offered
                </span>
              </div>

              {/* Average Package */}
              <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-app-muted">Average Package</span>
                  <div className="text-lg font-display font-black text-brand-blue mt-0.5">6.8 LPA</div>
                </div>
                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                  +0.6 LPA this month
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-500 leading-tight">Central placement Portal verified</div>
              <p className="text-[10px] text-emerald-500/80 font-bold mt-0.5">2026 Graduating Batch secure records</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
