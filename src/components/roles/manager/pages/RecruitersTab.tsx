import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Users, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  X,
  Sparkles,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  Briefcase
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  activeJobs: number;
  submissions: number;
  shortlisted: number;
  selected: number;
  successRate: string;
  placementRate: string;
  lastActive: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
  img: string;
  assignedJobs: string[];
}

export default function RecruitersTab() {
  
  // High fidelity dataset matching requirements exactly
  const [recruiters, setRecruiters] = useState<RecruiterType[]>([
    {
      id: "rec-1",
      name: "Rahul Singh",
      activeJobs: 4,
      submissions: 18,
      shortlisted: 14,
      selected: 8,
      successRate: "82%",
      placementRate: "68%",
      lastActive: "Today, 11:30 AM",
      joinDate: "12 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/rahul/100/100",
      assignedJobs: ["Frontend Developer", "DevOps Engineer"]
    },
    {
      id: "rec-2",
      name: "Priya Sharma",
      activeJobs: 3,
      submissions: 12,
      shortlisted: 8,
      selected: 5,
      successRate: "75%",
      placementRate: "50%",
      lastActive: "Today, 10:15 AM",
      joinDate: "18 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/priya/100/100",
      assignedJobs: ["Java Developer", "QA Engineer"]
    },
    {
      id: "rec-3",
      name: "Akash Verma",
      activeJobs: 5,
      submissions: 22,
      shortlisted: 18,
      selected: 12,
      successRate: "88%",
      placementRate: "80%",
      lastActive: "Yesterday, 6:20 PM",
      joinDate: "10 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/akash/100/100",
      assignedJobs: ["DevOps Engineer", "Frontend Developer", "Java Developer"]
    },
    {
      id: "rec-4",
      name: "Neha Patel",
      activeJobs: 2,
      submissions: 8,
      shortlisted: 4,
      selected: 2,
      successRate: "70%",
      placementRate: "25%",
      lastActive: "Yesterday, 4:45 PM",
      joinDate: "22 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/neha/100/100",
      assignedJobs: ["Frontend Developer", "QA Engineer"]
    },
    {
      id: "rec-5",
      name: "Karthik Nair",
      activeJobs: 3,
      submissions: 14,
      shortlisted: 10,
      selected: 6,
      successRate: "80%",
      placementRate: "66%",
      lastActive: "09 Jun 2026",
      joinDate: "15 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/karthik/100/100",
      assignedJobs: ["Frontend Developer"]
    },
    {
      id: "rec-6",
      name: "Vikas Mehta",
      activeJobs: 2,
      submissions: 6,
      shortlisted: 4,
      selected: 2,
      successRate: "60%",
      placementRate: "33%",
      lastActive: "08 Jun 2026",
      joinDate: "25 Mar 2026",
      status: "Inactive",
      img: "https://picsum.photos/seed/vikas/100/100",
      assignedJobs: []
    },
    {
      id: "rec-7",
      name: "Simran Kaur",
      activeJobs: 1,
      submissions: 3,
      shortlisted: 2,
      selected: 1,
      successRate: "90%",
      placementRate: "90%",
      lastActive: "07 Jun 2026",
      joinDate: "28 Mar 2026",
      status: "Active",
      img: "https://picsum.photos/seed/simran/100/100",
      assignedJobs: ["Frontend Developer"]
    }
  ]);

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'selected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType | null>(null);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
    }, 1200);
  };

  const filteredRecruiters = recruiters.filter(rec => {
    // Search filter
    const matchesSearch = rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.id.toLowerCase().includes(searchQuery.toLowerCase());
    // Status filter
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    // Sub-tab filter (Selected vs All)
    const matchesTab = activeSubTab === 'all' || rec.assignedJobs.length > 0;

    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Recruiters</h1>
          <p className="text-app-muted mt-1">Monitor, assign and coordinate marketplace sourcing partners.</p>
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
              <Download className="w-4 h-4" /> Export recruiters directory
            </>
          )}
        </button>
      </div>

      {/* Tab Switcher UI */}
      <div className="flex border-b border-app-border/40 gap-6">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`pb-4 text-sm font-bold transition-all relative select-none ${
            activeSubTab === 'all' 
              ? 'text-brand-blue' 
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          All Available Recruiters
          {activeSubTab === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('selected')}
          className={`pb-4 text-sm font-bold transition-all relative select-none ${
            activeSubTab === 'selected' 
              ? 'text-brand-blue' 
              : 'text-app-muted hover:text-app-text'
          }`}
        >
          Selected Recruiters
          {activeSubTab === 'selected' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-full" />
          )}
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search matching recruiters names or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
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
          {activeSubTab === 'all' ? (
            /* TAB 1: ALL AVAILABLE RECRUITERS */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider">
                  <th className="py-4 px-4">Recruiter</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4 text-center">Active Jobs</th>
                  <th className="py-4 px-4 text-center">Total Submissions</th>
                  <th className="py-4 px-4 text-center">Success Rate</th>
                  <th className="py-4 px-4 text-center">Placement Rate</th>
                  <th className="py-4 px-4">Last Active</th>
                  <th className="py-4 px-4">Join Date</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-xs">
                {filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((rec) => (
                    <tr key={rec.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rec.img} 
                            alt={rec.name} 
                            className="w-9 h-9 rounded-full object-cover border border-app-border shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-app-text block">{rec.name}</span>
                            <span className="text-[10px] text-app-muted block font-mono font-bold uppercase mt-0.5">{rec.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          rec.status === 'Active' 
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                            : 'bg-white/5 border-app-border text-app-muted'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${rec.status === 'Active' ? 'bg-emerald-500' : 'bg-app-muted'}`} />
                          {rec.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-app-text">{rec.activeJobs}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-blue">{rec.submissions}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.successRate}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-purple">{rec.placementRate}</td>
                      <td className="py-4 px-4 font-semibold text-app-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{rec.lastActive}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-app-muted">{rec.joinDate}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecruiter(rec)}
                          className="px-3 py-1.5 rounded-xl bg-brand-blue/10 hover:bg-brand-blue hover:text-white text-brand-blue text-[11px] font-bold transition-all"
                        >
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-app-muted">
                      <ShieldAlert className="w-10 h-10 mx-auto text-app-muted mb-3" />
                      <p className="font-semibold text-sm text-app-text">No available partner matches filters</p>
                      <p className="text-xs text-app-muted mt-1">Refine your keywords or reset active selectors.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* TAB 2: SELECTED RECRUITERS */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider">
                  <th className="py-4 px-4">Recruiter</th>
                  <th className="py-4 px-4">Assigned Jobs</th>
                  <th className="py-4 px-4 text-center">Active Jobs</th>
                  <th className="py-4 px-4 text-center">Submissions</th>
                  <th className="py-4 px-4 text-center">Shortlisted</th>
                  <th className="py-4 px-4 text-center">Selected</th>
                  <th className="py-4 px-4 text-center">Success Rate</th>
                  <th className="py-4 px-4">Last Activity</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-xs">
                {filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((rec) => (
                    <tr key={rec.id} className="hover:bg-app-surface/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rec.img} 
                            alt={rec.name} 
                            className="w-9 h-9 rounded-full object-cover border border-app-border shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-app-text block">{rec.name}</span>
                            <span className="text-[10px] text-app-muted block font-mono font-bold uppercase mt-0.5">{rec.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {rec.assignedJobs.map((jobName, idx) => (
                            <span 
                              key={idx}
                              className="text-[9px] font-bold bg-brand-blue/10 text-brand-blue border border-brand-blue/15 px-2 py-0.5 rounded"
                            >
                              {jobName}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-extrabold text-app-text">{rec.activeJobs}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-blue">{rec.submissions}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-brand-purple">{rec.shortlisted}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.selected}</td>
                      <td className="py-4 px-4 text-center font-extrabold text-emerald-500">{rec.successRate}</td>
                      <td className="py-4 px-4 font-semibold text-app-muted">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{rec.lastActive}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecruiter(rec)}
                          className="px-3 py-1.5 rounded-xl bg-brand-purple/10 hover:bg-brand-purple hover:text-white text-brand-purple text-[11px] font-bold transition-all whitespace-nowrap"
                        >
                          Manage Assignment
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-app-muted">
                      <ShieldAlert className="w-10 h-10 mx-auto text-app-muted mb-3" />
                      <p className="font-semibold text-sm text-app-text">No selected partner matches filters</p>
                      <p className="text-xs text-app-muted mt-1">Refine your keywords or choose assignable recruiters on jobs page.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination segment */}
      <div className="flex items-center justify-between text-xs font-semibold text-app-muted mt-4">
        <span>Showing 1 to {filteredRecruiters.length} of {activeSubTab === 'all' ? '16' : filteredRecruiters.length} recruiters</span>
        <div className="flex items-center gap-1">
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'<'}
          </button>
          <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
          <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
          <button className="p-2 border border-app-border rounded-xl bg-app-surface text-xs hover:text-app-text select-none">
            {'>'}
          </button>
        </div>
      </div>

      {/* Recruiter Details Modal Overlay */}
      {selectedRecruiter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-app-bg border border-app-border rounded-[32px] w-full max-w-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto card-shadow flex flex-col justify-between animate-fade-in">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedRecruiter.img} 
                    className="w-14 h-14 rounded-full object-cover border border-app-border shadow" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-2xl font-display font-bold text-app-text flex items-center gap-2">
                      {selectedRecruiter.name}
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-app-surface border border-app-border text-app-muted">
                        ID: {selectedRecruiter.id}
                      </span>
                    </h2>
                    <p className="text-xs text-app-muted mt-1 font-semibold">
                      Sourcing Partner since <span className="text-app-text">{selectedRecruiter.joinDate}</span> • Status: <span className="text-emerald-500 font-bold">{selectedRecruiter.status}</span>
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRecruiter(null)}
                  className="p-2 hover:bg-app-surface border border-app-border hover:border-app-muted rounded-full text-app-muted hover:text-app-text transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Performance Indicator Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                  Top Performer
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  High Placement Rate
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-brand-purple/10 text-brand-purple border-brand-purple/20 px-3 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  High Submission Rate
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold border bg-brand-blue/10 text-brand-blue border-brand-blue/20 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Consistent Recruiter
                </span>
              </div>

              {/* Business Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Active Jobs Worked</span>
                  <span className="text-lg font-display font-black text-app-text mt-1 block">
                    {selectedRecruiter.activeJobs}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Sourcing Conversions</span>
                  <div className="text-sm font-semibold text-app-text mt-1 space-y-0.5">
                    <div>Submissions: <span className="font-bold text-brand-blue">{selectedRecruiter.submissions}</span></div>
                    <div>Shortlisted: <span className="font-bold text-brand-purple">{selectedRecruiter.shortlisted}</span></div>
                    <div>Selected: <span className="font-bold text-emerald-500">{selectedRecruiter.selected}</span></div>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Placement Success Rate</span>
                  <span className="text-lg font-display font-black text-emerald-500 mt-1 block">
                    {selectedRecruiter.successRate}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Response SLA</span>
                  <span className="text-sm font-semibold text-app-text mt-1 block font-mono">
                    ~ 15 minutes
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Top Sourcing Skillset</span>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 border border-app-border text-app-muted">React</span>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 border border-app-border text-app-muted">Node.js</span>
                    <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white/5 border border-app-border text-app-muted">AWS</span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-app-surface/20 border border-app-border/60">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Most Active Vertical</span>
                  <span className="text-sm font-semibold text-brand-blue mt-1 block">
                    Engineering
                  </span>
                </div>
              </div>

              {/* Recent Activity Log */}
              <div className="mb-6 space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Recent Sourcing Activity</h3>
                <p className="text-xs font-medium text-app-text bg-app-surface/10 p-3 rounded-xl border border-app-border/40 font-mono">
                  Sourced {selectedRecruiter.submissions} total files. Last active timestamp: Today ({selectedRecruiter.lastActive}). Currently managing candidates for {selectedRecruiter.assignedJobs.length > 0 ? selectedRecruiter.assignedJobs.join(', ') : 'no current assigned roles'}.
                </p>
              </div>

              {/* Recent Candidate Submissions (Last 5) */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-app-muted uppercase tracking-wider">Recent Candidate Submissions (No Private Data)</h3>
                <div className="overflow-x-auto border border-app-border/60 rounded-2xl bg-app-surface/10">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-app-border text-[10px] font-extrabold text-app-muted uppercase tracking-wider bg-app-surface/30">
                        <th className="py-2.5 px-4">Candidate</th>
                        <th className="py-2.5 px-4">Requirement</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4 text-right">Submitted Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-app-border/40 font-medium text-app-muted">
                      <tr className="hover:bg-app-surface/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-app-text">Candidate #18</td>
                        <td className="py-3 px-4 text-brand-purple font-semibold">Frontend Developer</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">Selected</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[11px]">10 Jun 2026</td>
                      </tr>
                      <tr className="hover:bg-app-surface/20 transition-colors">
                        <td className="py-3 px-4 font-bold text-app-text">Candidate #12</td>
                        <td className="py-3 px-4 text-brand-purple font-semibold">DevOps Engineer</td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-blue/10 text-brand-blue border border-brand-blue/25">Shortlisted</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-[11px]">08 Jun 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-6 mt-6 border-t border-app-border/40">
              <button
                type="button"
                onClick={() => setSelectedRecruiter(null)}
                className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 rounded-xl text-xs font-extrabold text-white transition-all"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
