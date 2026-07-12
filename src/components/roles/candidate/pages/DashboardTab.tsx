import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Zap, 
  FileText, 
  Github, 
  Linkedin, 
  Award,
  Link as LinkIcon,
  ChevronRight
} from 'lucide-react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useAuth } from '../../../../context/AuthContext';
import RecruiterHandshakeGateway from '../components/RecruiterHandshakeGateway';

interface DashboardTabProps {
  onNavigate: (tabId: string) => void;
}

// Helpers for visual aesthetics
const getLogoBg = (company: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-600', 'bg-orange-500', 'bg-amber-600', 
    'bg-emerald-600', 'bg-violet-600', 'bg-indigo-600', 'bg-pink-600'
  ];
  let hash = 0;
  for (let i = 0; i < company.length; i++) {
    hash = company.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getRelativeTime = (ts: any) => {
  if (!ts) return '1 day ago';
  let date: Date;
  if (typeof ts.toDate === 'function') {
    date = ts.toDate();
  } else if (ts.seconds) {
    date = new Date(ts.seconds * 1000);
  } else {
    date = new Date(ts);
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours <= 0) return 'Just now';
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

export default function DashboardTab({ onNavigate }: DashboardTabProps) {
  const { user, userProfile } = useAuth();
  const uid = user?.uid || userProfile?.uid;

  const [loading, setLoading] = useState(true);
  const [candidateData, setCandidateData] = useState<any>(null);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    // Subscribe to candidate profile
    const candidateDocRef = doc(db, 'marketplace_jobseekers', uid);
    const unsubscribeCandidate = onSnapshot(candidateDocRef, (snap) => {
      if (snap.exists()) {
        setCandidateData(snap.data());
      }
    });

    // Subscribe to applications
    const qApps = query(
      collection(db, 'marketplace_applications'),
      where('candidateUid', '==', uid)
    );
    const unsubscribeApps = onSnapshot(qApps, (snap) => {
      const fetched = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setMyApplications(fetched);
    });

    // Subscribe to open jobs
    const qJobs = query(
      collection(db, 'marketplace_jobs'),
      where('status', '==', 'open')
    );
    const unsubscribeJobs = onSnapshot(qJobs, (snap) => {
      const fetched = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setJobs(fetched);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });

    return () => {
      unsubscribeCandidate();
      unsubscribeApps();
      unsubscribeJobs();
    };
  }, [uid]);

  // Compute live statistics
  const totalApps = myApplications.length;
  
  const appsToday = myApplications.filter(app => {
    if (!app.appliedAt) return false;
    let appDate: Date;
    if (typeof app.appliedAt.toDate === 'function') {
      appDate = app.appliedAt.toDate();
    } else {
      appDate = new Date(app.appliedAt);
    }
    return appDate.toDateString() === new Date().toDateString();
  }).length;

  const rawResumeScore = candidateData?.ai_profile?.resumeScore || candidateData?.ai_profile?.profileScore || 85;
  const resumeScore = `${rawResumeScore}%`;

  const jobMatchesCount = jobs.length > 0 ? jobs.length : 12;

  const stats = [
    { label: 'Applications Today', value: String(appsToday), trend: appsToday > 0 ? `+${appsToday} today` : 'No new application', trendColor: 'text-emerald-500 bg-emerald-500/10', color: 'text-amber-500' },
    { label: 'Total Applications', value: String(totalApps), trend: 'All-time submissions', trendColor: 'text-blue-500 bg-blue-500/10', color: 'text-blue-500' },
    { label: 'Resume Score', value: resumeScore, trend: rawResumeScore >= 90 ? 'Outstanding' : 'Needs tuning', trendColor: 'text-emerald-500 bg-emerald-500/10', color: 'text-emerald-500' },
    { label: 'Job Matches', value: String(jobMatchesCount), trend: 'Active openings matching profile', trendColor: 'text-violet-500 bg-violet-500/10', color: 'text-violet-500' }
  ];

  // AI recommendations pulled from profile metrics
  const rawRecommendations = candidateData?.ai_profile?.recommendations || [];
  const aiRecommendations = rawRecommendations.length > 0 
    ? rawRecommendations.map((rec: string, index: number) => ({
        text: rec,
        impact: `+${8 - (index % 3)}% impact`,
        icon: FileText
      }))
    : [
        { text: 'Add React Projects', impact: '+8% impact', icon: CodeIcon },
        { text: 'Add Github Portfolio', impact: '+4% impact', icon: Github },
        { text: 'Add AWS Skill', impact: '+6% impact', icon: CloudIcon },
        { text: 'Improve Resume Keywords', impact: '+7% impact', icon: FileText }
      ];

  // Dynamic open jobs
  const recommendedJobs = jobs.slice(0, 4).map(j => ({
    role: j.role || j.title || 'Developer',
    company: j.company || 'Tech Company',
    logo: (j.company || j.companyName || 'T').charAt(0).toUpperCase(),
    logoBg: getLogoBg(j.company || 'Tech Company')
  }));

  // Dynamic recent submissions
  const recentApps = myApplications.slice(0, 4).map(app => ({
    role: app.jobTitle || 'Developer',
    company: app.companyName || 'Tech Company',
    time: app.appliedAt ? getRelativeTime(app.appliedAt) : 'Just now',
    status: 'Applied'
  }));

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-app-muted font-mono">Synchronizing your dashboard analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-brand-blue to-brand-violet text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 z-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold">AI Career Copilot Active</h2>
          <p className="text-white/80 max-w-xl text-xs md:text-sm">
            Your AI copilot is analyzing the best opportunities and helping you grow your career.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => onNavigate('jobs')}
              className="px-5 py-2.5 bg-white text-brand-blue font-bold rounded-2xl text-xs hover:bg-neutral-100 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Explore Jobs
            </button>
            <button 
              onClick={() => onNavigate('resume_builder')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Improve Resume
            </button>
          </div>
        </div>

        {/* Mascot Artwork */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-2xl flex items-center justify-center p-2 backdrop-blur-md border border-white/15 shadow-inner">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            <rect x="35" y="45" width="130" height="110" rx="40" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            <rect x="45" y="55" width="110" height="85" rx="30" fill="#0B132B" />
            <rect x="65" y="85" width="22" height="14" rx="7" fill="#00E5FF" />
            <rect x="113" y="85" width="22" height="14" rx="7" fill="#00E5FF" />
            <path d="M 55,62 C 85,55 115,55 145,62" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="95" y="25" width="10" height="20" fill="#CBD5E1" />
            <circle cx="100" cy="20" r="8" fill="#1D4ED8" />
            <circle cx="100" cy="20" r="3" fill="#FFFFFF" />
            <path d="M 90,115 C 95,123 105,123 110,115" stroke="#00E5FF" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((st, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between"
          >
            <span className="text-xs font-bold text-app-muted uppercase tracking-wider">{st.label}</span>
            <div className="flex items-baseline justify-between mt-4">
              <span className="text-3xl font-display font-extrabold text-app-text">{st.value}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${st.trendColor}`}>{st.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recruiter Handshake & Pick Gateway */}
      <RecruiterHandshakeGateway />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Grid: AI Recommendations */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">AI Action Items</span>
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-violet/10 flex items-center justify-center text-brand-violet">
                    <rec.icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-app-text">{rec.text}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">{rec.impact}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Grid: Recent Activity / Submissions */}
        <div className="lg:col-span-6 space-y-4">
          <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest block pl-1">Recent Applications</span>
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            {recentApps.length === 0 ? (
              <div className="py-8 text-center text-app-muted">
                <Briefcase className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider">No submissions yet</p>
                <button 
                  onClick={() => onNavigate('jobs')}
                  className="text-xs text-brand-blue font-bold hover:underline mt-2 cursor-pointer"
                >
                  Apply to jobs now
                </button>
              </div>
            ) : (
              recentApps.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-app-bg border border-app-border rounded-xl">
                  <div>
                    <span className="text-xs font-black text-app-text block">{app.role}</span>
                    <span className="text-[9px] font-bold text-app-muted block uppercase mt-0.5">{app.company} • {app.time}</span>
                  </div>
                  <span className="text-[10px] font-black px-2 py-1 rounded bg-brand-blue/10 text-brand-blue uppercase">{app.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple custom inline SVG helper icons to replace missing local packages or custom assets
function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props.className} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={props.className} {...props}>
      <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42-1.89-1.74-3.5-3.5-3.5A5.5 5.5 0 0 0 7 13c-2.2 0-4 1.8-4 4s1.8 4 4 4h10.5" />
    </svg>
  );
}
