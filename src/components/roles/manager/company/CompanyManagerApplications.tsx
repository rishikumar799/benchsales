import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  FileText, 
  User, 
  Phone, 
  Mail, 
  ChevronRight, 
  SlidersHorizontal,
  Briefcase,
  Sliders,
  CheckCircle,
  XCircle,
  Building
} from 'lucide-react';

interface CandidateProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  currentCompany: string;
  currentRole: string;
  skills: string[];
  about: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  appliedDate: string;
  dept: string;
}

interface CompanyManagerApplicationsProps {
  candidates: CandidateProfile[];
  onSelectCandidate: (candidateId: string) => void;
  onUpdateStatus: (id: string, status: CandidateProfile['status']) => void;
}

export default function CompanyManagerApplications({ 
  candidates, 
  onSelectCandidate, 
  onUpdateStatus 
}: CompanyManagerApplicationsProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          cand.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All' || cand.status === statusFilter;
    const matchesDept = deptFilter === 'All' || cand.dept === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Interview':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Shortlisted':
        return 'bg-teal-500/10 text-teal-500 border-teal-500/20';
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Applied':
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const uniqueDepts = Array.from(new Set(candidates.map(c => c.dept)));

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Submissions</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Sift and screen candidate submissions across your company portfolios.</p>
        </div>
      </div>

      {/* Advanced filtering */}
      <div className="p-4 rounded-3xl bg-app-surface/40 border border-app-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search by applicant name, role title, skills key list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none transition-colors"
            />
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto">
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-2xl px-4 py-2.5 text-xs font-bold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-2xl px-4 py-2.5 text-xs font-bold text-app-text focus:border-brand-blue outline-none cursor-pointer font-sans"
            >
              <option value="All">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

        </div>
      </div>

      {/* Cand list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCandidates.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-[32px] border border-dashed border-app-border text-app-muted font-bold bg-app-surface/25">
            <FileText className="w-12 h-12 text-app-muted/30 mx-auto mb-3" />
            No candidates or applications matched the filtering query.
          </div>
        ) : (
          filteredCandidates.map((cand) => (
            <div 
              key={cand.id} 
              className="p-6 rounded-[32px] glass border border-app-border card-shadow hover:border-brand-blue/20 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                
                {/* Visual title row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full blue-gradient flex items-center justify-center font-display font-black text-white text-sm">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-display font-black text-base text-app-text">{cand.name}</h3>
                      <p className="text-xs text-brand-blue font-bold mt-0.5">{cand.role}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border uppercase tracking-wider ${getStatusColor(cand.status)}`}>
                    {cand.status}
                  </span>
                </div>

                <p className="text-xs text-app-muted font-medium line-clamp-2 leading-relaxed">
                  {cand.about}
                </p>

                {/* Info blocks */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-app-muted">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-app-muted" /> <span className="truncate">{cand.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> <span>{cand.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Building className="w-3.5 h-3.5 text-brand-violet" /> <span className="truncate">{cand.currentCompany}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> <span>{cand.experience} Exp</span>
                  </div>
                </div>

                {/* Skills tags list */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cand.skills.slice(0, 4).map((sk, skIdx) => (
                    <span key={skIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-app-surface border border-app-border text-app-muted">
                      {sk}
                    </span>
                  ))}
                  {cand.skills.length > 4 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 text-app-muted">
                      +{cand.skills.length - 4} more
                    </span>
                  )}
                </div>

              </div>

              {/* Status updater actions bottom */}
              <div className="flex items-center justify-between border-t border-app-border/40 pt-4 mt-6">
                <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider">Applied {cand.appliedDate}</span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onSelectCandidate(cand.id)}
                    className="px-4.5 py-1.5 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue border border-brand-blue/20 font-bold text-xs rounded-xl transition-all"
                  >
                    Details
                  </button>
                  <select
                    value={cand.status}
                    onChange={(e) => onUpdateStatus(cand.id, e.target.value as CandidateProfile['status'])}
                    className="bg-app-surface border border-app-border rounded-xl px-2.5 py-1.5 text-xs font-bold text-app-text focus:border-brand-blue outline-none cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview">Interview</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
