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
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { useJobSeeker } from '../../../../context/JobSeekerContext';

export interface Recruiter {
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
  specialization: string;
}

export type HandshakeStatus = 
  | 'Requested' 
  | 'Pending Review' 
  | 'Accepted' 
  | 'Representing You' 
  | 'Completed' 
  | 'Rejected' 
  | 'Withdrawn' 
  | 'Expired' 
  | 'Cancelled';

export interface HandshakeRequest {
  id: string;
  recruiterId: string;
  recruiterName: string;
  company: string;
  date: string;
  status: HandshakeStatus;
  note?: string;
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
    bio: 'Sourcing engineering superstars for Google Core Developer Platforms and Chrome UX. Passionate about beautiful interfaces and fast web experiences.',
    experience: '8+ years recruiting experienced web devs',
    specialization: 'Frontend & UI Engineering'
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
    bio: 'Finding cloud-native developers and full stack architects to scale Azure services. Looking for candidates with clean system architecture skills.',
    experience: '6+ years in cloud talent acquisition',
    specialization: 'Cloud & Infrastructure'
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
    bio: 'Scouting creative coders who blend design fidelity with structural React code. Making design tools accessible on the web.',
    experience: '5 years hiring product designers & engineers',
    specialization: 'Product & Design Systems'
  },
  {
    id: 'rec-4',
    name: 'David Vance',
    company: 'Amazon',
    role: 'Technical Sourcing Lead',
    avatarBg: 'bg-amber-500',
    focus: ['Backend Engineer', 'Systems Engineer', 'AWS Expert'],
    isAvailable: true,
    responseTime: '< 48 Hours',
    email: 'dvance@amazon.com',
    location: 'Seattle, WA',
    bio: 'Hiring microservice engineers to build high-concurrency cloud networks and distributed architecture at AWS.',
    experience: '10+ years backend technical sourcing',
    specialization: 'Backend & Systems'
  },
  {
    id: 'rec-5',
    name: 'Ananya Roy',
    company: 'TCS',
    role: 'Lead Campus Recruiter',
    avatarBg: 'bg-indigo-600',
    focus: ['Graduate Engineer', 'Full Stack Developer', 'Database Admin'],
    isAvailable: true,
    responseTime: '< 24 Hours',
    email: 'ananya.roy@tcs.com',
    location: 'Bengaluru, India',
    bio: 'Orchestrating university placements and early career recruitment across global enterprise tech sectors.',
    experience: '7 years university talent acquisition',
    specialization: 'Early Career & University'
  },
  {
    id: 'rec-6',
    name: 'Marcus Thorne',
    company: 'Stripe',
    role: 'Staff Technical Recruiter',
    avatarBg: 'bg-emerald-600',
    focus: ['Fintech Infra', 'TypeScript Lead', 'Security Specialist'],
    isAvailable: true,
    responseTime: '< 6 Hours',
    email: 'mthorne@stripe.com',
    location: 'San Francisco, CA',
    bio: 'Sourcing elite engineers for payment rails, fraud detection models, and high-concurrency ledger infrastructure.',
    experience: '9+ years hiring core infrastructure engineers',
    specialization: 'Fintech & Security'
  },
  {
    id: 'rec-7',
    name: 'Elena Rostova',
    company: 'Apple',
    role: 'Executive Recruiter',
    avatarBg: 'bg-slate-700',
    focus: ['iOS Developer', 'Swift Lead', 'Embedded Systems'],
    isAvailable: true,
    responseTime: '< 18 Hours',
    email: 'e_rostova@apple.com',
    location: 'Cupertino, CA',
    bio: 'Connecting elite mobile architects and system engineers with Apple platform teams.',
    experience: '7+ years executive recruiting',
    specialization: 'Mobile & Hardware Software'
  },
  {
    id: 'rec-8',
    name: 'Michael Chang',
    company: 'Meta',
    role: 'AI / ML Talent Sourcing Lead',
    avatarBg: 'bg-sky-600',
    focus: ['ML Engineer', 'PyTorch Specialist', 'Data Scientist'],
    isAvailable: true,
    responseTime: '< 12 Hours',
    email: 'mchang@meta.com',
    location: 'Menlo Park, CA',
    bio: 'Recruiting world-class researchers and engineers building generative AI models and recommendation engines.',
    experience: '6+ years AI talent acquisition',
    specialization: 'AI & Data Science'
  },
  {
    id: 'rec-9',
    name: 'Sophia Martinez',
    company: 'Netflix',
    role: 'Senior Talent Acquisition Manager',
    avatarBg: 'bg-rose-600',
    focus: ['Streaming Systems', 'Full Stack', 'Node.js Expert'],
    isAvailable: true,
    responseTime: '< 8 Hours',
    email: 'smartinez@netflix.com',
    location: 'Los Gatos, CA',
    bio: 'Discovering high-performing senior engineers to drive content delivery algorithms and global UI infrastructure.',
    experience: '8 years high-density engineering hiring',
    specialization: 'Full Stack & Streaming'
  },
  {
    id: 'rec-10',
    name: 'Liam O\'Connor',
    company: 'Atlassian',
    role: 'DevOps & Platform Recruiter',
    avatarBg: 'bg-blue-500',
    focus: ['DevOps Engineer', 'Kubernetes', 'CI/CD Lead'],
    isAvailable: true,
    responseTime: '< 24 Hours',
    email: 'loconnor@atlassian.com',
    location: 'Sydney, Australia',
    bio: 'Specialized in platform engineering, reliability engineering, and developer tooling experience.',
    experience: '5+ years DevOps sourcing',
    specialization: 'DevOps & Site Reliability'
  },
  {
    id: 'rec-11',
    name: 'Priya Sharma',
    company: 'Adobe',
    role: 'Senior Staff Sourcing Partner',
    avatarBg: 'bg-red-600',
    focus: ['Creative Cloud', 'C++', 'WebAssembly'],
    isAvailable: true,
    responseTime: '< 16 Hours',
    email: 'psharma@adobe.com',
    location: 'San Jose, CA',
    bio: 'Bringing high-performance graphics and web rendering specialists into Adobe Creative Cloud ecosystem.',
    experience: '9 years technical sourcing',
    specialization: 'Graphics & Performance'
  },
  {
    id: 'rec-12',
    name: 'Alex Rivera',
    company: 'Salesforce',
    role: 'Enterprise Talent Partner',
    avatarBg: 'bg-cyan-600',
    focus: ['Enterprise Architect', 'Salesforce Dev', 'API Architect'],
    isAvailable: true,
    responseTime: '< 12 Hours',
    email: 'arivera@salesforce.com',
    location: 'Chicago, IL',
    bio: 'Partnering with enterprise digital transformation teams to hire cloud solution architects and CRM platform leads.',
    experience: '10+ years enterprise hiring',
    specialization: 'Enterprise & CRM'
  }
];

