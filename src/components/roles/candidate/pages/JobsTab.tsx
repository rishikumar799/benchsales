import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Sparkles, 
  Bookmark, 
  Check, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  X,
  Upload,
  FileText,
  Clock,
  Building,
  Eye
} from 'lucide-react';

interface Job {
  id: string;
  role: string;
  company: string;
  logo: string;
  logoBg: string;
  posted: string;
  match: number;
  location: string;
  experience: string;
  salary: string;
  skills: string[];
  whyMatch: { skill: string; pct: number }[];
  missingSkills: { skill: string; gap: number }[];
}

const JOB_DESCRIPTIONS: Record<string, string> = {
  'job-1': `Google is looking for a talented Frontend Developer to join our Core Developer Platforms and Chrome UX team. In this role, you will build next-generation user interfaces that are fast, accessible, and delight millions of users. 

Key Responsibilities:
- Design, implement, and maintain highly responsive web interfaces using React, TypeScript, and modern front-end tooling.
- Collaborate closely with product managers, UX designers, and backend engineering teams to transform wireframes into production code.
- Optimize web applications for maximum speed, responsiveness, and cross-browser scalability.
- Write clean, maintainable, and thoroughly tested software components.

Preferred Qualifications:
- 3+ years of professional front-end web development experience.
- Deep expertise in modern JavaScript frameworks, specifically React.js.
- Strong knowledge of web standards, accessibility (WCAG), CSS grid/flexbox layouts, and browser render performance.`,

  'job-2': `Microsoft Azure team is hiring a Full Stack Developer to build cloud-native administrative consoles and distributed backend logic. You will leverage modern frontend frameworks alongside Node.js and MongoDB to build robust services that power developers worldwide.

Key Responsibilities:
- Build and optimize responsive, user-friendly control dashboards using React.
- Design, build, and maintain scalable, reliable REST and GraphQL APIs with Node.js/Express.
- Partner with database architects to structure high-performance schemas in MongoDB and Azure Cosmos DB.
- Implement security best practices, telemetry hooks, and automated CI/CD deployment routines.

Preferred Qualifications:
- 2-5 years of full stack experience.
- Command of Node.js ecosystem, asynchronous programming, and databases.
- Experience with Azure cloud services, Docker containerization, or Kubernetes.`,

  'job-3': `Amazon is seeking a Senior React Developer to join our AWS team and work on developer tools. You will lead the design and implementation of highly interactive browser-based software that empowers engineers to deploy and manage global infrastructures.

Key Responsibilities:
- Architect and develop high-performance components using React, Redux, and modern styling libraries like Tailwind CSS.
- Create beautiful, highly reusable UI components matching the AWS design framework.
- Integrate complex REST endpoints, manage client-side state, and handle high-throughput client data structures.
- Mentor junior engineers and champion front-end engineering excellence.

Preferred Qualifications:
- 2-4 years of experience building scalable single page applications.
- Strong knowledge of state management patterns (Redux, Zustand, Context API).
- Experience with AWS services (EC2, S3, CloudFront) is a big plus.`,

  'job-4': `Swiggy is seeking a Software Engineer to join our Bangalore Core Customer Experience team. You will build highly responsive customer-facing delivery and checkout portals, optimizing every millisecond of user journeys.

Key Responsibilities:
- Develop highly optimized food and grocery checkout flows using React, Redux, and Tailwind CSS.
- Optimize mobile-web views to maintain incredibly low load times and highly interactive page experiences.
- Collaborate with design and product teams to run A/B experiments and feature rollouts.
- Deliver robust, cross-platform web structures.

Preferred Qualifications:
- 1-3 years of professional experience in modern JavaScript application frameworks.
- Strong command of HTML5, CSS3, ES6 syntax, and web rendering cycles.
- Experience with real-time location services, WebSockets, or PWA development is a plus.`
};

