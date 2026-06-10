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
  AlertCircle
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

export default function JobsTab() {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

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

  const toggleApply = (id: string) => {
    if (appliedJobs.includes(id)) {
      setAppliedJobs(prev => prev.filter(jId => jId !== id));
    } else {
      setAppliedJobs(prev => [...prev, id]);
    }
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
                          <p className="text-xs font-bold text-app-muted mt-0.5">{job.company}</p>
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
                          toggleApply(job.id);
                        }}
                        className={`px-4 py-2.5 font-bold text-xs rounded-xl transition-all grow md:grow-0 text-center uppercase tracking-wide min-w-[90px] ${
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
    </div>
  );
}
