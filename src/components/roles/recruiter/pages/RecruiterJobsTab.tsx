import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Plus, 
  Users, 
  Layers,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface RecruiterJobsTabProps {
  onNavigate: (tab: string) => void;
  jobs: Array<{
    id: string;
    title: string;
    dept: string;
    location: string;
    applicationsCount: number;
    openings: number;
    status: 'Active' | 'Draft' | 'Closed';
    experience: string;
    type: string;
  }>;
  onAddJob: (job: {
    title: string;
    dept: string;
    location: string;
    experience: string;
    openings: number;
    type: string;
    status: 'Active' | 'Draft' | 'Closed';
  }) => void;
}

export default function RecruiterJobsTab({
  onNavigate,
  jobs,
  onAddJob
}: RecruiterJobsTabProps) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedLoc, setSelectedLoc] = useState('All Locations');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [dept, setDept] = useState('Engineering');
  const [location, setLocation] = useState('Bangalore, India');
  const [experience, setExperience] = useState('4-6 Years');
  const [openings, setOpenings] = useState(2);
  const [type, setType] = useState('Full-time');
  const [statusVal, setStatusVal] = useState<'Active' | 'Draft' | 'Closed'>('Active');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                          job.dept.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All Departments' || job.dept === selectedDept;
    const matchesLoc = selectedLoc === 'All Locations' || job.location.includes(selectedLoc) || (selectedLoc === 'Remote' && job.location === 'Remote');
    const matchesStatus = selectedStatus === 'All Status' || job.status === selectedStatus;
    return matchesSearch && matchesDept && matchesLoc && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAddJob({
      title,
      dept,
      location,
      experience,
      openings: Number(openings),
      type,
      status: statusVal
    });
    // Reset
    setTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Jobs</h1>
          <p className="text-app-muted text-sm mt-1">Manage and track all company job openings.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-3 bg-brand-blue text-white font-extrabold text-xs rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-md group cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform" /> Create Job
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="p-4 sm:p-5 rounded-2xl sm:rounded-[24px] bg-app-surface border border-app-border card-shadow flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Department Filter */}
          <div className="relative">
            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-app-bg border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option>All Departments</option>
              <option>Engineering</option>
              <option>Infrastructure</option>
              <option>Product</option>
              <option>Data</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <select 
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-app-bg border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option>All Locations</option>
              <option>Bangalore</option>
              <option>Hyderabad</option>
              <option>Pune</option>
              <option>Remote</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 bg-app-bg border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          </div>
        </div>

        {/* Search tool */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      {/* Jobs Grid/List matches style perfectly */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between hover:border-brand-blue/30 transition-all duration-200">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-3">
                <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  job.status === 'Active' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' :
                  job.status === 'Draft' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' :
                  'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                }`}>
                  {job.status}
                </span>
              </div>

              <div>
                <h3 className="font-display font-black text-base text-app-text select-all">{job.title}</h3>
                <span className="text-[11px] font-bold text-brand-blue mt-1 inline-block bg-brand-blue/10 px-2 py-0.5 rounded-md">
                  {job.dept}
                </span>
              </div>

              <div className="space-y-2 pt-1 border-t border-app-border/40">
                <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location} • {job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-app-muted">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Experience: {job.experience}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-app-border/40 text-center">
                <div className="p-2.5 rounded-xl bg-app-bg border border-app-border/50">
                  <div className="text-lg font-black text-app-text">{job.applicationsCount}</div>
                  <div className="text-[9px] text-app-muted font-bold uppercase tracking-wider">Applications</div>
                </div>
                <div className="p-2.5 rounded-xl bg-app-bg border border-app-border/50">
                  <div className="text-lg font-black text-app-text">{job.openings}</div>
                  <div className="text-[9px] text-app-muted font-bold uppercase tracking-wider">Openings</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button 
                onClick={() => onNavigate('candidates')}
                className="py-2.5 px-3 bg-app-bg hover:bg-app-surface border border-app-border text-xs font-extrabold text-app-text rounded-xl hover:text-brand-blue hover:border-brand-blue/30 transition-all cursor-pointer text-center"
              >
                View Candidates
              </button>
              <button 
                onClick={() => onNavigate('pipeline')}
                className="py-2.5 px-3 bg-brand-blue text-white text-xs font-extrabold rounded-xl hover:bg-opacity-95 shadow-sm transform active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Manage Pipeline
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-app-surface border border-app-border/50 text-app-muted text-sm font-medium">
          No job openings found matching your filter criteria.
        </div>
      )}

      {/* CREATE JOB OPPORTUNITY MODAL (matches design perfectly) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-app-surface border border-app-border rounded-[32px] card-shadow overflow-hidden flex flex-col justify-between text-left">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-brand-blue w-5 h-5" />
                  <h3 className="text-lg font-display font-black text-app-text">Create Job Opening</h3>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-app-bg text-app-muted hover:text-app-text cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-app-muted uppercase">Job Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Senior Software Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Department</label>
                    <select 
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                    >
                      <option>Engineering</option>
                      <option>Infrastructure</option>
                      <option>Product</option>
                      <option>Data</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Location</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Bangalore, India"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Experience</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 4-6 Years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Openings</label>
                    <input 
                      type="number" 
                      required
                      min={1}
                      value={openings}
                      onChange={(e) => setOpenings(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Job Type</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-app-muted uppercase">Status</label>
                    <select 
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value as any)}
                      className="w-full px-4 py-3 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-3 border border-app-border hover:bg-app-bg text-xs font-extrabold text-app-text rounded-xl focus:outline-none transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-brand-blue text-white hover:bg-opacity-95 text-xs font-extrabold rounded-xl focus:outline-none transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