export default function JobsTab() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem('aryx_submitted_applications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((app: any) => app.jobId);
      } catch (e) {}
    }
    return [];
  });
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [showResumeInlineDetails, setShowResumeInlineDetails] = useState(false);
  const [applyResumeOption, setApplyResumeOption] = useState<'existing' | 'upload'>('existing');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const getAppliedResumeForJob = (jobId: string) => {
    const saved = localStorage.getItem('aryx_submitted_applications');
    if (saved) {
      try {
        const apps = JSON.parse(saved);
        const matchedApp = apps.find((app: any) => app.jobId === jobId);
        return matchedApp?.resumeName || null;
      } catch (e) {}
    }
    return null;
  };
  const [existingResumeName] = useState(() => {
    const savedUploaded = localStorage.getItem('aryx_uploaded_resume');
    if (savedUploaded) {
      try {
        return JSON.parse(savedUploaded).name;
      } catch (e) {}
    }
    return "Primary Resume (from Resume Builder)";
  });

  const jobsData: Job[] = [
    {
      id: 'job-1',
      role: 'Frontend Developer',
      company: 'Google',
      logo: 'G',
      logoBg: 'bg-red-500',
      posted: '2 days ago',
      match: 96,
      location: 'Hyderabad',
      experience: '3-5 Yrs',
      salary: '₹8 - 12 LPA',
      skills: ['React', 'JavaScript', 'TypeScript', 'HTML/CSS'],
      whyMatch: [
        { skill: 'React', pct: 95 },
        { skill: 'JavaScript', pct: 92 },
        { skill: 'TypeScript', pct: 88 },
        { skill: 'HTML/CSS', pct: 85 }
      ],
      missingSkills: [
        { skill: 'AWS', gap: 30 },
        { skill: 'Docker', gap: 20 },
        { skill: 'Kubernetes', gap: 10 }
      ]
    },
    {
      id: 'job-2',
      role: 'Full Stack Developer',
      company: 'Microsoft',
      logo: 'M',
      logoBg: 'bg-blue-600',
      posted: '1 day ago',
      match: 91,
      location: 'Remote',
      experience: '2-5 Yrs',
      salary: '₹12 - 18 LPA',
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
      whyMatch: [
        { skill: 'React', pct: 95 },
        { skill: 'JavaScript', pct: 90 },
        { skill: 'Node.js', pct: 86 },
        { skill: 'MongoDB', pct: 82 }
      ],
      missingSkills: [
        { skill: 'System Design', gap: 40 },
        { skill: 'GraphQL', gap: 15 }
      ]
    },
    {
      id: 'job-3',
      role: 'React Developer',
      company: 'Amazon',
      logo: 'A',
      logoBg: 'bg-orange-500',
      posted: '3 days ago',
      match: 92,
      location: 'Bangalore',
      experience: '2-4 Yrs',
      salary: '₹7 - 11 LPA',
      skills: ['React', 'Redux', 'JavaScript', 'Tailwind'],
      whyMatch: [
        { skill: 'React', pct: 95 },
        { skill: 'Redux', pct: 89 },
        { skill: 'JavaScript', pct: 92 },
        { skill: 'Tailwind CSS', pct: 90 }
      ],
      missingSkills: [
        { skill: 'AWS Cloud', gap: 50 },
        { skill: 'Next.js', gap: 30 }
      ]
    },
    {
      id: 'job-4',
      role: 'Software Engineer',
      company: 'Swiggy',
      logo: 'S',
      logoBg: 'bg-amber-600',
      posted: '3 days ago',
      match: 88,
      location: 'Hyderabad',
      experience: '1-3 Yrs',
      salary: '₹6 - 10 LPA',
      skills: ['React', 'Redux', 'JavaScript', 'HTML/CSS'],
      whyMatch: [
        { skill: 'React', pct: 92 },
        { skill: 'Redux', pct: 80 },
        { skill: 'JavaScript', pct: 88 },
        { skill: 'HTML/CSS', pct: 85 }
      ],
      missingSkills: [
        { skill: 'Node.js', gap: 25 },
        { skill: 'Docker Environment', gap: 20 }
      ]
    }
  ];

  const [activeJobId, setActiveJobId] = useState<string>(jobsData[0].id);
  const activeJob = jobsData.find(j => j.id === activeJobId) || jobsData[0];

  const handleApplyClick = (job: Job) => {
    if (appliedJobs.includes(job.id)) {
      // Already applied, open details
      setSelectedJobForDetails(job);
    } else {
      setSelectedJobForApply(job);
    }
  };

  const handleFinalApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    
    const resumeName = applyResumeOption === 'upload' 
      ? (uploadedFileName || "My_Uploaded_Resume.pdf")
      : existingResumeName;
      
    const newApplication = {
      role: selectedJobForApply.role,
      company: selectedJobForApply.company,
      time: 'Just now',
      status: 'Applied',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      jobId: selectedJobForApply.id,
      resumeName: resumeName,
      jobDescription: JOB_DESCRIPTIONS[selectedJobForApply.id] || "Complete job description under evaluation.",
      logoBg: selectedJobForApply.logoBg,
      logo: selectedJobForApply.logo
    };
    
    // Load existing applications, prepend new one
    const saved = localStorage.getItem('aryx_submitted_applications');
    let currentApps = [];
    if (saved) {
      try {
        currentApps = JSON.parse(saved);
      } catch (e) {}
    } else {
      currentApps = [
        { role: 'UI/UX Designer', company: 'Figma', time: '5 hours ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', jobId: 'figma-1', resumeName: 'Primary Resume (from Resume Builder)', jobDescription: 'Core UI/UX systems design at Figma' },
        { role: 'Backend Developer', company: 'Flipkart', time: '1 day ago', status: 'Applied', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', jobId: 'flipkart-1', resumeName: 'Primary Resume (from Resume Builder)', jobDescription: 'High-throughput inventory API construction' },
        { role: 'React Developer', company: 'Swiggy', time: '1 day ago', status: 'Submitted', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', jobId: 'swiggy-1', resumeName: 'SDE Custom Resume.pdf', jobDescription: 'React food portals scaling' }
      ];
    }
    
    const nextApps = [newApplication, ...currentApps.filter((a: any) => a.jobId !== selectedJobForApply.id)];
    localStorage.setItem('aryx_submitted_applications', JSON.stringify(nextApps));
    
    // Update state
    setAppliedJobs(nextApps.map((a: any) => a.jobId));
    setIsSubmitSuccess(true);
    
    setTimeout(() => {
      setIsSubmitSuccess(false);
      setSelectedJobForApply(null);
      setUploadedFileName('');
    }, 1500);
  };

  const toggleSave = (id: string) => {
    if (savedJobs.includes(id)) {
      setSavedJobs(prev => prev.filter(jId => jId !== id));
    } else {
      setSavedJobs(prev => [...prev, id]);
    }
  };

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(search.toLowerCase()) || 
                          job.company.toLowerCase().includes(search.toLowerCase()) ||
                          job.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesLocation = selectedLocation === 'All' || job.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">Find Your Dream Job</h1>
        <p className="text-app-muted text-sm mt-1">Discover the best opportunities matching your skills and experience.</p>
      </div>

      {/* Filter and search bar layout from page 2 */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-app-surface border border-app-border card-shadow">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-app-muted" />
          <input
            type="text"
            placeholder="Search jobs, skills, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-app-bg border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-all"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <select 
            value={selectedLocation} 
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="bg-app-bg border border-app-border rounded-xl py-2.5 px-4 text-xs font-semibold text-app-text focus:outline-none"
          >
            <option value="All">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Bangalore">Bangalore</option>
          </select>

          <select className="bg-app-bg border border-app-border rounded-xl py-2.5 px-4 text-xs font-semibold text-app-text focus:outline-none">
            <option>Experience Level</option>
            <option>1-3 Years</option>
            <option>2-5 Years</option>
            <option>3-5 Years</option>
          </select>

          <select className="bg-app-bg border border-app-border rounded-xl py-2.5 px-4 text-xs font-semibold text-app-text focus:outline-none">
            <option>Salary Package</option>
            <option>₹6-10 LPA</option>
            <option>₹10-15 LPA</option>
            <option>₹15+ LPA</option>
          </select>

          <button className="bg-app-bg hover:bg-app-surface border border-app-border p-2.5 rounded-xl text-app-muted hover:text-app-text flex items-center gap-1.5 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-semibold hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Main split display: left matches, right matching metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  layout
                  onClick={() => setActiveJobId(job.id)}
                  className={`p-6 rounded-[24px] border transition-all cursor-pointer card-shadow flex flex-col md:flex-row justify-between gap-6 ${
                    activeJobId === job.id 
                      ? 'border-brand-blue bg-brand-blue/5' 
                      : 'border-app-border bg-app-surface hover:border-brand-blue/30'
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-xl ${job.logoBg} flex items-center justify-center text-white font-display font-extrabold text-base shadow-sm`}>
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-app-text">{job.role}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-app-muted">{job.company}</span>
                            <span className="text-app-muted/30">•</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedJobForDetails(job);
                              }}
                              className="text-[10px] font-extrabold text-brand-blue hover:underline tracking-tight cursor-pointer"
                            >
                              View Description
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-app-muted font-mono">{job.posted}</span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-app-muted">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {job.experience}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {job.skills.map((sk, idx) => (
                        <span key={idx} className="bg-app-bg border border-app-border rounded-lg px-2.5 py-1 text-[10px] font-semibold text-app-text">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-between items-end gap-4 shrink-0 min-w-[120px] pt-4 md:pt-0 border-t md:border-t-0 border-app-border/40">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">AI Match</span>
                      <span className="text-xl font-display font-black text-brand-blue block mt-0.5">{job.match}% Match</span>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(job.id);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          savedJobs.includes(job.id)
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                            : 'bg-app-bg hover:bg-app-surface border-app-border text-app-muted hover:text-app-text'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current stroke-current" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(job);
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all grow md:grow-0 text-center uppercase tracking-wide min-w-[90px] cursor-pointer ${
                          appliedJobs.includes(job.id)
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                            : 'bg-brand-blue text-white hover:bg-brand-blue/90 font-bold shadow-lg shadow-brand-blue/15'
                        }`}
                      >
                        {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center bg-app-surface border border-app-border rounded-[24px] space-y-3">
                <p className="text-app-muted text-sm font-semibold">No jobs found matching your search values.</p>
                <button onClick={() => { setSearch(''); setSelectedLocation('All'); }} className="text-xs font-bold text-brand-blue underline">
                  Reset search filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right side match analysis from frame 2 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-6">
            <div>
              <h3 className="text-base font-bold text-app-text">AI Match Insights</h3>
              <p className="text-[11px] text-app-muted font-semibold mt-0.5">Why does <strong className="text-brand-blue">{activeJob.company}</strong> match your index?</p>
            </div>

            {/* Standard Skill alignment bars */}
            <div className="space-y-4">
              {activeJob.whyMatch.map((match, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-app-text">
                    <span>{match.skill}</span>
                    <span className="text-emerald-500 font-mono">{match.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-app-bg rounded-full overflow-hidden border border-app-border/40">
                    <div 
                      className="h-full bg-emerald-500/80 rounded-full transition-all duration-500"
                      style={{ width: `${match.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Missing skills blocks */}
            <div className="space-y-3 pt-2 border-t border-app-border/40">
              <span className="text-[11px] font-bold text-app-muted uppercase tracking-wider block">Missing Skills</span>
              <div className="space-y-2">
                {activeJob.missingSkills.map((sk, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold bg-app-bg border border-app-border rounded-xl p-2.5">
                    <span className="text-app-text">{sk.skill}</span>
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded-lg">~{sk.gap}% Match Gap</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improve score alert box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-blue text-white relative overflow-hidden shadow-lg space-y-3">
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span className="font-bold text-sm tracking-tight text-white">Improve Your Match Score</span>
              </div>
              <p className="text-[11px] leading-relaxed text-white/80 font-medium">
                Add recommended portfolio elements or certs to bridge the gap with recruiters.
              </p>
              <button className="w-full py-2.5 bg-white text-brand-violet text-xs font-extrabold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider">
                Boost Score
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. View Job Description Modal */}
      <AnimatePresence>
        {selectedJobForDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full max-w-2xl bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-app-border/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${selectedJobForDetails.logoBg} flex items-center justify-center text-white font-black text-sm`}>
                    {selectedJobForDetails.logo}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-app-text">{selectedJobForDetails.role}</h3>
                    <p className="text-xs font-bold text-app-muted mt-0.5">{selectedJobForDetails.company} • {selectedJobForDetails.location}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJobForDetails(null)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                {/* Highlights bar */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-app-surface border border-app-border text-xs font-bold text-app-muted">
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Experience</span>
                    <span className="text-app-text font-semibold flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-brand-blue" /> {selectedJobForDetails.experience}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Salary Range</span>
                    <span className="text-app-text font-semibold flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-brand-blue" /> {selectedJobForDetails.salary}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block uppercase tracking-wider text-[9px]">Match Index</span>
                    <span className="text-brand-blue font-extrabold flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> {selectedJobForDetails.match}% Match</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Complete Job Description</h4>
                  <div className="text-xs text-app-muted leading-relaxed whitespace-pre-line bg-app-surface/40 p-4 rounded-2xl border border-app-border/40 font-medium">
                    {JOB_DESCRIPTIONS[selectedJobForDetails.id] || "No full description available."}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForDetails.skills.map((sk, idx) => (
                      <span key={idx} className="bg-app-surface border border-app-border px-3 py-1.5 rounded-lg text-xs text-app-text font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Submitted Resume Info */}
                {appliedJobs.includes(selectedJobForDetails.id) && (
                  <div className="space-y-3 pt-4 border-t border-app-border/40">
                    <h4 className="font-bold text-app-text text-xs uppercase tracking-wider">Your Submitted Application</h4>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                          <FileText className="w-5.5 h-5.5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-app-text truncate">
                            {getAppliedResumeForJob(selectedJobForDetails.id) || "Primary Resume (from Resume Builder)"}
                          </p>
                          <p className="text-[9px] text-emerald-500 font-bold uppercase mt-0.5">Applied Successfully</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowResumeInlineDetails(!showResumeInlineDetails)}
                        className="px-3.5 py-2 bg-app-bg hover:bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-blue" />
                        {showResumeInlineDetails ? "Hide Preview" : "View Resume Inline"}
                      </button>
                    </div>

                    {showResumeInlineDetails && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl border border-app-border/60 bg-app-bg font-sans space-y-4"
                      >
                        <div className="border-b border-app-border/40 pb-3 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Inline Document Viewer</span>
                          <span className="text-[9px] font-bold text-app-muted">PAGE 1 of 1</span>
                        </div>
                        <div className="space-y-3 text-xs leading-relaxed text-app-muted">
                          <div className="text-center space-y-1">
                            <h2 className="text-sm font-bold text-app-text">Rishi Kumar</h2>
                            <p className="text-[10px]">Hyderabad, Telangana | rishi.kumar@example.com | +91 98765 43210</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Education</h3>
                            <p className="font-semibold text-app-text">B.Tech in Computer Science & Engineering</p>
                            <p className="text-[10px]">Aryx University | CGPA: 9.2/10 (2022 - 2026)</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Core Tech Stack</h3>
                            <p>React, Next.js, Node.js, Express, TypeScript, Tailwind CSS, PostgreSQL, MongoDB, Git</p>
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-app-text border-b border-app-border/30 pb-0.5">Declarative Status</h3>
                            <p className="italic text-[10px]">Submitted securely via ARYX AI Gateway. System certified on-demand cryptographic stamp attached.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-app-border/40 flex justify-end gap-3 shrink-0 bg-app-surface/50">
                <button
                  onClick={() => {
                    setSelectedJobForDetails(null);
                    setShowResumeInlineDetails(false);
                  }}
                  className="px-5 py-2.5 bg-app-surface border border-app-border text-xs font-bold text-app-text rounded-xl hover:bg-neutral-800 transition cursor-pointer"
                >
                  Close
                </button>
                {appliedJobs.includes(selectedJobForDetails.id) ? (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl cursor-not-allowed"
                  >
                    Applied Successfully
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedJobForApply(selectedJobForDetails);
                      setSelectedJobForDetails(null);
                      setShowResumeInlineDetails(false);
                    }}
                    className="px-6 py-2.5 bg-brand-blue text-white hover:bg-brand-blue/90 text-xs font-bold rounded-xl transition cursor-pointer shadow-lg shadow-brand-blue/15"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Apply Modal with Resume Selector */}
      <AnimatePresence>
        {selectedJobForApply && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-app-bg border border-app-border rounded-[28px] overflow-hidden card-shadow p-6"
            >
              <div className="flex justify-between items-center border-b border-app-border/40 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-bold text-app-text">Apply for Position</h3>
                  <p className="text-xs text-app-muted mt-0.5">{selectedJobForApply.role} at {selectedJobForApply.company}</p>
                </div>
                <button 
                  onClick={() => setSelectedJobForApply(null)}
                  className="p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isSubmitSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-app-text">Application Submitted!</h4>
                  <p className="text-xs text-app-muted">Successfully transmitted to {selectedJobForApply.company} hiring managers.</p>
                </div>
              ) : (
                <form onSubmit={handleFinalApplySubmit} className="space-y-6">
                  {/* Option Choice Tabs */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-app-muted block">Choose Resume to Submit</label>
                    <div className="grid grid-cols-2 gap-2 bg-app-surface border border-app-border p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setApplyResumeOption('existing')}
                        className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          applyResumeOption === 'existing' 
                            ? 'bg-brand-blue text-white shadow-md' 
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        Use Built Resume
                      </button>
                      <button
                        type="button"
                        onClick={() => setApplyResumeOption('upload')}
                        className={`py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          applyResumeOption === 'upload' 
                            ? 'bg-brand-blue text-white shadow-md' 
                            : 'text-app-muted hover:text-app-text'
                        }`}
                      >
                        Upload Custom
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Content Pane */}
                  <div className="p-4 rounded-2xl bg-app-surface border border-app-border">
                    {applyResumeOption === 'existing' ? (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-app-text truncate">{existingResumeName}</p>
                          <p className="text-[9px] text-app-muted font-bold mt-0.5">SYNCED WITH ARYX RESUME BUILDER</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedFileName ? (
                          <div className="flex items-center justify-between bg-indigo-500/5 border border-indigo-500/10 p-2.5 rounded-xl">
                            <span className="text-xs font-bold text-indigo-400 truncate max-w-[220px]">{uploadedFileName}</span>
                            <button 
                              type="button"
                              onClick={() => setUploadedFileName('')}
                              className="text-[10px] text-app-muted hover:text-red-500 font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="border border-dashed border-app-border rounded-xl p-6 text-center space-y-2 hover:border-brand-blue transition-colors relative">
                            <Upload className="w-6 h-6 text-app-muted mx-auto" />
                            <div>
                              <p className="text-[10px] font-bold text-app-text">Select a resume file (.pdf, .docx)</p>
                            </div>
                            <label className="inline-block px-3 py-1.5 bg-app-bg border border-app-border text-[9px] font-bold text-app-text rounded-lg cursor-pointer">
                              Choose File
                              <input 
                                type="file" 
                                accept=".pdf,.docx" 
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    setUploadedFileName(e.target.files[0].name);
                                  }
                                }} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJobForApply(null)}
                      className="w-full py-3 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-xs font-extrabold cursor-pointer transition shadow-lg shadow-brand-blue/15 uppercase tracking-wide"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
