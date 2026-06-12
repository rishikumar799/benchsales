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

      {/* 3. Column Layout split into Left, Middle, Right Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (AI Recommendations & Performance Chart) */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Recommendations */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text flex items-center justify-between">
              AI Recommendations
              <span className="text-xs text-brand-blue font-bold cursor-pointer hover:underline">View All</span>
            </h3>
            <div className="space-y-3">
              {aiRecommendations.map((rec, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <rec.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-app-text">{rec.text}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">{rec.impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application Activity Spline Chart */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-app-text">Application Activity <span className="text-xs text-app-muted font-normal">(Last 7 Days)</span></h3>
              <div className="w-3.5 h-3.5 rounded-full bg-brand-blue/10 flex items-center justify-center">
                <TrendingUp className="w-2.5 h-2.5 text-brand-blue" />
              </div>
            </div>
            
            {/* SVG Interactive Timeline Line Chart representing Frame 1 */}
            <div className="relative w-full h-44 bg-app-bg rounded-2xl p-4 border border-app-border overflow-hidden flex flex-col justify-between">
              <svg viewBox="0 0 1000 200" className="w-full h-32 text-brand-blue overflow-visible">
                {/* Backdrop horizontal grid lines */}
                <line x1="0" y1="50" x2="1000" y2="50" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="100" x2="1000" y2="100" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="5,5" />

                {/* Spline gradient backing */}
                <path d="M 50,150 Q 150,110 250,140 T 450,70 T 650,130 T 850,160 T 950,120 L 950,200 L 50,200 Z" fill="url(#blueChartGrad)" opacity="0.06" />
                
                {/* Linear gradient mapping definition */}
                <defs>
                  <linearGradient id="blueChartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1E40AF" />
                    <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Main line path */}
                <path d={splinePath} fill="none" stroke="currentColor" strokeWidth="4" />
                
                {/* Dot markers at key points corresponding to screenshot data */}
                <circle cx="50" cy="150" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="200" cy="120" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="350" cy="130" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="500" cy="80" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="650" cy="140" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="800" cy="155" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="950" cy="120" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
              </svg>
              <div className="flex justify-between px-2 text-[10px] font-bold text-app-muted font-mono uppercase tracking-wider">
                {chartPoints.map((pt, idx) => (
                  <span key={idx} className="w-10 text-center">{pt.day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column (Recommended Jobs & Recent Applications) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recommended Jobs */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text flex items-center justify-between">
              Recommended Jobs
              <span className="text-xs text-brand-blue font-bold cursor-pointer hover:underline" onClick={() => onNavigate('jobs')}>View All</span>
            </h3>
            <div className="space-y-3">
              {recommendedJobs.map((jb, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${jb.logoBg} flex items-center justify-center text-white font-bold font-display text-sm shadow-sm`}>
                      {jb.logo}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-app-text">{jb.role}</div>
                      <div className="text-[10px] text-app-muted font-semibold mt-0.5">{jb.company}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('jobs')}
                    className="px-3.5 py-1.5 bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white rounded-lg text-[10px] font-bold transition-all"
                  >
                    Apply
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text flex items-center justify-between">
              Recent Applications
              <span className="text-xs text-brand-blue font-bold cursor-pointer hover:underline" onClick={() => onNavigate('applications')}>View All</span>
            </h3>
            <div className="space-y-3">
              {recentApps.map((ap, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between transition-colors">
                  <div>
                    <div className="text-xs font-bold text-app-text">{ap.role}</div>
                    <div className="text-[10px] text-app-muted font-semibold mt-0.5">{ap.company} • {ap.time}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-lg">
                    {ap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Profile Strength Gauges) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow text-center flex flex-col items-center">
            <h3 className="text-base font-bold text-app-text mb-4 w-full text-left">Profile Strength</h3>
            
            {/* Visual Gauge Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-app-border" />
                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="402" strokeDashoffset="72" className="text-brand-blue" strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-extrabold text-app-text">82%</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">Good Progress</span>
              </div>
            </div>

            <div className="w-full text-left mt-6 space-y-3">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider block">Complete the below to improve</span>
              
              <div className="space-y-2">
                {[
                  { text: 'Add Portfolio', complete: true },
                  { text: 'Add Certifications', complete: true },
                  { text: 'Add LinkedIn', complete: true },
                  { text: 'Complete Github Sync', complete: false }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <CheckCircle2 className={`w-4.5 h-4.5 ${item.complete ? 'text-brand-blue' : 'text-app-muted/40'}`} />
                    <span className={`text-xs font-semibold ${item.complete ? 'text-app-text' : 'text-app-muted'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
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
