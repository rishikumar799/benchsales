import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Eye, AlertCircle } from 'lucide-react';

export default function EmployeeApplicationsTab() {
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');

  const statusMetrics = [
    { label: 'All', count: 7 },
    { label: 'Applied', count: 2 },
    { label: 'Under Review', count: 1 },
    { label: 'Shortlisted', count: 3 },
    { label: 'Interview', count: 1 },
    { label: 'Selected', count: 0 },
    { label: 'Rejected', count: 1 }
  ];

  const applications = [
    { role: 'Senior Software Engineer', department: 'Engineering Team', date: '10 May 2024', status: 'Applied', statusColor: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
    { role: 'Cloud Engineer', department: 'Infrastructure Team', date: '09 May 2024', status: 'Under Review', statusColor: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
    { role: 'Tech Lead', department: 'Platform Team', date: '08 May 2024', status: 'Shortlisted', statusColor: 'bg-violet-500/10 border-violet-500/20 text-violet-500' },
    { role: 'Data Scientist', department: 'Data Team', date: '07 May 2024', status: 'Rejected', statusColor: 'bg-red-500/10 border-red-500/20 text-red-500' },
    { role: 'DevOps Architect', department: 'Infrastructure Team', date: '06 May 2024', status: 'Shortlisted', statusColor: 'bg-violet-500/10 border-violet-500/20 text-violet-500' },
    { role: 'Technical Program Manager', department: 'Engineering Team', date: '05 May 2024', status: 'Interview', statusColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
    { role: 'ML Engineer', department: 'Data Team', date: '03 May 2024', status: 'Shortlisted', statusColor: 'bg-violet-500/10 border-violet-500/20 text-violet-500' }
  ];

  const filteredApps = useMemo(() => {
    if (selectedStatusTab === 'All') return applications;
    return applications.filter(app => app.status === selectedStatusTab);
  }, [selectedStatusTab]);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-black text-app-text">Applications</h2>
        <p className="text-xs text-app-muted mt-1 font-semibold">Track your internal job applications.</p>
      </div>

      {/* Dynamic Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-app-border/40 pb-4">
        {statusMetrics.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setSelectedStatusTab(tab.label)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              selectedStatusTab === tab.label
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-app-surface text-app-muted border border-app-border hover:text-app-text'
            }`}
          >
            <span className="mr-1">{tab.label}</span>
            <span className={`inline-flex items-center justify-center font-mono text-[9px] rounded-full px-1.5 py-0.5 ${
              selectedStatusTab === tab.label ? 'bg-white/25 text-white' : 'bg-app-bg text-app-muted border border-app-border'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Applications Table Card */}
      <div className="rounded-[32px] bg-app-surface border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border bg-app-bg/50">
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Role</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Department</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Applied Date</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted">Status</th>
                <th className="p-6 text-xs font-bold uppercase tracking-widest text-app-muted text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border">
              {filteredApps.length > 0 ? (
                filteredApps.map((row, idx) => (
                  <tr key={idx} className="hover:bg-app-bg/20 transition-all font-semibold">
                    <td className="p-6">
                      <div className="font-display font-black text-app-text text-sm">{row.role}</div>
                      <div className="text-[10px] text-app-muted font-bold mt-0.5">Corporate Internal Posting</div>
                    </td>
                    <td className="p-6 text-xs text-app-text">{row.department}</td>
                    <td className="p-6 text-xs text-app-muted font-mono">{row.date}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider ${row.statusColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => alert(`Showing status progress timeline for ${row.role}. Internal screening is fully authorized. Current status: ${row.status}`)}
                        className="p-2.5 border border-app-border rounded-xl bg-app-bg hover:bg-app-surface text-app-muted hover:text-app-text transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-app-muted text-sm py-20 font-bold">
                    <div className="w-12 h-12 bg-app-surface border border-app-border rounded-full flex items-center justify-center mx-auto mb-3 text-app-muted/60">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    No applications listed under the "{selectedStatusTab}" filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
