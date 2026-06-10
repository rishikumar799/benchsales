import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  CheckSquare, 
  Sparkles,
  Briefcase,
  Layers,
  HelpCircle
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

interface CreateJobTabProps {
  editJob?: JobType | null;
  onBackToJobs: () => void;
  onSubmitJob: (jobData: Omit<JobType, 'id' | 'recruitersCount' | 'submissionsCount'> & { id?: string }) => void;
}

export default function CreateJobTab({ editJob, onBackToJobs, onSubmitJob }: CreateJobTabProps) {
  
  // Local Form Fields
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [experience, setExperience] = useState('3 - 5 Years');
  const [location, setLocation] = useState('');
  const [employmentType, setEmploymentType] = useState('Full Time');
  const [openings, setOpenings] = useState('10');
  const [salaryRange, setSalaryRange] = useState('6 - 10 LPA');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  // Skill tags state
  const [skillsList, setSkillsList] = useState<string[]>(['React', 'Node.js', 'TypeScript']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // Initialize fields if we are in Edit Mode
  useEffect(() => {
    if (editJob) {
      setTitle(editJob.title);
      setClient(editJob.client);
      setExperience(editJob.experience);
      setLocation(jobLocationSanitize(editJob.location));
      setOpenings(jobOpeningsSanitize(editJob.openings));
      setSalaryRange('6 - 10 LPA'); // Mock defaults
      setSkillsList(editJob.skills.split(', '));
      setDescription(`We are looking for a skilled developer with strong expertise in ${editJob.skills} and web optimization.`);
      setResponsibilities(`• Architect modular structures supporting fluid interactions.\n• Support performance tuning cycles and production compilation.\n• Team collaboration with BDMs and internal recruiters.`);
      setSaveAsDraft(editJob.status === 'Paused');
    } else {
      // Defaults for Create New matching Image 3 pre-fill exactly
      setTitle('Frontend Developer');
      setClient('ABC Technologies');
      setExperience('3 - 5 Years');
      setSkillsList(['React', 'Node.js', 'TypeScript', 'HTML']);
      setLocation('Hyderabad');
      setEmploymentType('Full Time');
      setOpenings('15');
      setSalaryRange('6 - 10 LPA');
      setDescription('We are looking for a skilled Frontend Developer with strong experience in React, TypeScript and modern UI development.');
      setResponsibilities('• Build responsive and scalable web applications\n• Collaborate with backend developers\n• Write clean and maintainable code');
      setSaveAsDraft(false);
    }
  }, [editJob]);

  // Sanitize functions
  const jobLocationSanitize = (loc: string) => {
    return loc ? loc.replace(' • ', '') : '';
  };
  const jobOpeningsSanitize = (ops: string) => {
    return ops ? ops.replace(' Openings', '').replace(' Positions', '') : '10';
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(sk => sk !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !client || !location || !salaryRange) return;

    onSubmitJob({
      id: editJob?.id,
      title,
      client,
      experience,
      skills: skillsList.join(', '),
      location,
      openings: `${openings} Positions`,
      status: saveAsDraft ? 'Paused' : 'Active'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
      
      {/* Back button */}
      <div>
        <button 
          onClick={onBackToJobs}
          className="flex items-center gap-2 text-xs font-bold text-app-muted hover:text-brand-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </button>
        <h1 className="text-3xl font-display font-bold text-app-text mt-3">
          {editJob ? 'Edit Requirement' : 'Create New Job'}
        </h1>
        <p className="text-app-muted mt-1">
          {editJob ? 'Modify current active marketplace requirements.' : 'Add a new job requirement to the marketplace.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column Fields (7 columns) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-6 bg-app-surface/20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Job Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Job Title *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            {/* Client Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Client Name *</label>
              <input 
                type="text" 
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
                placeholder="e.g. ABC Technologies"
                required
              />
            </div>

            {/* Experience Required */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Experience Required *</label>
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                required
              >
                <option value="1 - 3 Years">1 - 3 Years</option>
                <option value="2 - 4 Years">2 - 4 Years</option>
                <option value="3 - 5 Years">3 - 5 Years (Standard)</option>
                <option value="4 - 6 Years">4 - 6 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Location *</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
                placeholder="e.g. Bangalore, Remote"
                required
              />
            </div>

            {/* Employment Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Employment Type *</label>
              <select 
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none cursor-pointer"
                required
              >
                <option value="Full Time">Full Time</option>
                <option value="Contract">Contract</option>
                <option value="Part Time">Part Time</option>
                <option value="Remote Contractor">Remote Contractor</option>
              </select>
            </div>

            {/* Openings */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Openings *</label>
              <input 
                type="number" 
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
                placeholder="e.g. 15"
                min="1"
                required
              />
            </div>
          </div>

          {/* Skills tags area - matches image 3 tag selectors exactly */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Skills Required *</label>
            <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-app-surface border border-app-border">
              {skillsList.map((skill, index) => (
                <span key={index} className="flex items-center gap-1 text-xs font-semibold bg-brand-blue/10 border border-brand-blue/20 text-brand-blue px-3 py-1 rounded-xl">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 hover:bg-brand-blue/20 rounded-full text-brand-blue/70 hover:text-brand-blue transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {showAddSkillInput ? (
                <div className="flex items-center gap-1.5">
                  <input 
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="bg-app-bg border border-brand-blue rounded-xl px-2.5 py-1 text-xs text-app-text focus:outline-none outline-none w-28"
                    placeholder="Skill Tag..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddSkill(e);
                      }
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    className="p-1 px-2.5 bg-brand-blue text-white rounded-lg text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => setShowAddSkillInput(true)} 
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 text-app-muted hover:text-app-text rounded-xl border border-app-border text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column Fields (5 columns) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-6 bg-app-surface/20 flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* Offer / Salary range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Salary Range (LPA) *</label>
              <input 
                type="text" 
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full bg-app-surface border border-app-border rounded-xl p-3.5 text-sm font-semibold text-app-text focus:outline-none focus:border-brand-blue outline-none"
                placeholder="e.g. 6 - 10 LPA"
                required
              />
            </div>

            {/* Markdown Text Editor simulated - matches Image 3 format buttons exactly */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Job Description *</label>
              <div className="border border-app-border rounded-2xl bg-app-surface overflow-hidden">
                {/* Editor control toolbar */}
                <div className="flex items-center gap-2 p-2 border-b border-app-border bg-app-surface/50 text-app-muted">
                  <button type="button" className="p-1.5 hover:bg-app-bg hover:text-app-text rounded border border-transparent hover:border-app-border transition-all">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-app-bg hover:text-app-text rounded border border-transparent hover:border-app-border transition-all">
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-app-bg hover:text-app-text rounded border border-transparent hover:border-app-border transition-all">
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-app-border mx-1" />
                  <button type="button" className="p-1.5 hover:bg-app-bg hover:text-app-text rounded border border-transparent hover:border-app-border transition-all">
                    <Link className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" className="p-1.5 hover:bg-app-bg hover:text-app-text rounded border border-transparent hover:border-app-border transition-all">
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-40 p-4 text-xs font-semibold bg-transparent border-0 outline-none focus:ring-0 leading-relaxed resize-none text-app-text"
                  placeholder="Insert general job parameters..."
                  required
                />
              </div>
            </div>

            {/* Role Responsibilities */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-app-muted uppercase tracking-wider">Role Responsibilities</label>
              <textarea 
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full h-32 bg-app-surface border border-app-border rounded-xl p-4 text-xs font-semibold outline-none focus:border-brand-blue resize-none leading-relaxed text-app-text"
                placeholder="• List core daily assignments..."
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none font-semibold text-xs text-app-text pt-2">
              <input 
                type="checkbox" 
                checked={saveAsDraft}
                onChange={(e) => setSaveAsDraft(e.target.checked)}
                className="rounded border-app-border text-brand-blue focus:ring-brand-blue w-4 h-4 bg-app-surface cursor-pointer"
              />
              <span>Save as Draft (Don't publish directly)</span>
            </label>
          </div>

          {/* Double buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-app-border/40 mt-6">
            <button 
              type="button"
              onClick={onBackToJobs}
              className="px-6 py-3 border border-app-border hover:bg-app-surface rounded-xl text-xs font-bold text-app-text transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-3 bg-brand-blue text-white rounded-xl text-xs font-bold shadow-lg shadow-[#0c244c]/30 hover:scale-[1.01] active:scale-95 transition-all"
            >
              {editJob ? 'Save Changes' : 'Publish Job'}
            </button>
          </div>

        </div>

      </form>

    </div>
  );
}
