import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  MapPin, 
  Briefcase, 
  Calendar, 
  UserCheck, 
  CheckCircle,
  Eye,
  SlidersHorizontal,
  Mail,
  Sliders,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  email: string;
  activeJobs: number;
  submissions: number;
  shortlisted: number;
  interviews: number;
  hires: number;
  avatar: string;
  lastActive: string;
  isSelected: boolean;
  isAssigned: boolean;
}

export default function CompanyManagerRecruiters() {
  
  // Entire recruiters list split by Selected, Assigned and All Available with requested metrics
  const [recruitersList] = useState<RecruiterType[]>([
    { id: 'r-1', name: 'Priya Sharma', email: 'priya.sharma@company.com', activeJobs: 4, submissions: 248, shortlisted: 54, interviews: 26, hires: 8, avatar: 'https://picsum.photos/seed/priya/100/100', lastActive: '2 hrs ago', isSelected: true, isAssigned: true },
    { id: 'r-2', name: 'Rahul Verma', email: 'rahul.verma@company.com', activeJobs: 3, submissions: 186, shortlisted: 36, interviews: 18, hires: 6, avatar: 'https://picsum.photos/seed/rahulv/100/100', lastActive: '4 hrs ago', isSelected: true, isAssigned: true },
    { id: 'r-3', name: 'Neha Patel', email: 'neha.patel@company.com', activeJobs: 5, submissions: 310, shortlisted: 68, interviews: 30, hires: 9, avatar: 'https://picsum.photos/seed/nehap/100/100', lastActive: 'Just now', isSelected: true, isAssigned: true },
    { id: 'r-4', name: 'Amit Singh', email: 'amit.singh@company.com', activeJobs: 2, submissions: 142, shortlisted: 22, interviews: 12, hires: 3, avatar: 'https://picsum.photos/seed/amits/100/100', lastActive: '1 day ago', isSelected: true, isAssigned: true },
    { id: 'r-5', name: 'Kavya Reddy', email: 'kavya.reddy@company.com', activeJobs: 0, submissions: 167, shortlisted: 31, interviews: 14, hires: 2, avatar: 'https://picsum.photos/seed/kavyar/100/100', lastActive: '3 days ago', isSelected: false, isAssigned: false },
    { id: 'r-6', name: 'Sandeep Joshi', email: 'sandeep.joshi@company.com', activeJobs: 0, submissions: 128, shortlisted: 20, interviews: 10, hires: 2, avatar: 'https://picsum.photos/seed/sandeep/100/100', lastActive: '5 days ago', isSelected: false, isAssigned: false },
    { id: 'r-7', name: 'Meera Iyer', email: 'meera.iyer@company.com', activeJobs: 0, submissions: 65, shortlisted: 11, interviews: 6, hires: 1, avatar: 'https://picsum.photos/seed/meera/100/100', lastActive: '1 week ago', isSelected: false, isAssigned: false },
    { id: 'r-8', name: 'Vikram Mehta', email: 'vikram.mehta@company.com', activeJobs: 0, submissions: 124, shortlisted: 18, interviews: 8, hires: 1, avatar: 'https://picsum.photos/seed/vikramm/100/100', lastActive: '2 weeks ago', isSelected: false, isAssigned: false },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSegment, setActiveSegment] = useState<'selected' | 'assigned' | 'all'>('selected');
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType | null>(null);

  // Segment filter first
  const segmentedRecruiters = recruitersList.filter(rec => {
    if (activeSegment === 'selected') return rec.isSelected;
    if (activeSegment === 'assigned') return rec.isAssigned;
    return true; // all
  });

  // Search filter
  const filteredRecruiters = segmentedRecruiters.filter(rec => 
    rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Recruiters</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Monitor recruitment performance and track sourcing channels across your ecosystem.</p>
        </div>
      </div>

      {/* Segment tabs */}
      <div className="flex border-b border-app-border/40 gap-6">
        <button
          onClick={() => setActiveSegment('selected')}
          className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
            activeSegment === 'selected' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Selected Recruiters ({recruitersList.filter(r => r.isSelected).length})
        </button>
        <button
          onClick={() => setActiveSegment('assigned')}
          className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
            activeSegment === 'assigned' 
              ? 'border-brand-violet text-brand-violet' 
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          Assigned Recruiters ({recruitersList.filter(r => r.isAssigned).length})
        </button>
        <button
          onClick={() => setActiveSegment('all')}
          className={`pb-3 text-sm font-extrabold transition-all border-b-2 cursor-pointer ${
            activeSegment === 'all' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          All Available Recruiters ({recruitersList.length})
        </button>
      </div>

      {/* Modern search bar */}
      <div className="p-4 rounded-3xl bg-app-surface/40 border border-app-border">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search recruiters by name or company email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none transition-colors"
          />
        </div>
      </div>

      {/* Grid Recruiters Table */}
      <div className="p-6 rounded-[32px] glass border border-app-border card-shadow overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-app-border/60 text-app-muted text-[11px] font-extrabold uppercase tracking-wider">
              <th className="pb-3 pl-4">Recruiter</th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3 text-center">Last Active</th>
              <th className="pb-3 text-center">Active Jobs</th>
              <th className="pb-3 text-center">Total Submissions</th>
              <th className="pb-3 text-center">Shortlisted</th>
              <th className="pb-3 text-center">Interviews Created</th>
              <th className="pb-3 text-center">Confirmed Hires</th>
              <th className="pb-3 text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecruiters.map((rec) => (
              <tr key={rec.id} className="border-b border-app-border/40 hover:bg-app-surface/30 transition-colors">
                
                {/* Visual profile */}
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={rec.avatar} 
                      alt={rec.name} 
                      className="w-9 h-9 rounded-full object-cover border border-app-border" 
                    />
                    <div className="font-bold text-sm text-app-text">{rec.name}</div>
                  </div>
                </td>
                
                {/* Email */}
                <td className="py-4 text-sm font-semibold text-app-muted font-mono">{rec.email}</td>
                
                {/* Last Active */}
                <td className="py-4 text-xs font-semibold text-center text-app-muted">{rec.lastActive}</td>

                {/* Active Jobs */}
                <td className="py-4 text-sm font-extrabold text-center text-app-text">{rec.activeJobs}</td>
                
                {/* Submissions */}
                <td className="py-4 text-sm font-extrabold text-center text-brand-blue">{rec.submissions}</td>
                
                {/* Shortlisted */}
                <td className="py-4 text-sm font-extrabold text-center text-violet-500">{rec.shortlisted}</td>

                {/* Interviews */}
                <td className="py-4 text-sm font-extrabold text-center text-brand-violet">{rec.interviews}</td>
                
                {/* Hires */}
                <td className="py-4 text-sm font-black text-center text-emerald-500">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                    {rec.hires} Hires
                  </span>
                </td>

                {/* Button Action */}
                <td className="py-4 text-right pr-4">
                  <button 
                    onClick={() => setSelectedRecruiter(rec)}
                    className="px-4 py-1.5 bg-app-surface border border-app-border hover:bg-app-surface/80 text-app-text font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    View Activity
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple active activity details overlay */}
      {selectedRecruiter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-app-bg border border-app-border rounded-[32px] max-w-xl w-full p-6 sm:p-8 card-shadow space-y-6">
            <div className="flex justify-between items-center border-b border-app-border/60 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedRecruiter.avatar} alt={selectedRecruiter.name} className="w-12 h-12 rounded-full border border-app-border" />
                <div>
                  <h3 className="font-display font-black text-lg text-app-text">{selectedRecruiter.name}</h3>
                  <div className="text-xs text-app-muted font-bold flex items-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {selectedRecruiter.email}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedRecruiter(null)}
                className="p-1.5 border border-app-border hover:bg-app-surface rounded-lg text-app-muted cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Jobs</div>
                <div className="text-lg font-black text-blue-500 mt-1">{selectedRecruiter.activeJobs}</div>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Submissions</div>
                <div className="text-lg font-black text-emerald-500 mt-1">{selectedRecruiter.submissions}</div>
              </div>
              <div className="p-3 bg-violet-500/5 rounded-xl border border-violet-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Interviews</div>
                <div className="text-lg font-black text-violet-500 mt-1">{selectedRecruiter.interviews}</div>
              </div>
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <div className="text-[10px] font-bold text-app-muted uppercase">Hires</div>
                <div className="text-lg font-black text-amber-500 mt-1">{selectedRecruiter.hires}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-app-muted">Detailed Daily Ledger</h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 text-xs">
                <div className="p-3 bg-app-surface/60 rounded-xl border border-app-border flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-app-text">Submitted candidate to Senior Backend Engineer</span>
                    <span className="text-[10px] text-app-muted font-bold mt-0.5 block">Candidate: Rohan Sen</span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15 uppercase">Success</span>
                </div>
                <div className="p-3 bg-app-surface/60 rounded-xl border border-app-border flex justify-between items-center">
                  <div>
                    <span className="font-bold block text-app-text">Conducted screening video interview</span>
                    <span className="text-[10px] text-app-muted font-bold mt-0.5 block">Candidate: Kavita Deshmukh</span>
                  </div>
                  <span className="text-[9px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded border border-brand-blue/15 uppercase">Completed</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedRecruiter(null)}
              className="w-full py-3 bg-app-surface border border-app-border hover:bg-app-surface/80 rounded-xl text-xs font-extrabold text-app-text cursor-pointer"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Help utility for closing modal
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
      className={props.className}
      {...props}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
