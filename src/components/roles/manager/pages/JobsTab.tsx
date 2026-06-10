import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Plus, 
  Edit, 
  Play, 
  Pause, 
  MoreVertical, 
  Users, 
  FileText,
  Briefcase,
  SlidersHorizontal,
  Trash2
} from 'lucide-react';

interface JobType {
  id: string;
  title: string;
  client: string;
  experience: string;
  skills: string;
  location: string;
  openings: string;
  recruitersCount: number;
  submissionsCount: number;
  status: 'Active' | 'Paused';
}

interface JobsTabProps {
  jobsList: JobType[];
  onToggleStatus: (id: string) => void;
  onDeleteJob: (id: string) => void;
  onCreateJobClick: () => void;
  onEditJobClick: (job: JobType) => void;
}

export default function JobsTab({ 
  jobsList, 
  onToggleStatus, 
  onDeleteJob, 
  onCreateJobClick,
  onEditJobClick 
}: JobsTabProps) {
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Extract unique filter dropdown values
  const uniqueClients = Array.from(new Set(jobsList.map(j => j.client)));
  const uniqueLocations = Array.from(new Set(jobsList.map(j => j.location)));

  // Filter implementation
  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.skills.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    const matchesClient = clientFilter === 'All' || job.client === clientFilter;
    const matchesLoc = locationFilter === 'All' || job.location === locationFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesLoc;
  });

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header Segments */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Jobs</h1>
          <p className="text-app-muted mt-1">Create, manage and track all active marketplace requirements.</p>
        </div>
        <button 
          onClick={onCreateJobClick}
          className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold rounded-2xl flex items-center gap-2 text-xs transition-colors shadow-lg shadow-brand-blue/20 shrink-0"
        >
          <Plus className="w-4.5 h-4.5 stroke-[3px]" /> Create New Job
        </button>
      </div>

      {/* Grid Filter control */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
        <div className="flex flex-col xl:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search jobs, clients, active stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full xl:w-auto">
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3.5 py-2.5 rounded-xl text-xs font-semibold shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Refine:</span>
            </div>

            {/* Status */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Status: All</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>

            {/* Client */}
            <select 
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer max-w-[130px]"
            >
              <option value="All">Client: All</option>
              {uniqueClients.map((client, sIdx) => (
                <option key={sIdx} value={client}>{client}</option>
              ))}
            </select>

            {/* Location */}
            <select 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2.5 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer max-w-[130px]"
            >
              <option value="All">Location: All</option>
              {uniqueLocations.map((loc, sIdx) => (
                <option key={sIdx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Jobs Listings Table / Cards */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id}
              className={`p-6 rounded-[24px] glass border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${
                job.status === 'Paused' ? 'opacity-65 border-app-border/40' : 'border-app-border/80 hover:border-brand-blue/30'
              }`}
            >
              {/* Left Column: Job Info */}
              <div className="space-y-3 flex-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 border border-brand-blue/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-app-text flex items-center gap-2">
                      {job.title}
                      <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded ${
                        job.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                          : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/25'
                      }`}>
                        {job.status}
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted mt-1 font-semibold">
                      <span>{job.client}</span>
                      <span className="text-app-border">•</span>
                      <span>{job.experience}</span>
                      <span className="text-app-border">•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Badges and Skills Stack */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pl-0 md:pl-16">
                  {job.skills.split(', ').map((skill, index) => (
                    <span key={index} className="text-[11px] font-mono font-semibold bg-app-surface/80 border border-app-border px-2.5 py-1 rounded-xl text-app-text">
                      {skill}
                    </span>
                  ))}
                  <span className="text-xs font-bold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                    {job.openings}
                  </span>
                </div>
              </div>

              {/* Middle Component: Sourcing Statistics */}
              <div className="flex items-center gap-10 md:px-8 border-t md:border-t-0 md:border-l md:border-r border-app-border/40 py-4 md:py-0 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-start">
                {/* Active recruiters workspace */}
                <div>
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Recruiters Working</span>
                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Tiny visual recruiter circles row representation */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {[1, 2, 3].slice(0, Math.min(job.recruitersCount, 3)).map((val, idx) => (
                        <img 
                          key={idx}
                          className="inline-block h-6.5 w-6.5 rounded-full ring-2 ring-app-bg object-cover"
                          src={`https://picsum.photos/seed/rec${idx + 5}/50/50`}
                          alt="Recruiter"
                        />
                      ))}
                      {job.recruitersCount > 3 && (
                        <span className="flex items-center justify-center h-6.5 w-6.5 rounded-full ring-2 ring-app-bg bg-brand-violet text-[10px] font-extrabold text-white">
                          +{job.recruitersCount - 3}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-app-text">{job.recruitersCount} active</span>
                  </div>
                </div>

                {/* Submissions stats */}
                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-wider block">Submissions</span>
                  <span className="text-xl font-display font-black text-brand-blue mt-1 block">
                    {job.submissionsCount} <span className="text-xs text-app-muted font-bold">Files</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Actives controls */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button 
                  onClick={() => onEditJobClick(job)}
                  className="p-3 bg-app-surface hover:bg-app-bg border border-app-border rounded-xl text-app-muted hover:text-brand-blue transition-colors"
                  title="Edit Job requirement"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => onToggleStatus(job.id)}
                  className={`p-3 border rounded-xl transition-all ${
                    job.status === 'Active' 
                      ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-white'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                  }`}
                  title={job.status === 'Active' ? 'Pause Sourcing' : 'Resume Sourcing'}
                >
                  {job.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => onDeleteJob(job.id)}
                  className="p-3 bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white rounded-xl transition-all"
                  title="Remove requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div className="p-16 text-center rounded-[32px] glass border border-app-border">
            <span className="text-3xl block">🔍</span>
            <h3 className="font-display font-bold text-lg text-app-text mt-4">No active requirements found</h3>
            <p className="text-app-muted text-sm mt-1">Try to expand filter definitions or add a new job listing.</p>
          </div>
        )}
      </div>

    </div>
  );
}
