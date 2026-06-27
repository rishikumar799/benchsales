import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  PlayCircle, 
  ExternalLink,
  Award,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface AiMatchingTabProps {
  onNavigate?: (tab: string) => void;
}

export default function AiMatchingTab({ onNavigate }: AiMatchingTabProps) {
  const skillsMatch = [
    { skill: 'React', pct: 95 },
    { skill: 'Node.js', pct: 91 },
    { skill: 'JavaScript', pct: 88 },
    { skill: 'MongoDB', pct: 87 },
    { skill: 'HTML/CSS', pct: 85 },
    { skill: 'TypeScript', pct: 80 },
    { skill: 'AWS', pct: 43 }
  ];

  const suggestedImprovements = [
    { skill: 'AWS', matchValue: '30% Match', action: 'Watch', color: 'text-amber-500 bg-amber-500/10 border-amber-500/15' },
    { skill: 'Docker', matchValue: '20% Match', action: 'Learn', color: 'text-blue-500 bg-blue-500/10 border-blue-500/15' },
    { skill: 'Redux', matchValue: '10% Match', action: 'Read', color: 'text-red-500 bg-red-500/10 border-red-500/15' },
    { skill: 'CI/CD', matchValue: '25% Match', action: 'Build', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/15' }
  ];

  const recommendedRoles = [
    { role: 'Frontend Developer', match: 95 },
    { role: 'Full Stack Developer', match: 92 },
    { role: 'React Developer', match: 91 },
    { role: 'UI Developer', match: 88 },
    { role: 'Web Developer', match: 86 }
  ];

  const courses = [
    { title: 'AWS Fundamentals', level: 'Beginner', duration: '4h' },
    { title: 'Docker Basics', level: 'Beginner', duration: '3h' },
    { title: 'CI/CD with GitHub Actions', level: 'Intermediate', duration: '5h' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Heading */}
      <div>
        <h1 className="text-3xl font-display font-bold text-app-text tracking-tight">AI Matching</h1>
        <p className="text-app-muted text-sm mt-1">Detailed index scoring analyzed by our semantic matchmaking model.</p>
      </div>

      {/* Frame 3 top banner: Score overview with growth line chart */}
      <div className="p-6 md:p-8 rounded-[32px] bg-gradient-to-r from-brand-blue via-brand-blue to-brand-violet text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-stretch gap-8">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 space-y-3 z-10 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 block">Your Overall Employability Score</span>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-display font-black tracking-tighter">91%</span>
            <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">Excellent</span>
          </div>
          <p className="text-white/80 max-w-md text-xs md:text-sm font-medium">
            You are well prepared! Keep expanding your core codebase with AWS and Docker to unlock high level opportunities.
          </p>
        </div>

        {/* Employability Score Trend Line Chart on the right */}
        <div className="w-full md:w-80 h-36 bg-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 border border-white/15 shadow-inner backdrop-blur-sm z-10">
          <svg viewBox="0 0 400 100" className="w-full h-20 text-white overflow-visible">
            {/* Smooth trend curve mapping Feb->Jun index values */}
            <path d="M 30,80 Q 110,65 190,55 T 350,20" fill="none" stroke="currentColor" strokeWidth="3" />
            
            {/* Anchor circles with tooltips */}
            <circle cx="30" cy="80" r="4" fill="#FFFFFF" />
            <text x="30" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Feb</text>

            <circle cx="110" cy="70" r="4" fill="#FFFFFF" />
            <text x="110" y="94" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Mar</text>

            <circle cx="190" cy="55" r="4" fill="#FFFFFF" />
            <text x="190" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Apr</text>

            <circle cx="270" cy="40" r="4" fill="#FFFFFF" />
            <text x="270" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">May</text>

            <circle cx="350" cy="20" r="4.5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="350" y="95" fill="#FFFFFF" fillOpacity="0.8" fontSize="8" fontWeight="bold" textAnchor="middle">Jun</text>

            {/* Values above anchors */}
            <text x="30" y="70" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">78%</text>
            <text x="110" y="60" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">82%</text>
            <text x="190" y="45" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">85%</text>
            <text x="270" y="30" fill="#FFFFFF" fillOpacity="0.6" fontSize="7" fontWeight="bold" textAnchor="middle">88%</text>
            <text x="350" y="10" fill="#00E5FF" fontSize="8" fontWeight="black" textAnchor="middle">91%</text>
          </svg>
        </div>
      </div>

      {/* Grid distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Skills Match list & Remedial Topics) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Skills Match */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-6">
            <div>
              <h3 className="text-base font-bold text-app-text">Skills Match</h3>
              <p className="text-xs text-app-muted mt-0.5">Primary stack compatibility analyzed against active job postings.</p>
            </div>
            
            <div className="space-y-4">
              {skillsMatch.map((match, id) => (
                <div key={id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-app-text">
                    <span>{match.skill}</span>
                    <span className="text-brand-blue font-mono">{match.pct}% Match</span>
                  </div>
                  <div className="h-2 w-full bg-app-bg border border-app-border/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full transition-all duration-500" 
                      style={{ width: `${match.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills You Should Improve */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <div>
              <h3 className="text-base font-bold text-app-text">Skills You Should Improve</h3>
              <p className="text-xs text-app-muted mt-0.5">Personalized AI learning recommendations will be available soon.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {suggestedImprovements.map((imp, idx) => (
                <div key={idx} className={`p-4 border rounded-2xl flex flex-col justify-between h-32 ${imp.color}`}>
                  <div>
                    <span className="text-app-text text-sm font-extrabold block">{imp.skill}</span>
                    <span className="text-[10px] font-bold block mt-1 opacity-80">{imp.matchValue}</span>
                  </div>
                  <button disabled className="w-full py-1.5 bg-slate-950/40 text-app-muted text-[10px] uppercase tracking-wider font-extrabold rounded-xl cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Recommended Roles & Learning paths) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recommended Roles */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text">Recommended Roles</h3>
            <div className="space-y-3">
              {recommendedRoles.map((role, id) => (
                <div key={id} className="p-3.5 rounded-2xl bg-app-bg hover:bg-app-surface border border-app-border flex items-center justify-between group transition-all">
                  <div>
                    <div className="text-xs font-bold text-app-text">{role.role}</div>
                    <div className="text-[10px] text-emerald-500 font-bold mt-0.5">{role.match}% Score Match</div>
                  </div>
                  <button 
                    onClick={() => onNavigate?.('jobs')}
                    className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer hover:bg-brand-blue/90"
                  >
                    View Jobs
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Learning Recommendations */}
          <div className="p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow space-y-4">
            <h3 className="text-base font-bold text-app-text flex items-center justify-between">
              AI Learning Recommendations
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2.5 py-1 rounded-lg">Coming Soon</span>
            </h3>
            <div className="space-y-3">
              {courses.map((crs, id) => (
                <div key={id} className="p-4 rounded-2xl bg-app-bg border border-app-border flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-app-text block leading-snug">{crs.title}</span>
                    <div className="flex gap-2 items-center text-[9px] font-bold text-app-muted uppercase">
                      <span>{crs.level}</span>
                      <span>•</span>
                      <span>{crs.duration}</span>
                    </div>
                  </div>
                  <button disabled className="px-3.5 py-1.5 bg-app-bg border border-app-border text-app-muted rounded-lg text-[10px] font-bold cursor-not-allowed">
                    Coming Soon
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
