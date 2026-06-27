import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  Check, 
  Search, 
  Clock, 
  Sparkles, 
  X, 
  User, 
  UserPlus, 
  Building, 
  CheckCircle2,
  Mail,
  MapPin,
  Briefcase,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface Recruiter {
  id: string;
  name: string;
  company: string;
  role: string;
  avatarBg: string;
  focus: string[];
  isAvailable: boolean;
  responseTime: string;
  email: string;
  location: string;
  bio: string;
  experience: string;
}

interface HandshakeRequest {
  id: string;
  recruiterId: string;
  recruiterName: string;
  company: string;
  date: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

const INITIAL_RECRUITERS: Recruiter[] = [
  {
    id: 'rec-1',
    name: 'Sarah Jenkins',
    company: 'Google',
    role: 'Principal Tech Recruiter',
    avatarBg: 'bg-red-500',
    focus: ['Frontend Developer', 'React Expert', 'UI/UX Designer'],
    isAvailable: true,
    responseTime: '< 12 Hours',
    email: 'sjenkins@google.com',
    location: 'Mountain View, CA',
    bio: 'Sourcing engineering superstars for Google Core Developer Platforms and Chrome UX. Passionate about beautiful interfaces and blazing fast user experiences.',
    experience: '8+ years recruiting experienced web devs'
  },
  {
    id: 'rec-2',
    name: 'Arjun Mehta',
    company: 'Microsoft',
    role: 'Talent Acquisition Lead',
    avatarBg: 'bg-blue-600',
    focus: ['Full Stack Developer', 'Cloud Architect', 'Java Developer'],
    isAvailable: true,
    responseTime: '< 24 Hours',
    email: 'arjun.mehta@microsoft.com',
    location: 'Redmond, WA',
    bio: 'Finding cloud-native developers and full stack architects to scale Azure services. Always looking for students who can write clean, testable system code.',
    experience: '6+ years in tech & cloud talent acquisition'
  },
  {
    id: 'rec-3',
    name: 'Jessica Chen',
    company: 'Figma',
    role: 'Senior Product Recruiter',
    avatarBg: 'bg-purple-600',
    focus: ['UI/UX Designer', 'Interaction Engineer', 'React Developer'],
    isAvailable: true,
    responseTime: '< 4 Hours',
    email: 'jess.chen@figma.com',
    location: 'San Francisco, CA',
    bio: 'Scouting for creative coders who blend design fidelity with structural React code. Let’s make design tools accessible on the web together.',
    experience: '5 years hiring designers & designers-who-code'
  },
  {
    id: 'rec-4',
    name: 'David Vance',
    company: 'Amazon',
    role: 'Technical Sourcing Lead',
    avatarBg: 'bg-orange-500',
    focus: ['Backend Engineer', 'Systems Engineer', 'AWS Expert'],
    isAvailable: true,
    responseTime: '< 48 Hours',
    email: 'dvance@amazon.com',
    location: 'Seattle, WA',
    bio: 'Hiring microservice engineers to build the future of next-generation distributed logic and supply networks at Amazon Web Services.',
    experience: '10+ years backend technical sourcing'
  },
  {
    id: 'rec-5',
    name: 'Ananya Roy',
    company: 'TCS',
    role: 'Lead Campus Recruiter',
    avatarBg: 'bg-indigo-600',
    focus: ['Graduate Software Engineer', 'Database Administrator'],
    isAvailable: true,
    responseTime: '< 24 Hours',
    email: 'ananya.roy@tcs.com',
    location: 'Bengaluru, India',
    bio: 'Orchestrating global campus drives and specialized training placement rosters across major engineering universities in the APAC circuit.',
    experience: '7 years engineering university relations'
  }
];

export default function RecruiterHandshakeGateway() {
  const [recruiters] = useState<Recruiter[]>(INITIAL_RECRUITERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecruiterForProfile, setSelectedRecruiterForProfile] = useState<Recruiter | null>(null);
  const [requests, setRequests] = useState<HandshakeRequest[]>([]);
  const [successToast, setSuccessToast] = useState('');
  const [simulationActive, setSimulationActive] = useState<string | null>(null);

  // Load from localStorage for persistence
  useEffect(() => {
    const saved = localStorage.getItem('aryx_recruiter_pitch_requests');
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse requests", e);
      }
    }
  }, []);

  const saveRequests = (updated: HandshakeRequest[]) => {
    setRequests(updated);
    localStorage.setItem('aryx_recruiter_pitch_requests', JSON.stringify(updated));
  };

  const handleInstantRequestPick = (recruiter: Recruiter) => {
    // Check if request already exists
    if (requests.some(req => req.recruiterId === recruiter.id && req.status === 'Pending')) {
      alert(`You already have an outstanding pick request pending with ${recruiter.name}.`);
      return;
    }

    const newRequest: HandshakeRequest = {
      id: `pitch-${Date.now()}`,
      recruiterId: recruiter.id,
      recruiterName: recruiter.name,
      company: recruiter.company,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending'
    };

    const nextRequests = [newRequest, ...requests];
    saveRequests(nextRequests);
    
    setSuccessToast(`Requested! Dynamic handshake request successfully dispatched to ${recruiter.name} (${recruiter.company})!`);

    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  const handleCancelRequest = (requestId: string) => {
    const nextRequests = requests.filter(r => r.id !== requestId);
    saveRequests(nextRequests);
  };

  // Simulates a recruiter reviewing and "picking" the student
  const handleSimulateReview = (requestId: string, approve: boolean) => {
    setSimulationActive(requestId);
    setTimeout(() => {
      const nextRequests = requests.map(req => {
        if (req.id === requestId) {
          return { ...req, status: approve ? 'Accepted' as const : 'Declined' as const };
        }
        return req;
      });
      saveRequests(nextRequests);
      setSimulationActive(null);
      setSuccessToast(approve ? "Congratulations! The recruiter reviewed your request and chose to pick your profile!" : "Request processed.");
      setTimeout(() => setSuccessToast(''), 4000);
    }, 1200);
  };

  // Filter recruiters who are available using the search term
  const filteredRecruiters = recruiters.filter(rec => {
    if (!rec.isAvailable) return false;
    const matchString = `${rec.name} ${rec.company} ${rec.focus.join(' ')}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div id="recruiter-handshake-section" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Active Talent Marketplace</span>
          <h3 className="text-2xl font-display font-bold text-app-text mt-1">Available Recruiters to Pick You</h3>
          <p className="text-xs text-app-muted mt-1 font-medium">
            These authorized recruiters are actively looking for profiles. Click on a recruiter card to view their profile, or request them to pick you instantly.
          </p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-app-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recruiters, focus area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none focus:ring-1 focus:ring-brand-blue font-semibold"
          />
        </div>
      </div>

      {successToast && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2.5 card-shadow"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0 animate-bounce" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* Recruiter Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecruiters.map((rec) => {
          const isPending = requests.some(req => req.recruiterId === rec.id && req.status === 'Pending');
          const isAccepted = requests.some(req => req.recruiterId === rec.id && req.status === 'Accepted');
          
          return (
            <motion.div
              key={rec.id}
              whileHover={{ y: -3 }}
              className="p-5 rounded-3xl glass border border-app-border card-shadow flex flex-col justify-between space-y-4 hover:border-brand-blue/30 transition-all bg-app-surface/40 cursor-pointer"
              onClick={() => setSelectedRecruiterForProfile(rec)}
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${rec.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {rec.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-app-text leading-tight hover:text-brand-blue transition">
                        {rec.name}
                      </h4>
                      <p className="text-[10px] text-app-muted font-bold block leading-none mt-1">
                        {rec.role} at <span className="text-[#3b82f6] font-extrabold">{rec.company}</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>

                {/* Specialties tags */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {rec.focus.map((skill, idx) => (
                    <span key={idx} className="text-[9px] px-2.5 py-1 rounded-lg bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-app-muted font-semibold bg-app-bg/50 p-2.5 rounded-xl border border-app-border/40 font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-blue" /> Review: {rec.responseTime}</span>
                  <span className="text-[9px] text-[#3b82f6] hover:underline font-extrabold" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRecruiterForProfile(rec);
                  }}>View Profile</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                {isAccepted ? (
                  <div className="w-full py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1">
                    <UserCheck className="w-3.5 h-3.5" /> Pick Completed
                  </div>
                ) : isPending ? (
                  <div className="w-full py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 animate-spin" /> Pending Request ...
                  </div>
                ) : (
                  <button
                    onClick={() => handleInstantRequestPick(rec)}
                    className="w-full py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-[11px] font-bold tracking-wide transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 border border-transparent shadow"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Request to Pick Me
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recruiter Profile Modal Popup */}
      <AnimatePresence>
        {selectedRecruiterForProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-app-bg border border-app-border rounded-[32px] overflow-hidden card-shadow"
            >
              {/* Header block with avatar background */}
              <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-app-bg to-app-bg border-b border-app-border/40 pb-6">
                <button 
                  onClick={() => setSelectedRecruiterForProfile(null)} 
                  className="absolute right-5 top-5 p-1.5 rounded-full bg-app-surface/80 hover:bg-app-surface border border-app-border text-app-muted hover:text-app-text transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl ${selectedRecruiterForProfile.avatarBg} flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0`}>
                    {selectedRecruiterForProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display font-black text-xl text-app-text">{selectedRecruiterForProfile.name}</h4>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Active Now
                      </span>
                    </div>
                    <p className="text-xs text-brand-blue font-extrabold">
                      {selectedRecruiterForProfile.role} at <span className="underline">{selectedRecruiterForProfile.company}</span>
                    </p>
                    <div className="flex items-center gap-3.5 text-[11px] text-app-muted font-bold pt-1 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedRecruiterForProfile.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Spends {selectedRecruiterForProfile.responseTime} in reviews</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* About Bio */}
                <div className="space-y-2">
                  <h5 className="text-[11px] font-bold text-app-muted uppercase tracking-widest">About Sourcing Partner</h5>
                  <p className="text-xs text-app-text font-medium leading-relaxed bg-app-surface p-4 rounded-2xl border border-app-border/30 italic">
                    "{selectedRecruiterForProfile.bio}"
                  </p>
                </div>

                {/* Sourcing Specialties */}
                <div className="space-y-2.5">
                  <h5 className="text-[11px] font-bold text-app-muted uppercase tracking-widest">Active Recruiting Focus Points</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecruiterForProfile.focus.map((f, i) => (
                      <span key={i} className="text-xs font-bold px-3 py-1.5 bg-brand-blue/5 text-brand-blue border border-brand-blue/15 rounded-xl">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Logistics */}
                <div className="p-4 bg-app-surface/40 border border-app-border rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-app-muted">Direct Recruiting Hub:</span>
                    <span className="text-app-text font-mono font-semibold flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedRecruiterForProfile.email}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-app-muted">Sourcing Experience:</span>
                    <span className="text-app-text font-medium">{selectedRecruiterForProfile.experience}</span>
                  </div>
                </div>

                {/* Modal footer / Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedRecruiterForProfile(null)}
                    className="w-1/2 py-3 bg-app-surface border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer hover:bg-neutral-800 transition"
                  >
                    Close Window
                  </button>

                  {requests.some(req => req.recruiterId === selectedRecruiterForProfile.id && req.status === 'Accepted') ? (
                    <div className="w-1/2 py-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <UserCheck className="w-4 h-4" /> Pick Active!
                    </div>
                  ) : requests.some(req => req.recruiterId === selectedRecruiterForProfile.id && req.status === 'Pending') ? (
                    <div className="w-1/2 py-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 font-semibold">
                      <Clock className="w-4 h-4 animate-spin" /> Pending review...
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleInstantRequestPick(selectedRecruiterForProfile);
                        setSelectedRecruiterForProfile(null);
                      }}
                      className="w-1/2 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <UserPlus className="w-4 h-4" /> Request Pick Now
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simple Tracking list */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border border-app-border card-shadow space-y-5">
        <div className="flex justify-between items-center pb-2 border-b border-app-border/40">
          <div>
            <h4 className="text-base font-display font-bold text-app-text">Assigned Recruiters</h4>
            <p className="text-xs text-app-muted font-medium mt-0.5">Recruiters currently assigned to represent and assist the student for Marketplace opportunities.</p>
            <p className="text-[11px] text-[#3b82f6] font-semibold mt-1">Recruiters currently representing your profile for suitable opportunities.</p>
          </div>
          <span className="text-[10px] font-mono font-bold text-app-muted">Total: {requests.length}</span>
        </div>

        {requests.length === 0 ? (
          <div className="p-10 bg-app-surface/20 border border-app-border border-dashed rounded-2xl text-center text-app-muted text-xs font-semibold">
            No assigned recruiters found. Click "Request to Pick Me" on any recruiter above to secure a representation.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="p-4 rounded-2xl bg-app-surface/40 border border-app-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-app-surface/60 transition-all text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-app-text flex items-center gap-1.5 leading-tight">
                    <Building className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                    <span>Request sent to {req.recruiterName} at <span className="text-brand-blue font-extrabold">{req.company}</span></span>
                  </div>
                  <span className="text-[10px] text-app-muted font-mono block">Submitted: {req.date}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Simulator Controls */}
                  {req.status === 'Pending' && (
                    <div className="flex items-center gap-1.5 bg-app-bg border border-app-border p-1 rounded-lg">
                      <span className="text-[9px] font-bold text-app-muted px-1">Simulate:</span>
                      <button
                        onClick={() => handleSimulateReview(req.id, true)}
                        className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded transition cursor-pointer"
                      >
                        ✔ Pick Profile
                      </button>
                      <button
                        onClick={() => handleSimulateReview(req.id, false)}
                        className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-500 text-[10px] font-bold rounded transition cursor-pointer"
                      >
                        ✖ Postpone
                      </button>
                    </div>
                  )}

                  {/* Status Indicator */}
                  {req.status === 'Accepted' ? (
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Handshaked!
                    </span>
                  ) : req.status === 'Declined' ? (
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-xl">
                      Passed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl flex items-center gap-1 animate-pulse">
                      Awaiting Check
                    </span>
                  )}

                  {req.status === 'Pending' && (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="text-app-muted hover:text-red-500 transition-colors p-1"
                      title="Delete profile request"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
