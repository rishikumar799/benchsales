import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  MapPin, 
  GraduationCap, 
  Users, 
  Building2, 
  MoreVertical, 
  Edit, 
  Eye, 
  DollarSign, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface OpportunitiesTabProps {
  onAddOpportunity: () => void;
  onEditOpportunity: (job: any) => void;
  onViewApplications: (jobId: string, jobTitle: string) => void;
  jobsList: any[];
}

export default function OpportunitiesTab({ onAddOpportunity, onEditOpportunity, onViewApplications, jobsList }: OpportunitiesTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredJobs = jobsList.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesVisibility = visibilityFilter === 'All' || job.visibility === visibilityFilter;
    const matchesType = typeFilter === 'All' || job.type === typeFilter;
    return matchesSearch && matchesStatus && matchesVisibility && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Opportunities</h2>
          <p className="text-app-muted">Manage and track all placement opportunities.</p>
        </div>
        <button 
          onClick={onAddOpportunity}
          className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-brand-blue/20"
        >
          <Plus className="w-3.5 h-3.5" /> Create Opportunity
        </button>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="p-5 rounded-[28px] glass border-app-border card-shadow flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-surface border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        
        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Status: All</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>

          <select 
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Visibility: All</option>
            <option value="My University">My University</option>
            <option value="Selected Universities">Selected Universities</option>
            <option value="All Universities">All Universities</option>
          </select>

          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue transition-all"
          >
            <option value="All">Job Type: All</option>
            <option value="Full Time">Full Time</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Opportunities List Container */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:border-brand-blue/15 transition-all group"
            >
              {/* Job Logo and Primary Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-black text-sm shrink-0 border border-brand-blue/15 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {job.company.substring(0, 3).toUpperCase()}
                </div>
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-black text-base text-app-text leading-snug">{job.title}</span>
                    <span className="text-[10px] font-extrabold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded-full uppercase tracking-wider">{job.company}</span>
                    <span className="text-[10px] font-extrabold bg-app-surface border border-app-border text-app-muted px-2 py-0.5 rounded-md">{job.type}</span>
                  </div>
                  
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-app-muted pt-0.5">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Package: {job.package}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-app-muted" />
                      <span>{job.location}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-app-muted" />
                      <span>{job.eligibility}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applicants and Visibility Info */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
                <div className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border flex items-center gap-2">
                  <span className="font-black text-brand-blue">{job.applicants}</span>
                  <span className="text-app-muted">Applicants</span>
                </div>

                <div className="px-4 py-2.5 rounded-xl bg-app-surface border border-app-border flex items-center gap-2">
                  <span className="text-app-muted">Visibility:</span>
                  <span className="font-black text-emerald-500">{job.visibility}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full lg:w-auto self-stretch lg:self-center justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-app-border/40">
                <button 
                  onClick={() => onEditOpportunity(job)}
                  className="px-3.5 py-2.5 border border-app-border text-xs font-bold text-app-text-active hover:bg-app-surface rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button 
                  onClick={() => onViewApplications(job.id, job.title)}
                  className="px-4 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
                >
                  <ClipboardList className="w-3.5 h-3.5" /> View Applications
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-app-muted glass border border-app-border rounded-[28px] font-semibold text-sm">
            No opportunities found. Click "+ Create Opportunity" to launch a new job drive.
          </div>
        )}
      </div>
    </div>
  );
}
