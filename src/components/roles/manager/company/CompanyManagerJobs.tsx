import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Plus, 
  Edit, 
  MoreVertical, 
  Users, 
  FileText,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Trash2
} from 'lucide-react';

interface JobType {
  id: string;
  title: string;
  dept: string;
  location: string;
  applicationsCount: number;
  openings: number;
  status: 'Active' | 'Draft' | 'Closed';
  experience: string;
  type: string;
  reach: 'Internal - My Company' | 'Cross Company Network' | 'Across All Companies';
  recruitersAssigned: string[];
}

interface CompanyManagerJobsProps {
  jobsList: JobType[];
  onAddJobClick: () => void;
  onEditJobClick: (job: JobType) => void;
  onDeleteJobClick: (id: string) => void;
  onViewPipelineClick: (jobTitle: string) => void;
}

export default function CompanyManagerJobs({ 
  jobsList, 
  onAddJobClick, 
  onEditJobClick, 
  onDeleteJobClick,
  onViewPipelineClick
}: CompanyManagerJobsProps) {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter list
  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDept = deptFilter === 'All' || job.dept === deptFilter;
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getReachColor = (reach: string) => {
    switch (reach) {
      case 'Internal - My Company':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/15';
      case 'Cross Company Network':
        return 'bg-violet-500/10 text-violet-500 border-violet-500/15';
      case 'Across All Companies':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/15';
      default:
        return 'bg-app-bg text-app-text border-app-border';
    }
  };

  const uniqueDepts = Array.from(new Set(jobsList.map(j => j.dept)));

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight animate-fade-in">Jobs</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Manage and track all jobs created by your organization.</p>
        </div>
        <button 
          onClick={onAddJobClick}
          className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shadow-lg shadow-brand-blue/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Create Job
        </button>
      </div>

      {/* Grid Filter controls */}
      <div className="p-4 rounded-3xl bg-app-surface/40 border border-app-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search jobs by title, department, or office location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 items-center w-full md:w-auto">
            {/* Department Selector */}
            <select 
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-2xl px-4 py-3 text-xs font-bold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {uniqueDepts.map((d, sIdx) => (
                <option key={sIdx} value={d}>{d}</option>
              ))}
            </select>

            {/* Status Selector */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-2xl px-4 py-3 text-xs font-bold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs List Grid/Cards */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center rounded-[32px] border border-dashed border-app-border text-app-muted font-bold bg-app-surface/20">
            <Briefcase className="w-12 h-12 text-app-muted/40 mx-auto mb-3" />
            No matching corporate job requisitions found.
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-5 sm:p-6 rounded-3xl glass border border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display font-black text-base text-app-text leading-tight">{job.title}</h3>
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getReachColor(job.reach)}`}>
                      {job.reach}
                    </span>
                  </div>
                  
                  {/* Metadata line */}
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-bold text-app-muted mt-2">
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                    <span>•</span>
                    <span>Experience: {job.experience}</span>
                  </div>

                  {/* Assigned Recruiters details */}
                  <div className="text-xs font-semibold text-app-muted mt-3">
                    <span className="text-brand-violet font-bold">Recruiters: </span>
                    {job.recruitersAssigned.join(', ')}
                  </div>
                </div>
              </div>

              {/* Stats and Action Group */}
              <div className="flex flex-row md:flex-col lg:flex-row items-center gap-6 w-full md:w-auto justify-between border-t border-app-border/40 md:border-0 pt-4 md:pt-0 shrink-0">
                
                {/* Visual statistics */}
                <div className="flex gap-6">
                  <div className="text-center md:text-right lg:text-center shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-app-muted block">Applications</span>
                    <span className="text-xl font-display font-black text-app-text mt-0.5 block">{job.applicationsCount}</span>
                  </div>
                  <div className="text-center md:text-right lg:text-center shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-app-muted block">Openings</span>
                    <span className="text-xl font-display font-black text-app-text mt-0.5 block">{job.openings}</span>
                  </div>
                </div>

                {/* Left active status label */}
                <div className="mx-0 md:mx-4 shrink-0 text-right">
                  <span className={`text-xs font-display font-black px-3 py-1 rounded-xl border uppercase tracking-wider ${
                    job.status === 'Active' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' 
                      : job.status === 'Draft' 
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/25' 
                      : 'bg-red-500/10 text-red-500 border-red-500/25'
                  }`}>
                    {job.status}
                  </span>
                </div>

                {/* Interactive button layout */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onViewPipelineClick(job.title)}
                    className="px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 hover:bg-brand-blue/15 text-brand-blue font-bold text-xs rounded-xl"
                  >
                    View Pipeline
                  </button>
                  <button 
                    onClick={() => onEditJobClick(job)}
                    className="px-4 py-2 bg-app-surface border border-app-border hover:bg-app-surface/80 text-app-text font-bold text-xs rounded-xl"
                  >
                    Edit Job
                  </button>
                  <button 
                    onClick={() => onDeleteJobClick(job.id)}
                    className="p-2 border border-red-500/10 hover:border-red-500/25 text-red-500 hover:bg-red-500/10 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
