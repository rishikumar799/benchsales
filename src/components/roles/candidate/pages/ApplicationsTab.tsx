import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  Briefcase, 
  Search,
  MoreVertical,
  ChevronRight,
  TrendingDown
} from 'lucide-react';

export default function ApplicationsTab() {
  const [activeSubTab, setActiveSubTab] = useState('All');

  const subTabs = [
    { id: 'Today', label: 'Applied Today' },
    { id: 'Week', label: 'Applied This Week' },
    { id: 'Month', label: 'Applied This Month' },
    { id: 'All', label: 'All Applications' }
  ];

  const applications = [
    { role: 'Frontend Developer', company: 'Google', time: '2 hours ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { role: 'UI/UX Designer', company: 'Figma', time: '5 hours ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { role: 'Backend Developer', company: 'Flipkart', time: '1 day ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { role: 'React Developer', company: 'Swiggy', time: '1 day ago', status: 'Submitted', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    { role: 'Full Stack Developer', company: 'Microsoft', time: '2 days ago', status: 'Viewed', color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
    { role: 'Software Engineer', company: 'Amazon', time: '3 days ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    { role: 'Web Developer', company: 'Zoho', time: '3 days ago', status: 'Expired', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
    { role: 'Frontend Engineer', company: 'Infosys', time: '5 days ago', status: 'Closed', color: 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20' }
  ];

  const topCompanies = [
    { name: 'Google', count: 24, max: 25 },
    { name: 'Microsoft', count: 18, max: 25 },
    { name: 'Amazon', count: 16, max: 25 },
    { name: 'Swiggy', count: 14, max: 25 },
    { name: 'Infosys', count: 12, max: 25 }
  ];

  // Filtering based on horizontal sub-tabs
  const filteredApps = applications.filter(app => {
    if (activeSubTab === 'Today') return app.time.includes('hour');
    if (activeSubTab === 'Week') return !app.time.includes('Month') && !app.time.includes('5 days');
    return true; // default All
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Applications</h1>
        <p className="text-app-muted text-sm mt-1">Monitor the lifecycle status of your submitted applications on Aryx AI.</p>
      </div>

      {/* Applied horizontal sub-tabs block from page 4 */}
      <div className="border-b border-app-border/40 pb-px flex gap-6 overflow-x-auto">
        {subTabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActiveSubTab(tb.id)}
            className={`pb-4 text-xs font-bold uppercase tracking-wider relative transition-all whitespace-nowrap ${
              activeSubTab === tb.id ? 'text-brand-blue' : 'text-app-muted hover:text-app-text'
            }`}
          >
            {tb.label}
            {activeSubTab === tb.id && (
              <motion.div 
                layoutId="activeSubTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (List of applications table overview) */}
        <div className="lg:col-span-8 space-y-3">
          {filteredApps.map((app, idx) => (
            <div 
              key={idx} 
              className="p-4 sm:p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex items-center justify-between gap-4 hover:border-brand-blue/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                  <Building className="w-5 h-5 opacity-85" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-app-text tracking-tight">{app.role}</h3>
                  <div className="flex gap-2.5 mt-0.5 text-[10px] text-app-muted font-bold uppercase">
                    <span>{app.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${app.color}`}>
                  {app.status}
                </span>
                
                <button className="px-3.5 py-1.5 bg-app-bg hover:bg-app-surface border border-app-border rounded-lg text-[10px] font-bold text-app-text hover:text-brand-blue transition-all flex items-center gap-1">
                  View <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (Distribution Pie representation & Top Companies) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Applications summary doughnut block */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text w-full text-left">Application Summary</h3>
            
            {/* Visual Progress ring with total counter */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#E2E8F0" strokeWidth="12" strokeOpacity="0.1" fill="transparent" />
                {/* Visual divided rings for distribution */}
                <circle cx="72" cy="72" r="62" stroke="#3B82F6" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="120" strokeLinecap="round" />
                <circle cx="72" cy="72" r="62" stroke="#8B5CF6" strokeWidth="12" fill="transparent" strokeDasharray="390" strokeDashoffset="310" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-black text-app-text">245</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-app-muted">Total Applications</span>
              </div>
            </div>

            {/* Segment legends row with counters */}
            <div className="w-full space-y-2 border-t border-app-border/40 pt-4 text-xs font-bold text-app-muted">
              {[
                { label: 'Applied', count: 180, color: 'bg-blue-500' },
                { label: 'Submitted', count: 30, color: 'bg-emerald-500' },
                { label: 'Viewed', count: 25, color: 'bg-violet-500' },
                { label: 'Expired', count: 10, color: 'bg-red-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="text-app-text">{item.label}</span>
                  </div>
                  <span className="font-mono">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Companies bar distribution */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text">Top Companies</h3>
            
            <div className="space-y-3.5">
              {topCompanies.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-app-text">
                    <span>{comp.name}</span>
                    <span className="text-app-muted font-mono">{comp.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-app-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full" 
                      style={{ width: `${(comp.count / comp.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
