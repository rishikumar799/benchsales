import { motion } from 'motion/react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Search, 
  Layers,
  BookOpen,
  Award,
  Zap,
  Check
} from 'lucide-react';

interface AIMatchingTabProps {
  onNavigate: (tabId: string) => void;
}

export default function AIMatchingTab({ onNavigate }: AIMatchingTabProps) {
  const skillsOverview = [
    { name: 'Java', value: 92 },
    { name: 'Data Structures', value: 90 },
    { name: 'ReactJS', value: 88 },
    { name: 'Problem Solving', value: 90 },
    { name: 'Communication', value: 89 },
    { name: 'SQL', value: 85 },
  ];

  const matchedOpp = [
    { title: 'Software Engineer', company: 'TCS', location: 'Hyderabad', match: '94%', package: '4.5 LPA' },
    { title: 'System Engineer', company: 'Infosys', location: 'Bangalore', match: '91%', package: '4.0 LPA' },
    { title: 'Project Engineer', company: 'Wipro', location: 'Chennai', match: '88%', package: '3.6 LPA' },
  ];

  const suggestions = [
    { title: 'Add more projects', desc: 'Showcase your work', impact: 'High Impact', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { title: 'Learn Cloud (AWS)', desc: 'Most in-demand skill', impact: 'High Impact', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { title: 'Add Certifications', desc: 'Increase credibility', impact: 'Medium Impact', bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { title: 'Improve Resume', desc: 'Optimize for ATS', impact: 'High Impact', bg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-display font-bold text-app-text">AI Matching</h2>
        <p className="text-app-muted">AI-powered matching to help you find the right opportunities.</p>
      </div>

      {/* Top Overall Match Panel */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left Circular matching gauge */}
        <div className="flex flex-col items-center text-center p-4">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-app-border" />
              <circle cx="72" cy="72" r="62" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="390" strokeDashoffset="35" className="text-emerald-500" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-display font-extrabold text-app-text">91%</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">EXCELLENT MATCH</span>
            </div>
          </div>
          <span className="text-xs font-bold text-app-muted uppercase tracking-widest mt-3">Overall Match Score</span>
        </div>

        {/* Right Details Checklist Card */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-display font-bold text-app-text">Great! You are a strong match for most opportunities.</h3>
          
          <div className="space-y-2.5">
            {[
              'Your skills match well with campus job requirements',
              'Your academic profile looks impressive and compliant',
              'Keep applying and active to maximize offers next month'
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-app-text">
                <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 text-emerald-500 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('profile')} 
            className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 mt-4"
          >
            Improve My Profile <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Skills Match Overview & Top Matched Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Skills Match Overview */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg text-app-text mb-5">Skills Match Overview</h4>
            
            <div className="space-y-4">
              {skillsOverview.map((sk) => (
                <div key={sk.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-app-text">{sk.name}</span>
                    <span className="text-app-muted">{sk.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-app-surface border border-app-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-blue rounded-full" 
                      style={{ width: `${sk.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('profile')}
            className="w-full text-center mt-6 text-xs font-bold text-brand-blue hover:underline py-3 bg-brand-blue/5 border border-brand-blue/10 rounded-xl"
          >
            View Full Skills Analysis →
          </button>
        </div>

        {/* Top Matched Opportunities */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-lg text-app-text mb-5">Top Matched Opportunities</h4>
            
            <div className="space-y-3.5">
              {matchedOpp.map((mo, i) => (
                <div key={i} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center font-display font-bold text-xs">
                      {mo.company}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-app-text">{mo.title}</div>
                      <div className="text-xs text-app-muted font-medium">{mo.company} • {mo.package} • {mo.location}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    {mo.match} Match
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate('opportunities')}
            className="w-full text-center mt-6 text-xs font-bold text-brand-blue hover:underline py-3 bg-brand-blue/5 border border-brand-blue/10 rounded-xl"
          >
            View All Opportunities →
          </button>
        </div>
      </div>

      {/* AI Suggestions section */}
      <div className="p-6 rounded-[32px] glass border-app-border card-shadow">
        <h4 className="font-display font-bold text-lg text-app-text mb-4">AI Suggestions to Improve</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestions.map((sug, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-app-surface/60 border border-app-border flex flex-col justify-between hover:border-brand-blue/20 transition-all cursor-pointer"
              onClick={() => {
                if (sug.title.includes('Resume')) onNavigate('resume_builder');
                else onNavigate('profile');
              }}
            >
              <div className="space-y-1">
                <h5 className="font-bold text-sm text-app-text">{sug.title}</h5>
                <p className="text-xs text-app-muted leading-snug font-medium mb-3">{sug.desc}</p>
              </div>
              <span className={`self-start text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${sug.bg}`}>
                {sug.impact}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
