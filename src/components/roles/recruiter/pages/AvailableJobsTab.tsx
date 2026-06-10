import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';

interface AvailableJobsTabProps {
  onNavigate: (tab: string) => void;
  onRequestAccess?: (companyName: string) => void;
}

interface Job {
  id: string;
  title: string;
  company: string;
  experience: string;
  skills: string[];
  location: string;
  positions: string;
  priority: 'High' | 'Medium' | 'Low';
  posted: string;
  bdm: string;
  status: 'Request Access' | 'Pending Approval' | 'Access Approved';
}

export default function AvailableJobsTab({ onNavigate, onRequestAccess }: AvailableJobsTabProps) {
  
  // Simulated initial jobs list matching image #2 exactly
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'job-1',
      title: 'Frontend Developer',
      company: 'ABC Tech Pvt Ltd',
      experience: '3-5 Years',
      skills: ['React', 'Next.js', 'TypeScript'],
      location: 'Bangalore',
      positions: '15 Positions',
      priority: 'High',
      posted: 'Posted 2 days ago',
      bdm: 'John Mathew',
      status: 'Access Approved'
    },
    {
      id: 'job-2',
      title: 'Java Developer',
      company: 'Infoswift Solutions',
      experience: '4-6 Years',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      location: 'Pune',
      positions: '8 Positions',
      priority: 'Medium',
      posted: 'Posted 5 days ago',
      bdm: 'John Mathew',
      status: 'Request Access'
    },
    {
      id: 'job-3',
      title: 'Backend Developer',
      company: 'TechWave Systems',
      experience: '3-6 Years',
      skills: ['Node.js', 'Express', 'MongoDB'],
      location: 'Hyderabad',
      positions: '10 Positions',
      priority: 'High',
      posted: 'Posted 1 day ago',
      bdm: 'John Mathew',
      status: 'Request Access'
    },
    {
      id: 'job-4',
      title: 'QA Engineer',
      company: 'X Corp',
      experience: '2-4 Years',
      skills: ['Manual', 'Automation', 'Selenium'],
      location: 'Chennai',
      positions: '6 Positions',
      priority: 'Low',
      posted: 'Posted 3 days ago',
      bdm: 'Arjun Patil',
      status: 'Request Access'
    },
    {
      id: 'job-5',
      title: 'DevOps Engineer',
      company: 'CloudMatrix',
      experience: '4-6 Years',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      location: 'Remote',
      positions: '5 Positions',
      priority: 'Medium',
      posted: 'Posted 2 days ago',
      bdm: 'Neha Sharma',
      status: 'Access Approved'
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedPrior, setSelectedPrior] = useState('All');

  // Trigger simulated request access action
  const handleRequestAccess = (jobId: string) => {
    setJobs(prevJobs => 
      prevJobs.map(j => {
        if (j.id === jobId) {
          // Progress from request access to pending approval
          return { ...j, status: 'Pending Approval' };
        }
        return j;
      })
    );

    // Simulate approval of the request after 3 seconds
    setTimeout(() => {
      setJobs(prevJobs => 
        prevJobs.map(j => {
          if (j.id === jobId) {
            return { ...j, status: 'Access Approved' };
          }
          return j;
        })
      );
    }, 3000);
  };

  // Match filtering criteria
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === 'All' || job.skills.includes(selectedSkill);
    const matchesExp = selectedExp === 'All' || job.experience.includes(selectedExp);
    const matchesLoc = selectedLoc === 'All' || job.location.includes(selectedLoc) || (selectedLoc === 'Remote' && job.location.toLowerCase() === 'remote');
    const matchesPrior = selectedPrior === 'All' || job.priority === selectedPrior;

    return matchesSearch && matchesSkill && matchesExp && matchesLoc && matchesPrior;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text">Available Jobs</h1>
        <p className="text-app-muted mt-1">Browse all open requirements and request access to start selecting candidates.</p>
      </div>

      {/* Grid Filter Bar */}
      <div className="p-4 rounded-2xl glass border border-app-border space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search jobs, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-app-surface border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            {/* Filter tags / dropdown simulations */}
            <div className="flex items-center gap-1.5 bg-app-surface border border-app-border px-3 py-2 rounded-xl text-xs font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-app-muted" />
              <span className="text-app-muted">Filters:</span>
            </div>

            {/* Skills */}
            <select 
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Skills (All)</option>
              <option value="React">React</option>
              <option value="Java">Java</option>
              <option value="TypeScript">TypeScript</option>
              <option value="AWS">AWS</option>
              <option value="Manual">Manual</option>
            </select>

            {/* Experience */}
            <select 
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Experience (All)</option>
              <option value="2-4">2-4 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="4-6">4-6 Years</option>
            </select>

            {/* Location */}
            <select 
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Location (All)</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Priority */}
            <select 
              value={selectedPrior}
              onChange={(e) => setSelectedPrior(e.target.value)}
              className="bg-app-surface border border-app-border rounded-xl px-3 py-2 text-xs font-semibold text-app-text focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="All">Priority (All)</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Jobs Listings */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="p-6 rounded-[24px] glass border border-app-border card-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-app-border/80 transition-all"
            >
              <div className="space-y-3 flex-1">
                {/* Logo & Headline */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-extrabold shrink-0 border border-brand-blue/20">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-app-text">{job.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-app-muted mt-1 font-semibold">
                      <span>{job.company}</span>
                      <span className="text-app-border">•</span>
                      <span>{job.experience}</span>
                      <span className="text-app-border">•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Badges Stack */}
                <div className="flex flex-wrap items-center gap-2 mt-4 pl-0 md:pl-16">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="text-xs font-semibold font-mono bg-app-surface/80 border border-app-border px-2.5 py-1 rounded-xl text-app-text">
                      {skill}
                    </span>
                  ))}
                  <span className="text-xs font-bold text-app-muted bg-app-bg px-2.5 py-1 rounded-xl border border-app-border">
                    {job.positions}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                    job.priority === 'High' 
                      ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' 
                      : job.priority === 'Medium'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {job.priority} Priority
                  </span>
                </div>
              </div>

              {/* Status / Actions Segment */}
              <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-app-border pt-4 md:pt-0 shrink-0">
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-app-muted">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{job.posted}</span>
                </div>
                <div className="text-xs font-bold text-app-text">
                  BDM: <span className="text-brand-blue">{job.bdm}</span>
                </div>

                {job.status === 'Request Access' && (
                  <button 
                    onClick={() => handleRequestAccess(job.id)} 
                    className="w-full md:w-auto px-6 py-3 bg-brand-blue text-white font-extrabold rounded-2xl shadow-lg shadow-brand-blue/15 text-xs hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Request Access
                  </button>
                )}

                {job.status === 'Pending Approval' && (
                  <button 
                    disabled 
                    className="w-full md:w-auto px-6 py-3 bg-white/10 text-app-muted font-extrabold border border-app-border rounded-2xl text-xs flex items-center justify-center gap-2"
                  >
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
                    Pending Approval
                  </button>
                )}

                {job.status === 'Access Approved' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => onNavigate('candidates')}
                      className="w-full md:w-auto px-5 py-3 bg-brand-blue/10 hover:bg-brand-blue/15 text-brand-blue font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" /> Select Candidates
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center rounded-[32px] glass border border-app-border">
            <AlertCircle className="w-12 h-12 text-app-muted mx-auto mb-4" />
            <h3 className="font-display font-bold text-lg text-app-text">No matching jobs found</h3>
            <p className="text-app-muted text-sm mt-1">Try relaxing some filters or adjust search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination component as seen in Image 2 */}
      <div className="flex items-center justify-center gap-2 mt-8 pt-4">
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'<'}
        </button>
        <button className="w-8 h-8 rounded-xl font-bold bg-brand-blue text-white text-xs">1</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">2</button>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">3</button>
        <span className="text-app-muted px-1 text-xs">...</span>
        <button className="w-8 h-8 rounded-xl font-bold border border-app-border hover:bg-app-surface text-xs text-app-text">5</button>
        <button className="p-2 border border-app-border rounded-xl text-app-muted hover:text-app-text bg-app-surface hover:bg-app-surface/80 text-xs">
          {'>'}
        </button>
      </div>

    </div>
  );
}