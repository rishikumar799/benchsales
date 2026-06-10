import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Users,
  MapPin,
  Clock
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  dept: string;
  location: string;
  applicationsCount: number;
  openings: number;
  status: 'Active' | 'Draft' | 'Closed';
  experience: string;
  type: string;
}

interface CompanyAdminJobsProps {
  jobsList: Job[];
  onAddJob: (newJob: Omit<Job, 'id' | 'applicationsCount'>) => void;
  onEditJob: (updatedJob: Job) => void;
  onDeleteJob: (id: string) => void;
}

export default function CompanyAdminJobs({ jobsList, onAddJob, onEditJob, onDeleteJob }: CompanyAdminJobsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState('Engineering');
  const [formLocation, setFormLocation] = useState('Bangalore, India');
  const [formOpenings, setFormOpenings] = useState(1);
  const [formExperience, setFormExperience] = useState('3-5 Years');
  const [formType, setFormType] = useState('Full-time');
  const [formStatus, setFormStatus] = useState<'Active' | 'Draft' | 'Closed'>('Active');

  const filteredJobs = jobsList.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' ? true : job.dept === deptFilter;
    const matchesStatus = statusFilter === 'All' ? true : job.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setFormTitle('');
    setFormDept('Engineering');
    setFormLocation('Bangalore, India');
    setFormOpenings(1);
    setFormExperience('3-5 Years');
    setFormType('Full-time');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formLocation) return;
    onAddJob({
      title: formTitle,
      dept: formDept,
      location: formLocation,
      openings: formOpenings,
      experience: formExperience,
      type: formType,
      status: formStatus
    });
    setShowAddModal(false);
  };

  const handleOpenEditModal = (job: Job) => {
    setSelectedJob(job);
    setFormTitle(job.title);
    setFormDept(job.dept);
    setFormLocation(job.location);
    setFormOpenings(job.openings);
    setFormExperience(job.experience);
    setFormType(job.type);
    setFormStatus(job.status);
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !formTitle || !formLocation) return;
    onEditJob({
      ...selectedJob,
      title: formTitle,
      dept: formDept,
      location: formLocation,
      openings: formOpenings,
      experience: formExperience,
      type: formType,
      status: formStatus
    });
    setShowEditModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Title + Action Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight flex items-center gap-2">
            Company Jobs openings
          </h1>
          <p className="text-app-muted text-sm font-medium mt-1">Manage and publish official role descriptions across company networks.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-xs shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> Create Job Requisition
        </button>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-3xl glass border border-app-border/80 card-shadow items-center">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search jobs by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-app-surface/60 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-semibold"
          />
        </div>

        <div>
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-app-surface border border-app-border text-app-text text-sm font-bold rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product">Product</option>
            <option value="Data Science">Data Science</option>
            <option value="Sales">Sales</option>
            <option value="Operations">Operations</option>
          </select>
        </div>

        <div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-app-surface border border-app-border text-app-text text-sm font-bold rounded-xl px-3 py-2.5 w-full focus:outline-none focus:border-brand-blue"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Draft">Draft Only</option>
            <option value="Closed">Closed Only</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="glass border border-app-border rounded-[32px] card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-app-border text-[10px] font-extrabold uppercase tracking-widest text-app-muted bg-app-surface/40">
                <th className="py-4.5 px-6">Official Role Title</th>
                <th className="py-4.5 px-6">Department</th>
                <th className="py-4.5 px-6">Experience / Location</th>
                <th className="py-4.5 px-6 text-center">Applications</th>
                <th className="py-4.5 px-6 text-center">Openings</th>
                <th className="py-4.5 px-6 text-center">Status</th>
                <th className="py-4.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/50 text-xs font-semibold text-app-text">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-app-surface/20 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-extrabold text-sm text-app-text">{job.title}</p>
                        <p className="text-[10px] text-app-muted font-bold mt-0.5">{job.type}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-app-text bg-app-surface border border-app-border px-2.5 py-1 rounded-lg">
                        {job.dept}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-app-text font-bold">
                          <MapPin className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="text-[10px] text-app-muted font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{job.experience}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-app-text">{job.applicationsCount}</td>
                    <td className="py-4 px-6 text-center text-sm font-bold text-app-text">{job.openings}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black border ${
                        job.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                          : job.status === 'Draft'
                          ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${job.status === 'Active' ? 'bg-emerald-500' : job.status === 'Draft' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        {job.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleOpenEditModal(job)}
                          className="p-2 hover:bg-brand-blue/10 hover:text-brand-blue rounded-xl text-app-muted transition-all"
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteJob(job.id)}
                          className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-app-muted transition-all"
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-app-muted text-sm font-medium">
                    <Briefcase className="w-10 h-10 mx-auto text-app-border mb-3" />
                    No job postings found matching your parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SHOW JOB MODALS */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-app-bg border border-app-border w-full max-w-md rounded-[32px] card-shadow overflow-hidden p-6 md:p-8 space-y-5 animate-scale-in">
            <h3 className="text-xl font-display font-black text-app-text">
              {showAddModal ? 'Create Job Requisition' : 'Modify Job Details'}
            </h3>
            <p className="text-xs text-app-muted font-bold -mt-3 uppercase tracking-wider">
              OFFICIAL CORPORATE JOB CONTRACT
            </p>

            <form onSubmit={showAddModal ? handleCreate : handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Role Title</label>
                <input 
                  type="text" 
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Department</label>
                  <select 
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Sales">Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Job Openings</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    value={formOpenings}
                    onChange={(e) => setFormOpenings(parseInt(e.target.value) || 1)}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Location</label>
                <input 
                  type="text" 
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Remote or Bangalore, India"
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Required Experience</label>
                  <input 
                    type="text" 
                    required
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    placeholder="e.g. 3-5 Years"
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-app-muted">Job Type</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-app-muted">Status</label>
                <select 
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Draft' | 'Closed')}
                  className="w-full bg-app-surface border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-blue transition-colors text-app-text font-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-4 py-2.5 bg-app-surface border border-app-border text-app-muted rounded-xl hover:bg-app-surface/60 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-blue/90 font-bold text-xs transition-colors"
                >
                  {showAddModal ? 'Publish Requisition' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
