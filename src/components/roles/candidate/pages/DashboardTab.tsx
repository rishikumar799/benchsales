import React from 'react';
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
import RecruiterHandshakeGateway from '../components/RecruiterHandshakeGateway';

interface DashboardTabProps {
  onNavigate: (tabId: string) => void;
}

export default function DashboardTab({ onNavigate }: DashboardTabProps) {
  const stats = [
    { label: 'Applications Today', value: '12', trend: '+33% vs yesterday', trendColor: 'text-emerald-500 bg-emerald-500/10', color: 'text-amber-500' },
    { label: 'Total Applications', value: '245', trend: '+18% this week', trendColor: 'text-blue-500 bg-blue-500/10', color: 'text-blue-500' },
    { label: 'Resume Score', value: '91%', trend: 'Excellent', trendColor: 'text-emerald-500 bg-emerald-500/10', color: 'text-emerald-500' },
    { label: 'Job Matches', value: '156', trend: '+24 new matches', trendColor: 'text-violet-500 bg-violet-500/10', color: 'text-violet-500' }
  ];

  const aiRecommendations = [
    { text: 'Add React Projects', impact: '+8% impact', icon: CodeIcon },
    { text: 'Add Github Portfolio', impact: '+4% impact', icon: Github },
    { text: 'Add AWS Skill', impact: '+6% impact', icon: CloudIcon },
    { text: 'Improve Resume Keywords', impact: '+7% impact', icon: FileText }
  ];

  const recommendedJobs = [
    { role: 'Frontend Developer', company: 'Google', logo: 'G', logoBg: 'bg-red-500' },
    { role: 'Full Stack Developer', company: 'Microsoft', logo: 'M', logoBg: 'bg-blue-600' },
    { role: 'React Developer', company: 'Amazon', logo: 'A', logoBg: 'bg-orange-500' },
    { role: 'Software Engineer', company: 'Swiggy', logo: 'S', logoBg: 'bg-amber-600' }
  ];

  const recentApps = [
    { role: 'Frontend Developer', company: 'Google', time: '2h ago', status: 'Applied' },
    { role: 'UI/UX Designer', company: 'Figma', time: '5h ago', status: 'Applied' },
    { role: 'Backend Developer', company: 'Flipkart', time: '1d ago', status: 'Applied' },
    { role: 'React Developer', company: 'Swiggy', time: '1d ago', status: 'Applied' }
  ];

  const chartPoints = [
    { day: 'Mon', count: 4, y: 150 },
    { day: 'Tue', count: 8, y: 110 },
    { day: 'Wed', count: 5, y: 140 },
    { day: 'Thu', count: 12, y: 70 },
    { day: 'Fri', count: 6, y: 130 },
    { day: 'Sat', count: 3, y: 160 },
    { day: 'Sun', count: 7, y: 120 }
  ];

  // Creates the smooth cubic spline path
  const splinePath = "M 50,150 Q 150,110 250,140 T 450,70 T 650,130 T 850,160 T 950,120";

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
              className="px-5 py-2.5 bg-white text-brand-blue font-bold rounded-2xl text-xs hover:bg-neutral-100 transition-all shadow-md active:scale-95"
            >
              Explore Jobs
            </button>
            <button 
              onClick={() => onNavigate('resume_builder')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl text-xs border border-white/20 transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" /> Improve Resume
            </button>
          </div>
        </div>

        {/* Cute Mascot Artwork matching the style of generated svg */}
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
