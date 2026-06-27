import { useState } from 'react';
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Check, 
  MessageSquare,
  Sparkles,
  Award,
  Calendar,
  X,
  Plus
} from 'lucide-react';

interface RecruiterCandidatesTabProps {
  candidates: Array<{
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    currentCompany: string;
    currentRole: string;
    skills: string[];
    about: string;
    status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
    appliedDate: string;
    assignedByAdmin?: string;
    assignedDate?: string;
    assignedJobs?: string[];
  }>;
  selectedCandidateId: string;
  onSelectCandidate: (id: string) => void;
  onUpdateStatus: (id: string, status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected') => void;
}

export default function RecruiterCandidatesTab({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onUpdateStatus
}: RecruiterCandidatesTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'resume' | 'experience' | 'skills' | 'certifications' | 'history'>('overview');
  const [search, setSearch] = useState('');

  const currentIdx = candidates.findIndex(c => c.id === selectedCandidateId);
  const activeCandidate = candidates[currentIdx] || candidates[0];

  const handlePrev = () => {
    if (currentIdx > 0) {
      onSelectCandidate(candidates[currentIdx - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIdx < candidates.length - 1) {
      onSelectCandidate(candidates[currentIdx + 1].id);
    }
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-left">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectCandidate('')} 
            className="p-2 bg-app-bg hover:bg-app-surface border border-app-border rounded-xl text-app-muted hover:text-app-text transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Candidates List
          </button>
          <span className="text-xs text-app-muted font-bold px-3 py-1 bg-app-surface rounded-full border border-app-border">
            Candidate {currentIdx + 1} of {candidates.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentIdx === 0}
            onClick={handlePrev}
            className="p-2 border border-app-border bg-app-surface disabled:opacity-40 hover:bg-app-bg text-app-text rounded-xl transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            disabled={currentIdx === candidates.length - 1}
            onClick={handleNext}
            className="p-2 border border-app-border bg-app-surface disabled:opacity-40 hover:bg-app-bg text-app-text rounded-xl transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Side: Candidates Master Selection list (visible if no candidate is selected or as a floating panel on desktop, span 4) */}
        <div className="lg:col-span-4 p-5 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-app-text">Select Candidate</h3>
            <span className="text-[10px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">{candidates.length} Total</span>
          </div>

          <input 
            type="text" 
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-app-bg border border-app-border rounded-xl text-xs font-bold text-app-text focus:outline-none focus:border-brand-blue"
          />

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCandidates.map((cand) => {
              const isSelected = cand.id === activeCandidate.id;
              return (
                <div 
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-sm' 
                      : 'bg-app-bg border-app-border hover:border-brand-blue/30 text-app-text'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-xs font-extrabold truncate">{cand.name}</div>
                    <div className="text-[9px] text-app-muted font-bold truncate mt-0.5">{cand.role}</div>
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    cand.status === 'Selected' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                    cand.status === 'Rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                    cand.status === 'Interview' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                    'bg-violet-500/10 border-violet-500/20 text-violet-500'
                  }`}>
                    {cand.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Candidate Profile Details (span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main header profile info card */}
          <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-app-border/40">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-blue/10 border-2 border-brand-blue flex items-center justify-center text-brand-blue text-xl font-black shrink-0 shadow-inner">
                  {activeCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-display font-black text-app-text">{activeCandidate.name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 px-2.5 py-0.5 rounded-full">
                      {activeCandidate.status}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-app-muted mt-1">{activeCandidate.role}</p>
                  <p className="text-[10px] text-app-muted font-bold mt-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-blue shrink-0" /> Applied on {activeCandidate.appliedDate} • Ref ID: APP{activeCandidate.id.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Recruitment action triggers */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button 
                  onClick={() => onUpdateStatus(activeCandidate.id, 'Shortlisted')}
                  className="px-4 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  Shortlist
                </button>
                <button 
                  onClick={() => onUpdateStatus(activeCandidate.id, 'Interview')}
                  className="px-4 py-2.5 bg-brand-blue hover:bg-opacity-90 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  Move to Interview
                </button>
                <button 
                  onClick={() => onUpdateStatus(activeCandidate.id, 'Rejected')}
                  className="px-4 py-2.5 border border-rose-500 text-rose-500 hover:bg-rose-500/10 font-bold text-xs rounded-xl cursor-pointer transition-all active:scale-95 whitespace-nowrap"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Sub-Tabs Selector Bar */}
            <div className="flex flex-wrap items-center gap-1 bg-app-bg p-1.5 rounded-2xl border border-app-border overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'resume', label: 'Resume' },
                { id: 'experience', label: 'Experience' },
                { id: 'skills', label: 'Skills' },
                { id: 'certifications', label: 'Certifications' },
                { id: 'history', label: 'History' }
              ].map((sub) => {
                const isActive = activeSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setActiveSubTab(sub.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-app-surface text-brand-blue shadow-sm' 
                        : 'text-app-muted hover:text-app-text'
                    }`}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Content rendering */}
            <div className="pt-2">
              
              {/* Overview Tab Content */}
              {activeSubTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal info pane */}
                  <div className="p-5 rounded-2xl bg-app-bg border border-app-border space-y-4">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wide text-app-muted">Personal Information</h3>
                    <div className="space-y-3.5 text-xs font-bold text-app-text">
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Email</span>
                        <span className="truncate select-all">{activeCandidate.email}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Phone</span>
                        <span className="select-all">{activeCandidate.phone}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Location</span>
                        <span>{activeCandidate.location}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Experience</span>
                        <span>{activeCandidate.experience}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Current Company</span>
                        <span className="truncate">{activeCandidate.currentCompany}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-app-muted font-normal">Current Role</span>
                        <span className="truncate">{activeCandidate.currentRole}</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills summary pane */}
                  <div className="p-5 rounded-2xl bg-app-bg border border-app-border space-y-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-xs uppercase tracking-wide text-app-muted mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {activeCandidate.skills.map((sk, sIdx) => (
                          <span key={sIdx} className="text-xs font-extrabold text-brand-blue bg-brand-blue/10 border border-brand-blue/15 px-3 py-1 rounded-lg">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveSubTab('skills')}
                      className="text-[11px] font-bold text-brand-blue hover:underline text-left mt-4"
                    >
                      View All Skills Details →
                    </button>
                  </div>

                  {/* Assignment Information panel */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-brand-blue/5 to-indigo-500/5 border border-brand-blue/20 space-y-4">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wide text-brand-blue flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Assignment Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold text-app-text">
                      <div className="p-3 bg-app-surface border border-app-border rounded-xl space-y-1">
                        <span className="text-[10px] text-app-muted font-normal block uppercase">Assigned By</span>
                        <span>{activeCandidate.assignedByAdmin || 'Amit Sen (Company Admin)'}</span>
                      </div>
                      <div className="p-3 bg-app-surface border border-app-border rounded-xl space-y-1">
                        <span className="text-[10px] text-app-muted font-normal block uppercase">Assigned Date</span>
                        <span>{activeCandidate.assignedDate || '24 May 25'}</span>
                      </div>
                      <div className="p-3 bg-app-surface border border-app-border rounded-xl space-y-1">
                        <span className="text-[10px] text-app-muted font-normal block uppercase">Assigned For Jobs</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {(activeCandidate.assignedJobs || [activeCandidate.role]).map((job, jIdx) => (
                            <span key={jIdx} className="bg-brand-blue/10 text-brand-blue px-1.5 py-0.5 rounded text-[10px] font-extrabold">{job}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-app-surface border border-app-border rounded-xl space-y-1">
                        <span className="text-[10px] text-app-muted font-normal block uppercase">Current Pipeline Status</span>
                        <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded mt-0.5 ${
                          activeCandidate.status === 'Selected' ? 'bg-emerald-500/10 text-emerald-500' :
                          activeCandidate.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500' :
                          activeCandidate.status === 'Interview' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-brand-blue/10 text-brand-blue'
                        }`}>{activeCandidate.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* About panel (span 2 if space matches) */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-app-bg border border-app-border space-y-3">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wide text-app-muted">About</h3>
                    <p className="text-xs font-medium text-app-text leading-relaxed select-all">
                      {activeCandidate.about}
                    </p>
                  </div>

                  {/* Application history timeline list */}
                  <div className="md:col-span-2 p-5 rounded-2xl bg-app-bg border border-app-border space-y-4">
                    <h3 className="font-display font-bold text-xs uppercase tracking-wide text-app-muted">Application History</h3>
                    <div className="p-4 rounded-xl bg-app-surface border border-app-border flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <div className="font-extrabold text-app-text">{activeCandidate.role}</div>
                        <div className="text-[10px] text-app-muted font-bold">Engineering Department</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-app-muted font-bold mb-1">Applied {activeCandidate.appliedDate}</div>
                        <span className="text-[9px] font-bold bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded border border-brand-blue/25">Applied</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Resume Tab Content */}
              {activeSubTab === 'resume' && (
                <div className="p-6 rounded-2xl bg-app-bg border border-app-border space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-app-border/40">
                    <div>
                      <h4 className="text-sm font-extrabold text-app-text">{activeCandidate.name} - Resume.pdf</h4>
                      <p className="text-[10px] font-bold text-app-muted">Uploaded on application • Verified</p>
                    </div>
                    <button 
                      onClick={() => alert('Downloaded candidacy profile sheet')}
                      className="px-3.5 py-1.5 bg-brand-blue/15 text-brand-blue hover:bg-brand-blue/20 text-xs font-extrabold rounded-lg transition-all"
                    >
                      Download Resume
                    </button>
                  </div>
                  <div className="space-y-5 text-xs text-app-text">
                    <div className="space-y-2">
                      <h5 className="font-extrabold text-app-text uppercase tracking-widest text-[9px] text-brand-blue">Professional Summary</h5>
                      <p className="leading-relaxed font-medium text-app-muted">{activeCandidate.about}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-extrabold text-app-text uppercase tracking-widest text-[9px] text-brand-blue">Key Milestones</h5>
                      <div className="p-4 rounded-xl bg-app-surface border border-app-border space-y-2">
                        <div className="flex justify-between font-bold">
                          <span>{activeCandidate.currentRole} at {activeCandidate.currentCompany}</span>
                          <span className="text-app-muted">2022 - Present</span>
                        </div>
                        <p className="text-app-muted font-normal leading-relaxed">
                          Currently leading frontend delivery, architecting clean component frameworks, optimizing runtime bundle sizes, and mentoring junior staff.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Experience Tab Content */}
              {activeSubTab === 'experience' && (
                <div className="space-y-4">
                  {[
                    { company: activeCandidate.currentCompany, role: activeCandidate.currentRole, duration: '2022 - Present', desc: 'Developing enterprise web assets with React/Tailwind. Maintained 99.9% uptime, speed up build times by 32%.' },
                    { company: 'Global Solutions Dev Inc.', role: 'Software Engineer', duration: '2020 - 2022', desc: 'Contributed to microservices engineering in multi-disciplinary Scrum teams. Designed secure API proxy integrations.' }
                  ].map((exp, expIdx) => (
                    <div key={expIdx} className="p-5 rounded-2xl bg-app-bg border border-app-border text-left space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-xs text-app-text">{exp.role}</h4>
                          <p className="text-[10px] text-brand-blue font-bold mt-0.5">{exp.company}</p>
                        </div>
                        <span className="text-[10px] text-app-muted font-bold">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-app-muted leading-relaxed font-medium">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Tab Content */}
              {activeSubTab === 'skills' && (
                <div className="p-5 rounded-2xl bg-app-bg border border-app-border space-y-5">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wide text-app-muted">Technical Competency Score</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {activeCandidate.skills.map((skill, index) => {
                      const percentages = [95, 90, 88, 85, 80, 78, 75, 70];
                      const pct = percentages[index % percentages.length];
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-bold text-app-text">
                            <span>{skill}</span>
                            <span className="text-brand-blue">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-app-surface border border-app-border rounded-full overflow-hidden">
                            <div className="h-full bg-brand-blue rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Certifications Tab Content */}
              {activeSubTab === 'certifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'AWS Certified Cloud Practitioner', authority: 'Amazon Web Services', date: 'Dec 2025' },
                    { name: 'Certified Kubernetes Administrator', authority: 'Cloud Native Computing Foundation', date: 'Aug 2024' }
                  ].map((cert, certIdx) => (
                    <div key={certIdx} className="p-4 rounded-xl bg-app-bg border border-app-border flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                        <Award className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-app-text">{cert.name}</h4>
                        <p className="text-[9px] text-app-muted font-bold mt-0.5">{cert.authority} • {cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* History Tab Content */}
              {activeSubTab === 'history' && (
                <div className="space-y-4">
                  {[
                    { title: 'Moved to Shortlist', user: 'Priya Sharma (You)', time: 'Yesterday' },
                    { title: 'candidature Verification Success', user: 'System Agent', time: '2 days ago' },
                    { title: 'Application Submitted', user: activeCandidate.name, time: `On ${activeCandidate.appliedDate}` }
                  ].map((hist, histIdx) => (
                    <div key={histIdx} className="p-4 rounded-xl bg-app-bg border border-app-border flex gap-3 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-blue mt-1 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-app-text">{hist.title}</h4>
                        <p className="text-[10px] text-app-muted font-bold mt-0.5">By {hist.user} • {hist.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
