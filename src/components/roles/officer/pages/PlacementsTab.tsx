import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  FileSpreadsheet,
  Download
} from 'lucide-react';

export default function PlacementsTab() {
  const [search, setSearch] = useState('');

  const placementRecords = [
    { name: 'Rahul Kumar', company: 'TCS', role: 'Software Engineer', lpa: '7.00 LPA', date: '15 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/rahul/100/100' },
    { name: 'Anjali Sharma', company: 'Infosys', role: 'System Engineer', lpa: '6.50 LPA', date: '10 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/anjali/100/100' },
    { name: 'Neha Singh', company: 'Wipro', role: 'Associate Engineer', lpa: '5.80 LPA', date: '20 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/neha/100/100' },
    { name: 'Vikram Patel', company: 'Accenture', role: 'Data Analyst', lpa: '7.50 LPA', date: '12 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/vikram/100/100' },
    { name: 'Pooja Verma', company: 'Capgemini', role: 'Analyst', lpa: '6.00 LPA', date: '18 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/pooja/100/100' },
    { name: 'Arjun Mehta', company: 'TCS', role: 'Software Engineer', lpa: '8.50 LPA', date: '15 Jul 2026', status: 'Confirmed', avatar: 'https://picsum.photos/seed/arjun/100/100' },
  ];

  const summaryCards = [
    { label: 'Total Placed', val: '186', change: '+18 this month', color: 'text-emerald-500' },
    { label: 'Placement Rate', val: '78%', change: '+6% from last year', color: 'text-violet-500' },
    { label: 'Highest Package', val: '18 LPA', change: 'TCS Placement', color: 'text-brand-blue' },
    { label: 'Average Package', val: '6.8 LPA', change: '+0.5 from last year', color: 'text-emerald-500 font-bold' },
  ];

  const filteredRecords = placementRecords.filter(rec => 
    rec.name.toLowerCase().includes(search.toLowerCase()) || 
    rec.company.toLowerCase().includes(search.toLowerCase()) ||
    rec.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Placements</h2>
          <p className="text-app-muted">Track recruitment placement offers, offers of intent, and joining schedules.</p>
        </div>
        <button 
          onClick={() => alert('Downloading official placements report...')}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
        >
          <Download className="w-3.5 h-3.5" /> Download PDF Report
        </button>
      </div>

      {/* Summary KPI section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="p-5 rounded-[22px] bg-app-surface/60 border border-app-border space-y-1 hover:border-brand-blue/25 transition-all">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{card.label}</span>
            <div className={`text-2xl sm:text-3xl font-display font-black ${card.color}`}>{card.val}</div>
            <p className="text-xs text-app-muted font-semibold">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Search Input Filter */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search placed students, company names, or roles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
      </div>

      {/* Placed Table */}
      <div className="glass border-app-border rounded-[28px] overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border/40 bg-app-surface/20">
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted pl-6">Student</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Company</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Role</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Package (LPA)</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Joining Date</th>
                <th className="p-4.5 text-xs font-bold uppercase tracking-wider text-app-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec, index) => (
                  <tr key={index} className="hover:bg-app-surface/30 transition-colors">
                    {/* Student */}
                    <td className="p-4.5 pl-6 font-semibold text-app-text flex items-center gap-3">
                      <img 
                        src={rec.avatar} 
                        alt={rec.name} 
                        className="w-8.5 h-8.5 rounded-full object-cover border border-app-border" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="font-extrabold text-sm text-app-text">{rec.name}</span>
                    </td>

                    {/* Company */}
                    <td className="p-4.5 font-bold text-app-text-active">{rec.company}</td>

                    {/* Role */}
                    <td className="p-4.5 text-xs font-bold text-app-muted">{rec.role}</td>

                    {/* Package */}
                    <td className="p-4.5 text-sm font-black text-brand-blue">{rec.lpa}</td>

                    {/* Date */}
                    <td className="p-4.5 text-xs font-semibold text-app-muted">{rec.date}</td>

                    {/* Status */}
                    <td className="p-4.5 text-xs font-bold">
                      <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] uppercase font-black tracking-wide">
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-app-muted text-sm font-semibold">
                    No placement records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-app-border/40 text-center text-xs text-app-muted font-bold bg-app-surface/10">
          Showing 1 to {filteredRecords.length} of 186 verified student placement logs
        </div>
      </div>
    </div>
  );
}
