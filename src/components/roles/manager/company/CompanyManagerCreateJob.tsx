import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Globe,
  Building,
  Briefcase
} from 'lucide-react';

interface RecruiterType {
  id: string;
  name: string;
  email: string;
}

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

interface CompanyManagerCreateJobProps {
  editJob: JobType | null;
  onBack: () => void;
  onSubmit: (jobData: Omit<JobType, 'id' | 'applicationsCount'>) => void;
  recruiters: RecruiterType[];
}

export default function CompanyManagerCreateJob({ 
  editJob, 
  onBack, 
  onSubmit,
  recruiters
}: CompanyManagerCreateJobProps) {
  
  // Field values
  const [title, setTitle] = useState(editJob ? editJob.title : '');
  const [dept, setDept] = useState(editJob ? editJob.dept : 'Engineering');
  const [description, setDescription] = useState(
    editJob ? `Develop, scale, and test premium products and service APIs in ${editJob.dept} team.` : ''
  );
  const [experience, setExperience] = useState(editJob ? editJob.experience : '4-6 Years');
  const [type, setType] = useState(editJob ? editJob.type : 'Full-time');
  const [location, setLocation] = useState(editJob ? editJob.location : 'Bangalore, India');
  const [openings, setOpenings] = useState(editJob ? editJob.openings : 1);
  const [skills, setSkills] = useState(
    editJob ? 'React, TS, Tail, DB' : 'React, TypeScript, Node.js, AWS, Kubernetes'
  );
  
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  
  const [reach, setReach] = useState<'Internal - My Company' | 'Cross Company Network' | 'Across All Companies'>(
    editJob ? editJob.reach : 'Internal - My Company'
  );
  
  const [assignmentMode, setAssignmentMode] = useState<'selected' | 'open'>(
    editJob && editJob.recruitersAssigned.length === 0 ? 'open' : 'selected'
  );

  const [selectedRecruiters, setSelectedRecruiters] = useState<string[]>(
    editJob && editJob.recruitersAssigned.length > 0 
      ? editJob.recruitersAssigned 
      : recruiters.slice(0, 2).map(r => r.name)
  );

  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['Aryx AI', 'Miners Ltd', 'Cloudy Corp']);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      dept,
      location,
      openings: Number(openings) || 1,
      status: 'Active',
      experience,
      type,
      reach,
      recruitersAssigned: assignmentMode === 'open' ? [] : selectedRecruiters
    });
  };

  const toggleRecruiter = (recName: string) => {
    if (assignmentMode === 'open') return;
    if (selectedRecruiters.includes(recName)) {
      setSelectedRecruiters(selectedRecruiters.filter(r => r !== recName));
    } else {
      setSelectedRecruiters([...selectedRecruiters, recName]);
    }
  };

  const RECRUITER_META: Record<string, { avatar: string, role: string }> = {
    'Priya Sharma': { avatar: 'https://picsum.photos/seed/priya/100/100', role: 'Technical Recruiter' },
    'Rahul Verma': { avatar: 'https://picsum.photos/seed/rahulv/100/100', role: 'Senior Sourcing Specialist' },
    'Neha Patel': { avatar: 'https://picsum.photos/seed/nehap/100/100', role: 'Talent Acquisition Partner' },
    'Amit Singh': { avatar: 'https://picsum.photos/seed/amits/100/100', role: 'Engineering Recruiter' },
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Header with Navigation Link */}
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={onBack}
          className="p-2 border border-app-border hover:bg-app-surface/80 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-app-text" />
        </button>
        <div>
          <div className="text-xs text-app-muted font-bold flex items-center gap-1.5 uppercase tracking-wider">
            <span>Jobs</span> <ChevronRight className="w-3 h-3" /> <span>{editJob ? 'Edit Job' : 'Create New Job'}</span>
          </div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight mt-1">
            {editJob ? 'Edit Corporate Requisition' : 'Create New Job'}
          </h1>
        </div>
      </div>

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Job Information Form */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-6">
          <h3 className="font-display font-black text-lg text-app-text tracking-tight border-b border-app-border/40 pb-4">Job Details</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Job Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Job Title <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Department <span className="text-red-500">*</span></label>
              <select 
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue outline-none cursor-pointer font-semibold text-app-text"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Job Description <span className="text-red-500">*</span></label>
            <textarea 
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a summary of daily responsibilities, stack criteria, and role expectations..."
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Experience Level</label>
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue outline-none cursor-pointer font-semibold text-app-text"
              >
                <option value="1-2 Years">1-2 Years</option>
                <option value="2-4 Years">2-4 Years</option>
                <option value="4-6 Years">4-6 Years</option>
                <option value="6-8 Years">6-8 Years</option>
                <option value="8+ Years">8+ Years</option>
              </select>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Employment Type</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue outline-none cursor-pointer font-semibold text-app-text"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Location</label>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue outline-none cursor-pointer font-semibold text-app-text"
              >
                <option value="Bangalore, India">Bangalore, India</option>
                <option value="Hyderabad, India">Hyderabad, India</option>
                <option value="Pune, India">Pune, India</option>
                <option value="Chennai, India">Chennai, India</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Openings */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Openings <span className="text-red-500">*</span></label>
              <input 
                type="number"
                required
                min={1}
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value) || 1)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Skills (Comma comma list) <span className="text-red-500">*</span></label>
              <input 
                type="text"
                required
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. React.js, TypeScript, AWS, Git"
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Salary estimation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Min Salary (Annual - Optional)</label>
              <input 
                type="text"
                placeholder="e.g. ₹12,00,000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted">Max Salary (Annual - Optional)</label>
              <input 
                type="text"
                placeholder="e.g. ₹24,00,000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
          </div>

          {/* Assign recruiters */}
          <div className="space-y-4 pt-4 border-t border-app-border/40">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-app-muted block">Recruiter Assignment Policy</label>
              <p className="text-[11px] text-app-muted mt-1">Specify whether specific recruiters will work on sourcing for this job, or open it up for all.</p>
            </div>

            {/* Radio / Tab selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAssignmentMode('selected')}
                className={`p-4 rounded-2xl text-left border flex flex-col gap-1 transition-all cursor-pointer ${
                  assignmentMode === 'selected'
                    ? 'border-brand-blue bg-brand-blue/5 text-app-text'
                    : 'border-app-border bg-app-surface/20 text-app-text hover:bg-app-surface/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignmentMode === 'selected'}
                    onChange={() => setAssignmentMode('selected')}
                    className="accent-brand-blue"
                  />
                  <span className="text-xs font-extrabold">Option A: Selected Recruiters</span>
                </div>
                <span className="text-[10px] text-app-muted leading-relaxed pl-5 font-medium">
                  Assign specific talent acquisition team members to manage and submit candidates for this requirement.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAssignmentMode('open')}
                className={`p-4 rounded-2xl text-left border flex flex-col gap-1 transition-all cursor-pointer ${
                  assignmentMode === 'open'
                    ? 'border-brand-violet bg-brand-violet/5 text-app-text'
                    : 'border-app-border bg-app-surface/20 text-app-text hover:bg-app-surface/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignmentMode === 'open'}
                    onChange={() => setAssignmentMode('open')}
                    className="accent-brand-violet"
                  />
                  <span className="text-xs font-extrabold">Option B: Open For All Recruiters</span>
                </div>
                <span className="text-[10px] text-app-muted leading-relaxed pl-5 font-medium">
                  Any recruiter in your corporate workspace can submit candidates and work on active briefs.
                </span>
              </button>
            </div>

            {/* Recruiter selection list (only enabled if Selected Recruiters mode) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-app-muted">
                  Designated Recruiters {assignmentMode === 'selected' ? `(${selectedRecruiters.length} selected)` : '(All Sourcing Enabled)'}
                </span>
              </div>

              {assignmentMode === 'open' ? (
                <div className="p-4 rounded-2xl bg-brand-violet/5 border border-brand-violet/20 text-xs font-bold text-brand-violet flex items-center gap-3 animate-fade-in">
                  <span className="text-lg">📢</span>
                  <div>
                    <p className="font-extrabold text-[12px]">Open Recruiter Pool Mode Active</p>
                    <p className="text-[10px] text-app-muted font-medium mt-0.5">Specific recruitment selection is disabled. This job is visible to all internal and ecosystem recruiters.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                  {recruiters.map((rec) => {
                    const isSelected = selectedRecruiters.includes(rec.name);
                    const meta = RECRUITER_META[rec.name] || {
                      avatar: `https://picsum.photos/seed/${rec.name.replace(' ', '')}/100/100`,
                      role: 'Sourcing Recruiter'
                    };
                    return (
                      <button
                        type="button"
                        key={rec.id}
                        onClick={() => toggleRecruiter(rec.name)}
                        className={`p-3 rounded-2xl text-left border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-brand-blue bg-brand-blue/5 text-brand-blue'
                            : 'border-app-border bg-app-surface/40 text-app-text hover:bg-app-surface'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img src={meta.avatar} alt={rec.name} className="w-8 h-8 rounded-full border border-app-border object-cover" />
                          <div>
                            <div className="font-bold text-sm text-app-text">{rec.name}</div>
                            <div className="text-[10px] text-app-muted font-normal mt-0.5">{meta.role}</div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-brand-blue bg-brand-blue' : 'border-app-muted/40'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Visibility & Reach Options */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[32px] glass border border-app-border card-shadow space-y-6">
            <h3 className="font-display font-black text-base text-app-text tracking-tight mb-4 border-b border-app-border/40 pb-3">
              Visibility & Reach
            </h3>
            
            <div className="space-y-4">
              
              {/* Option 1: Internal Column */}
              <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                reach === 'Internal - My Company' 
                  ? 'border-blue-500 bg-blue-500/5' 
                  : 'border-app-border bg-app-surface/30 hover:bg-app-surface/50'
              }`}>
                <input 
                  type="radio"
                  name="reach_option"
                  checked={reach === 'Internal - My Company'}
                  onChange={() => setReach('Internal - My Company')}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <span className="text-xs font-extrabold text-app-text block leading-tight">Internal - My Company</span>
                  <span className="text-[10px] text-app-muted mt-1 font-semibold block leading-relaxed">
                    Only employees from my company can view, apply, or recommend candidates.
                  </span>
                </div>
              </label>

              {/* Option 2: Cross Network */}
              <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                reach === 'Cross Company Network' 
                  ? 'border-violet-500 bg-violet-500/5' 
                  : 'border-app-border bg-app-surface/30 hover:bg-app-surface/50'
              }`}>
                <input 
                  type="radio"
                  name="reach_option"
                  checked={reach === 'Cross Company Network'}
                  onChange={() => setReach('Cross Company Network')}
                  className="mt-1 accent-violet-500"
                />
                <div>
                  <span className="text-xs font-extrabold text-app-text block leading-tight">Cross Company Network</span>
                  <span className="text-[10px] text-app-muted mt-1 font-semibold block leading-relaxed">
                    Visible to trusted ecosystem collaborators and partner workspaces.
                  </span>
                </div>
              </label>

              {/* Option 3: Across All Companies */}
              <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                reach === 'Across All Companies' 
                  ? 'border-emerald-500 bg-emerald-500/5' 
                  : 'border-app-border bg-app-surface/30 hover:bg-app-surface/50'
              }`}>
                <input 
                  type="radio"
                  name="reach_option"
                  checked={reach === 'Across All Companies'}
                  onChange={() => setReach('Across All Companies')}
                  className="mt-1 accent-emerald-500"
                />
                <div>
                  <span className="text-xs font-extrabold text-app-text block leading-tight">Across All Companies</span>
                  <span className="text-[10px] text-app-muted mt-1 font-semibold block leading-relaxed">
                    Fully public in Aryx AI Global Pool for maximum applicant reach.
                  </span>
                </div>
              </label>

            </div>

            {reach === 'Cross Company Network' && (
              <div className="space-y-2 animate-fade-in pt-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-app-muted">Select Companies Network</label>
                <div className="p-3 bg-app-surface/60 rounded-xl border border-app-border flex flex-wrap gap-1.5 text-[10px] font-bold">
                  {selectedCompanies.map((c, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-brand-violet/10 border border-brand-violet/15 text-brand-violet rounded-md">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="text-[10px] text-emerald-500 font-extrabold">✓ 3 partner teams designated</div>
              </div>
            )}

          </div>

          {/* Form navigation controls */}
          <div className="flex gap-3 justify-end">
            <button 
              type="button"
              onClick={onBack}
              className="px-5 py-3 border border-app-border text-app-text hover:bg-app-surface/60 font-extrabold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-blue/15"
            >
              {editJob ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
}
