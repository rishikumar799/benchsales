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
  Sliders
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  email: string;
  activeJobs: number;
  applications: number;
  interviews: number;
  selections: number;
  avatar: string;
}

export default function CompanyManagerRecruiters() {
  
  // Entire recruiters list from the screenshot (bottom-left)
  const [recruitersList, setRecruitersList] = useState<RecruiterType[]>([
    { id: 'r-1', name: 'Priya Sharma', email: 'priya.sharma@company.com', activeJobs: 4, applications: 248, interviews: 26, selections: 8, avatar: 'https://picsum.photos/seed/priya/100/100' },
    { id: 'r-2', name: 'Rahul Verma', email: 'rahul.verma@company.com', activeJobs: 3, applications: 186, interviews: 18, selections: 6, avatar: 'https://picsum.photos/seed/rahulv/100/100' },
    { id: 'r-3', name: 'Neha Patel', email: 'neha.patel@company.com', activeJobs: 5, applications: 310, interviews: 30, selections: 9, avatar: 'https://picsum.photos/seed/nehap/100/100' },
    { id: 'r-4', name: 'Amit Singh', email: 'amit.singh@company.com', activeJobs: 2, applications: 142, interviews: 12, selections: 3, avatar: 'https://picsum.photos/seed/amits/100/100' },
    { id: 'r-5', name: 'Kavya Reddy', email: 'kavya.reddy@company.com', activeJobs: 3, applications: 167, interviews: 14, selections: 2, avatar: 'https://picsum.photos/seed/kavyar/100/100' },
    { id: 'r-6', name: 'Sandeep Joshi', email: 'sandeep.joshi@company.com', activeJobs: 2, applications: 128, interviews: 10, selections: 2, avatar: 'https://picsum.photos/seed/sandeep/100/100' },
    { id: 'r-7', name: 'Meera Iyer', email: 'meera.iyer@company.com', activeJobs: 1, applications: 65, interviews: 6, selections: 1, avatar: 'https://picsum.photos/seed/meera/100/100' },
    { id: 'r-8', name: 'Vikram Mehta', email: 'vikram.mehta@company.com', activeJobs: 2, applications: 124, interviews: 8, selections: 1, avatar: 'https://picsum.photos/seed/vikramm/100/100' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecruiter, setSelectedRecruiter] = useState<RecruiterType | null>(null);

  const filteredRecruiters = recruitersList.filter(rec => 
    rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Recruiters</h1>
          <p className="text-app-muted text-sm font-medium mt-1">View and manage recruiters working under your direct lineage.</p>
        </div>
      </div>

      {/* Modern filters bar */}
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
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-app-border/60 text-app-muted text-[11px] font-extrabold uppercase tracking-wider">
              <th className="pb-3 pl-4">Recruiter</th>
              <th className="pb-3">Email Address</th>
              <th className="pb-3 text-center">Active Jobs</th>
              <th className="pb-3 text-center">Applications</th>
              <th className="pb-3 text-center">Interviews Initiated</th>
              <th className="pb-3 text-center">Confirmed Selections</th>
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
                
                {/* Active Jobs */}
                <td className="py-4 text-sm font-extrabold text-center text-app-text">{rec.activeJobs}</td>
                
                {/* Applications */}
                <td className="py-4 text-sm font-extrabold text-center text-brand-blue">{rec.applications}</td>
                
                {/* Interviews */}
                <td className="py-4 text-sm font-extrabold text-center text-brand-violet">{rec.interviews}</td>
                
                {/* Selections */}
                <td className="py-4 text-sm font-black text-center text-emerald-500">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                    {rec.selections} Hires
                  </span>
                </td>

                {/* Button Action */}
                <td className="py-4 text-right pr-4">
                  <button 
                    onClick={() => setSelectedRecruiter(rec)}
                    className="px-4 py-1.5 bg-app-surface border border-app-border hover:bg-app-surface/80 text-app-text font-bold text-xs rounded-xl transition-all"
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
                className="p-1.5 border border-app-border hover:bg-app-surface rounded-lg text-app-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <div className="text-xs font-bold text-app-muted">Jobs</div>
                <div className="text-lg font-black text-blue-500 mt-1">{selectedRecruiter.activeJobs}</div>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="text-xs font-bold text-app-muted">Sourced</div>
                <div className="text-lg font-black text-emerald-500 mt-1">{selectedRecruiter.applications}</div>
              </div>
              <div className="p-3 bg-violet-500/5 rounded-xl border border-violet-500/10">
                <div className="text-xs font-bold text-app-muted">Interviews</div>
                <div className="text-lg font-black text-violet-500 mt-1">{selectedRecruiter.interviews}</div>
              </div>
              <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                <div className="text-xs font-bold text-app-muted">Hires</div>
                <div className="text-lg font-black text-amber-500 mt-1">{selectedRecruiter.selections}</div>
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
              className="w-full py-3 bg-app-surface border border-app-border hover:bg-app-surface/80 rounded-xl text-xs font-extrabold text-app-text"
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
function X(props: React.SVGProps<SVGSVGElement>) {
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
