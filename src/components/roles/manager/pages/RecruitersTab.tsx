import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XOctagon, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  activeJobs: number;
  submissions: number;
  lastActive: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  img: string;
}

export default function RecruitersTab() {
  
  // High fidelity dataset matching Image 4 exactly
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([
    {
      id: "rec-1",
      name: "Rahul Singh",
      activeJobs: 4,
      submissions: 18,
      lastActive: "Today, 11:30 AM",
      joinDate: "12 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/rahul/100/100"
    },
    {
      id: "rec-2",
      name: "Priya Sharma",
      activeJobs: 3,
      submissions: 12,
      lastActive: "Today, 10:15 AM",
      joinDate: "18 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/priya/100/100"
    },
    {
      id: "rec-3",
      name: "Akash Verma",
      activeJobs: 5,
      submissions: 22,
      lastActive: "Yesterday, 6:20 PM",
      joinDate: "10 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/akash/100/100"
    },
    {
      id: "rec-4",
      name: "Neha Patel",
      activeJobs: 2,
      submissions: 8,
      lastActive: "Yesterday, 4:45 PM",
      joinDate: "22 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/neha/100/100"
    },
    {
      id: "rec-5",
      name: "Karthik Nair",
      activeJobs: 3,
      submissions: 14,
      lastActive: "09 Jun 2026",
      joinDate: "15 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/karthik/100/100"
    },
    {
      id: "rec-6",
      name: "Vikas Mehta",
      activeJobs: 2,
      submissions: 6,
      lastActive: "08 Jun 2026",
      joinDate: "25 Mar 2026",
      status: "Inactive",
      img: "https://picsum.photos/seed/vikas/100/100"
    },
    {
      id: "rec-7",
      name: "Simran Kaur",
      activeJobs: 1,
      submissions: 3,
      lastActive: "07 Jun 2026",
      joinDate: "28 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/simran/100/100"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Sourcing partner directory downloaded successfully of Ecosystem 1.');
    }, 1200);
  };

  const filteredRecruiters = recruiters.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Recruiters</h1>
          <p className="text-app-muted mt-1">View all recruiters and their activity in the marketplace.</p>
        </div>
        <button 
          onClick={handleExport}
          className="px-5 py-3.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shrink-0 border border-brand-blue/20"
        >
          {isExporting ? (
            <>
              <span className="w-4 h-4 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Export recruiters list
            </>
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search matching recruiters names..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-4 py-3 text-xs font-semibold text-app-text outline-none cursor-pointer flex-1 md:flex-initial"
          >
            <option value="All">All statuses (All)</option>
            <option value="Active">Active Partners</option>
            <option value="Inactive">Inactive Partners</option>
          </select>
        </div>
      </div>

      {/* Recruiters catalog table */}
      <div className="p-6 rounded-[28px] glass border border-app-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                <th className="py-4 px-4">Recruiter</th>
                <th className="py-4 px-4 text-center">Active Jobs</th>
                <th className="py-4 px-4 text-center">Submissions</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-4">Join Date</th>
                <th className="py-4 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-sm">
              {filteredRecruiters.length > 0 ? (
                filteredRecruiters.map((rec) => (
                  <tr key={rec.id} className="hover:bg-app-surface/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={rec.img} 
                          alt={rec.name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-brand-blue/20 p-0.5 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-extrabold text-app-text block">{rec.name}</span>
                          <span className="text-[10px] text-app-muted block font-mono font-extrabold uppercase mt-0.5">Sourcing Partner</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-app-text">{rec.activeJobs}</td>
                    <td className="py-4 px-4 text-center font-extrabold text-brand-blue">{rec.submissions}</td>
                    <td className="py-4 px-4 font-semibold text-app-text text-xs">
                      <div className="flex items-center gap-1.5 text-app-muted">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{rec.lastActive}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-xs text-app-muted">{rec.joinDate}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${
                        rec.status === 'Active' 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                          : 'bg-white/5 border-app-border text-app-muted'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${rec.status === 'Active' ? 'bg-emerald-500' : 'bg-app-muted'}`} />
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted">
                    <ShieldAlert className="w-10 h-10 mx-auto text-app-muted mb-3" />
                    <p className="font-semibold text-sm text-app-text">No partner matches active query filters</p>
                    <p className="text-xs text-app-muted mt-1">Refine your keyword indices or clear search tags.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination section */}
      <div className="flex items-center justify-between text-xs font-semibold text-app-muted mt-4">
        <span>Showing 1 to {filteredRecruiters.length} of 16 recruiters</span>
        <div className="flex items-center gap-1">
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'>'}
          </button>
        </div>
      </div>

    </div>
  );
}