export default function RecruiterHandshakeGateway() {
  const { user, userProfile } = useAuth();
  const { jobSeekerProfile } = useJobSeeker();
  const uid = user?.uid || userProfile?.uid;

  const [recruiters, setRecruiters] = useState<Recruiter[]>(INITIAL_RECRUITERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecruiterForProfile, setSelectedRecruiterForProfile] = useState<Recruiter | null>(null);
  const [requests, setRequests] = useState<HandshakeRequest[]>([]);
  const [successToast, setSuccessToast] = useState('');

  // "View All Recruiters" Modal state
  const [showAllModal, setShowAllModal] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Load from Firestore / localStorage
  useEffect(() => {
    async function loadFirestoreRecruiters() {
      try {
        const snap = await getDocs(collection(db, 'marketplace_recruiters'));
        if (!snap.empty) {
          const list: Recruiter[] = [];
          snap.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              name: data.fullName || data.name || 'Recruiter',
              company: data.companyName || data.company || 'Enterprise',
              role: data.designation || data.role || 'Talent Acquisition',
              avatarBg: 'bg-blue-600',
              focus: data.focus || ['Software Engineer', 'Full Stack'],
              isAvailable: true,
              responseTime: data.responseTime || '< 24 Hours',
              email: data.email || '',
              location: data.location || 'Remote',
              bio: data.bio || 'Talent Acquisition Partner',
              experience: data.experience || '5+ years experience',
              specialization: data.specialization || 'Tech Recruitment'
            });
          });
          if (list.length > 0) {
            setRecruiters(list);
          }
        }
      } catch (err) {
        console.warn("Using default recruiter showcase list:", err);
      }
    }
    loadFirestoreRecruiters();

    if (jobSeekerProfile?.assignedRecruiters && Array.isArray(jobSeekerProfile.assignedRecruiters)) {
      setRequests(jobSeekerProfile.assignedRecruiters);
    } else {
      const saved = localStorage.getItem('aryx_recruiter_pitch_requests');
      if (saved) {
        try {
          setRequests(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse requests", e);
        }
      }
    }
  }, [jobSeekerProfile]);

  const saveRequests = async (updated: HandshakeRequest[]) => {
    setRequests(updated);
    localStorage.setItem('aryx_recruiter_pitch_requests', JSON.stringify(updated));

    if (uid) {
      try {
        const docRef = doc(db, 'marketplace_jobseekers', uid);
        await updateDoc(docRef, {
          assignedRecruiters: updated,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `marketplace_jobseekers/${uid}`);
      }
    }
  };

  const handleInstantRequestPick = (recruiter: Recruiter) => {
    if (requests.some(req => req.recruiterId === recruiter.id && (req.status === 'Requested' || req.status === 'Pending Review' || req.status === 'Accepted' || req.status === 'Representing You'))) {
      alert(`You already have an active request or representation with ${recruiter.name}.`);
      return;
    }

    const newRequest: HandshakeRequest = {
      id: `req-${Date.now()}`,
      recruiterId: recruiter.id,
      recruiterName: recruiter.name,
      company: recruiter.company,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Requested'
    };

    const nextRequests = [newRequest, ...requests];
    saveRequests(nextRequests);
    
    setSuccessToast(`Request sent! Representation request successfully submitted to ${recruiter.name} (${recruiter.company}).`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleUpdateStatus = (requestId: string, newStatus: HandshakeStatus) => {
    const updated = requests.map(r => r.id === requestId ? { ...r, status: newStatus } : r);
    saveRequests(updated);
    setSuccessToast(`Updated status to "${newStatus}".`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCancelRequest = (requestId: string) => {
    const nextRequests = requests.map(r => r.id === requestId ? { ...r, status: 'Withdrawn' as HandshakeStatus } : r);
    saveRequests(nextRequests);
    setSuccessToast("Request withdrawn successfully.");
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Filter recruiters for dashboard (max 6)
  const dashboardRecruiters = recruiters.filter(rec => {
    if (!rec.isAvailable) return false;
    const matchString = `${rec.name} ${rec.company} ${rec.focus.join(' ')}`.toLowerCase();
    return matchString.includes(searchTerm.toLowerCase());
  }).slice(0, 6);

  // Filter recruiters for modal with pagination
  const modalFilteredRecruiters = recruiters.filter(rec => {
    if (!rec.isAvailable) return false;
    const matchSearch = `${rec.name} ${rec.company} ${rec.role} ${rec.focus.join(' ')}`.toLowerCase().includes(modalSearchTerm.toLowerCase());
    const matchSpec = selectedSpecialization === 'All' || rec.specialization === selectedSpecialization;
    return matchSearch && matchSpec;
  });

  const totalPages = Math.ceil(modalFilteredRecruiters.length / pageSize) || 1;
  const paginatedModalRecruiters = modalFilteredRecruiters.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const specializations = ['All', ...Array.from(new Set(recruiters.map(r => r.specialization)))];

  // Status helper mapping
  const getStatusBadge = (status: HandshakeStatus) => {
    switch (status) {
      case 'Requested':
        return <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">Requested</span>;
      case 'Pending Review':
        return <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">Pending Review</span>;
      case 'Accepted':
        return <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3" /> Accepted</span>;
      case 'Representing You':
        return <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Representing You</span>;
      case 'Completed':
        return <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">Completed</span>;
      case 'Rejected':
        return <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">Rejected</span>;
      case 'Withdrawn':
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 border border-slate-500/20 px-2.5 py-0.5 rounded-full">Withdrawn</span>;
      case 'Expired':
        return <span className="text-[10px] font-bold text-gray-500 bg-gray-500/10 border border-gray-500/20 px-2.5 py-0.5 rounded-full">Expired</span>;
      case 'Cancelled':
        return <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">Cancelled</span>;
      default:
        return <span className="text-[10px] font-bold text-slate-500 bg-slate-500/10 px-2.5 py-0.5 rounded-full">{status}</span>;
    }
  };

  return (
    <div id="recruiter-handshake-section" className="space-y-6">
      {/* SECTION 1: AVAILABLE RECRUITERS HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Active Talent Marketplace</span>
          <h3 className="text-2xl font-display font-bold text-app-text mt-1">Available Recruiters</h3>
          <p className="text-xs text-app-muted mt-1 font-medium">
            Authorized recruiters actively sourcing talent. Select a recruiter to view details or request representation.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow md:w-64">
            <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search recruiters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none focus:ring-1 focus:ring-brand-blue font-semibold"
            />
          </div>

          {/* View All Button */}
          <button
            onClick={() => setShowAllModal(true)}
            className="px-4 py-2 bg-brand-blue hover:bg-brand-blue/90 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Users className="w-4 h-4" /> View All ({recruiters.length})
          </button>
        </div>
      </div>

      {successToast && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* Recruiter Showcase Cards (Limited to 6 on Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardRecruiters.map((rec) => {
          const activeRequest = requests.find(req => req.recruiterId === rec.id && !['Withdrawn', 'Rejected', 'Cancelled', 'Expired'].includes(req.status));
          
          return (
            <motion.div
              key={rec.id}
              whileHover={{ y: -2 }}
              className="p-5 rounded-2xl bg-app-surface border border-app-border card-shadow flex flex-col justify-between space-y-4 hover:border-brand-blue/30 transition-all cursor-pointer"
              onClick={() => setSelectedRecruiterForProfile(rec)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${rec.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                      {rec.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-app-text leading-tight hover:text-brand-blue transition">
                        {rec.name}
                      </h4>
                      <p className="text-[10px] text-app-muted font-semibold block leading-none mt-1">
                        {rec.role} at <span className="text-brand-blue font-bold">{rec.company}</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {rec.focus.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="text-[9px] px-2 py-0.5 rounded-md bg-indigo-500/5 text-indigo-500 border border-indigo-500/10 font-bold">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[10px] text-app-muted font-semibold bg-app-bg/50 p-2 rounded-lg border border-app-border/40 font-mono">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-brand-blue" /> Response: {rec.responseTime}</span>
                  <span className="text-[9px] text-brand-blue hover:underline font-bold">View Profile</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                {activeRequest ? (
                  <div className="w-full py-2 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-xl text-[11px] font-bold text-center flex items-center justify-center gap-1">
                    {getStatusBadge(activeRequest.status)}
                  </div>
                ) : (
                  <button
                    onClick={() => handleInstantRequestPick(rec)}
                    className="w-full py-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Request Representation
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VIEW ALL RECRUITERS MODAL */}
      <AnimatePresence>
        {showAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-app-surface border border-app-border rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-app-border flex items-center justify-between bg-app-bg/50">
                <div>
                  <h3 className="text-xl font-display font-bold text-app-text">All Marketplace Recruiters</h3>
                  <p className="text-xs text-app-muted mt-0.5">Explore authorized recruiters across tech sectors and request representation.</p>
                </div>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="p-2 text-app-muted hover:text-app-text rounded-xl bg-app-bg hover:bg-app-surface border border-app-border cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls bar */}
              <div className="p-4 bg-app-bg border-b border-app-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, company, role..."
                    value={modalSearchTerm}
                    onChange={(e) => { setModalSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs text-app-text placeholder-app-muted focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-app-muted" />
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => { setSelectedSpecialization(e.target.value); setCurrentPage(1); }}
                    className="bg-app-surface border border-app-border text-xs font-semibold text-app-text rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
                  >
                    {specializations.map((spec, i) => (
                      <option key={i} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recruiters Grid */}
              <div className="p-6 overflow-y-auto flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedModalRecruiters.map((rec) => {
                  const activeReq = requests.find(r => r.recruiterId === rec.id && !['Withdrawn', 'Rejected', 'Cancelled', 'Expired'].includes(r.status));
                  return (
                    <div 
                      key={rec.id}
                      className="p-4 rounded-2xl bg-app-bg border border-app-border flex flex-col justify-between space-y-3 hover:border-brand-blue/30 transition-all cursor-pointer"
                      onClick={() => setSelectedRecruiterForProfile(rec)}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${rec.avatarBg} flex items-center justify-center text-white font-bold text-xs`}>
                              {rec.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-app-text">{rec.name}</h4>
                              <p className="text-[10px] text-app-muted font-semibold">{rec.role} at <span className="text-brand-blue">{rec.company}</span></p>
                            </div>
                          </div>
                        </div>

                        <span className="text-[9px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block">
                          {rec.specialization}
                        </span>

                        <div className="flex flex-wrap gap-1">
                          {rec.focus.map((f, i) => (
                            <span key={i} className="text-[8px] font-bold px-2 py-0.5 bg-app-surface border border-app-border rounded text-app-muted">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-app-border/40" onClick={(e) => e.stopPropagation()}>
                        {activeReq ? (
                          <div className="w-full py-1.5 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue rounded-lg text-[10px] font-bold text-center">
                            {activeReq.status}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleInstantRequestPick(rec)}
                            className="w-full py-1.5 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Request Representation
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Footer */}
              <div className="p-4 bg-app-bg border-t border-app-border flex items-center justify-between">
                <span className="text-xs text-app-muted font-semibold">
                  Showing {modalFilteredRecruiters.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, modalFilteredRecruiters.length)} of {modalFilteredRecruiters.length} recruiters
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-1.5 border border-app-border rounded-lg text-app-text disabled:opacity-40 cursor-pointer hover:bg-app-surface"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold px-2 text-app-text">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-1.5 border border-app-border rounded-lg text-app-text disabled:opacity-40 cursor-pointer hover:bg-app-surface"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RECRUITER PROFILE MODAL */}
      <AnimatePresence>
        {selectedRecruiterForProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-app-surface border border-app-border rounded-3xl overflow-hidden card-shadow"
            >
              <div className="p-6 bg-app-bg border-b border-app-border relative">
                <button 
                  onClick={() => setSelectedRecruiterForProfile(null)} 
                  className="absolute right-4 top-4 p-1.5 rounded-full bg-app-surface border border-app-border text-app-muted hover:text-app-text cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedRecruiterForProfile.avatarBg} flex items-center justify-center text-white font-black text-xl shrink-0`}>
                    {selectedRecruiterForProfile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-lg text-app-text">{selectedRecruiterForProfile.name}</h4>
                    <p className="text-xs text-brand-blue font-bold">
                      {selectedRecruiterForProfile.role} at <span>{selectedRecruiterForProfile.company}</span>
                    </p>
                    <p className="text-[10px] text-app-muted font-semibold mt-1">{selectedRecruiterForProfile.location} • {selectedRecruiterForProfile.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h5 className="text-[10px] font-bold text-app-muted uppercase tracking-wider mb-1">Bio</h5>
                  <p className="text-xs text-app-text leading-relaxed bg-app-bg p-3 rounded-xl border border-app-border italic">
                    "{selectedRecruiterForProfile.bio}"
                  </p>
                </div>

                <div>
                  <h5 className="text-[10px] font-bold text-app-muted uppercase tracking-wider mb-1.5">Key Sourcing Focus</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRecruiterForProfile.focus.map((f, i) => (
                      <span key={i} className="text-xs font-bold px-2.5 py-1 bg-brand-blue/10 text-brand-blue rounded-lg">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-app-bg border border-app-border rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-app-muted">Contact Email:</span>
                    <span className="text-app-text font-bold">{selectedRecruiterForProfile.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-app-muted">Experience:</span>
                    <span className="text-app-text font-bold">{selectedRecruiterForProfile.experience}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setSelectedRecruiterForProfile(null)}
                    className="w-1/2 py-2.5 bg-app-bg border border-app-border text-app-text rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleInstantRequestPick(selectedRecruiterForProfile);
                      setSelectedRecruiterForProfile(null);
                    }}
                    className="w-1/2 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-brand-blue/90"
                  >
                    Request Representation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 2: ASSIGNED RECRUITERS TRACKING TABLE */}
      <div className="p-6 rounded-3xl bg-app-surface border border-app-border card-shadow space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-app-border">
          <div>
            <h4 className="text-base font-display font-bold text-app-text">Assigned Recruiters & Statuses</h4>
            <p className="text-xs text-app-muted mt-0.5">Track and manage your recruiter representation requests and status lifecycle.</p>
          </div>
          <span className="text-xs font-mono font-bold text-brand-blue bg-brand-blue/10 px-3 py-1 rounded-full">
            Active Records: {requests.length}
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="p-8 bg-app-bg border border-app-border border-dashed rounded-2xl text-center text-app-muted text-xs font-semibold">
            No active recruiter representation records. Click "Request Representation" on any recruiter card above to start.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div 
                key={req.id} 
                className="p-4 rounded-2xl bg-app-bg border border-app-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-app-text flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-blue shrink-0" />
                    <span>Recruiter: <strong className="text-brand-blue">{req.recruiterName}</strong> ({req.company})</span>
                  </div>
                  <span className="text-[10px] text-app-muted font-mono block">Submitted: {req.date}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Real Status Badge */}
                  <div>{getStatusBadge(req.status)}</div>

                  {/* Actions */}
                  {req.status === 'Requested' || req.status === 'Pending Review' ? (
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-[10px] font-bold rounded-lg border border-red-500/20 transition-all cursor-pointer"
                    >
                      Withdraw
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
