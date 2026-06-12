import { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckSquare, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Zap,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronRight,
  HelpCircle,
  Plus
} from 'lucide-react';
import BdmProfilePopup from '../components/BdmProfilePopup';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onRequestMore: () => void;
  onPreviewCandidate: (candidateId: string) => void;
  onSelectCandidate: (candidateId: string) => void;
  selectedCount: number;
}

export default function DashboardTab({ 
  onNavigate, 
  onRequestMore, 
  onPreviewCandidate, 
  onSelectCandidate,
  selectedCount 
}: DashboardTabProps) {
  
  const [selectedBdmName, setSelectedBdmName] = useState<string | null>(null);

  // Simulated candidate list matching image #1
  const candidatePoolSample = [
    { id: 'c1', name: 'Ravi Kumar', exp: '4 Years Experience', skills: ['React', 'Node.js', 'MongoDB'] },
    { id: 'c2', name: 'Priya Sharma', exp: '3 Years Experience', skills: ['Java', 'Spring Boot', 'MySQL'] },
    { id: 'c3', name: 'Akash Reddy', exp: '5 Years Experience', skills: ['AWS', 'DevOps', 'Docker'] },
    { id: 'c4', name: 'Sneha Iyer', exp: '2 Years Experience', skills: ['Python', 'Django', 'PostgreSQL'] },
  ];

  // Simulated open requirements matching image #1
  const requirementsSample = [
    { id: 'j1', role: 'Frontend Developer', company: 'ABC Tech Pvt Ltd', exp: '3-6 Years', skills: 'React, Next.js', bdm: 'John Mathew' },
    { id: 'j2', role: 'Java Developer', company: 'Infoswift Solutions', exp: '4-6 Years', skills: 'Java, Spring Boot', bdm: 'John Mathew' },
    { id: 'j3', role: 'QA Engineer', company: 'X Corp', exp: '2-4 Years', skills: 'Manual, Automation', bdm: 'Arjun Patil' },
  ];

  // Activities list matching image #1
  const activities = [
    { id: 1, type: 'submit', title: 'Profile Submitted', desc: 'Ravi Kumar submitted for Frontend Developer', time: '2 hours ago' },
    { id: 2, type: 'select', title: 'Candidate Selected', desc: 'You selected Priya Sharma from your pool', time: '5 hours ago' },
    { id: 3, type: 'approve', title: 'Job Access Approved', desc: 'BDM John Mathew approved your access for Java Developer', time: '1 day ago' },
    { id: 4, type: 'status', title: 'Status Updated', desc: 'Akash Reddy status updated to Shortlisted', time: '2 days ago' },
  ];

  // Submissions sample list matching image #1
  const submissionsSample = [
    { name: 'Ravi Kumar', job: 'Frontend Developer', date: '10 Jun 2026', status: 'Submitted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Akash Reddy', job: 'DevOps Engineer', date: '09 Jun 2026', status: 'Shortlisted', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
    { name: 'Sneha Iyer', job: 'Backend Developer', date: '09 Jun 2026', status: 'In Progress', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { name: 'Priya Sharma', job: 'Java Developer', date: '09 Jun 2026', status: 'Submitted', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { name: 'Karthik Nair', job: 'QA Engineer', date: '06 Jun 2026', status: 'Rejected', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header with Recruiter Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Dashboard</h1>
          <p className="text-app-muted mt-1">Welcome back, Rohit! Here's your recruitment overview.</p>
        </div>
      </div>

      {/* 2. Hero Interactive Banner */}
      <div className="p-6 md:p-8 rounded-[32px] premium-gradient text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Marketplace Engine Active
          </span>
          <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-2">Recruitment Workspace Active</h2>
          <p className="text-white/80 text-sm leading-relaxed">
            Browse open requirements, select the best candidates from your pool and submit profiles to move forward.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('jobs')} 
          className="relative z-10 px-6 py-3.5 bg-white text-brand-blue font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl shrink-0"
        >
          Browse Jobs <ArrowRight className="w-4 h-4 text-brand-blue" />
        </button>
        {/* Subtle background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-violet/20 blur-3xl rounded-full" />
      </div>

      {/* 3. Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Briefcase, label: 'Available Jobs', count: '24', desc: 'Open requirements', target: 'jobs' },
          { icon: Users, label: 'Candidate Pool', count: '30', desc: 'Allocated by BDM', target: 'candidates' },
          { icon: CheckSquare, label: 'Selected Candidates', count: selectedCount.toString(), desc: 'From your pool', target: 'selections' },
          { icon: FileText, label: 'Submitted Profiles', count: '42', desc: 'Across all jobs', target: 'submissions' }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(item.target)}
            className="p-6 rounded-[28px] glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group relative card-shadow cursor-pointer flex flex-col justify-between"
          >
            <div className="flex justify-between items-start w-full">
              <div className="p-3 bg-brand-blue/10 rounded-xl group-hover:bg-brand-blue/20 transition-all text-brand-blue">
                <item.icon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-brand-blue transition-all" />
            </div>
            <div className="mt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-app-muted">{item.label}</span>
              <div className="text-3xl font-display font-extrabold text-app-text mt-1">{item.count}</div>
              <div className="text-[11px] font-semibold text-app-muted mt-1">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Three-Column Middle View (Open Requirements, My Candidate Pool, Selection Overview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Column A: Open Requirements (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Open Requirements</h3>
              <button onClick={() => onNavigate('jobs')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All Jobs
              </button>
            </div>
            <div className="space-y-4">
              {requirementsSample.map((req) => (
                <div key={req.id} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-app-text">{req.role}</h4>
                      <p className="text-xs font-bold text-app-muted mt-0.5">{req.company} • {req.exp}</p>
                    </div>
                    <span 
                      onClick={() => setSelectedBdmName(req.bdm)}
                      title={`Click to view BDM ${req.bdm} profile`} 
                      className="text-[9px] font-extrabold uppercase bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white px-2 py-0.5 rounded cursor-pointer transition-all"
                    >
                      BDM: {req.bdm.split(' ')[0]}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {req.skills.split(', ').map((sk, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-mono font-semibold bg-app-bg px-2 py-0.5 rounded-md border border-app-border text-app-muted">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('jobs')} 
            className="w-full text-center py-3 border border-dashed border-app-border text-xs font-bold text-app-muted hover:text-brand-blue hover:border-brand-blue/30 rounded-2xl mt-6 transition-all"
          >
            Explore 21 more open roles
          </button>
        </div>

        {/* Column B: My Candidate Pool (Span 5) */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">My Candidate Pool (30)</h3>
              <button onClick={() => onNavigate('candidates')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {candidatePoolSample.map((cand) => (
                <div key={cand.id} className="p-4 rounded-2xl bg-app-surface/60 border border-app-border flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-extrabold font-mono">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-app-text hover:text-brand-blue cursor-pointer" onClick={() => onPreviewCandidate(cand.id)}>
                        {cand.name}
                      </h4>
                      <p className="text-[11px] font-semibold text-app-muted mt-0.5">{cand.exp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onPreviewCandidate(cand.id)} 
                      className="text-[10px] font-bold text-brand-violet hover:underline px-2 py-1 bg-brand-violet/5 rounded"
                    >
                      Preview
                    </button>
                    <button 
                      onClick={() => onSelectCandidate(cand.id)} 
                      className="px-3 py-1.5 bg-brand-blue text-white rounded-lg text-[10px] font-bold shadow-sm"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('candidates')}
            className="w-full text-center py-3 bg-app-bg hover:bg-app-surface text-xs font-bold text-brand-blue rounded-2xl mt-6 transition-all border border-app-border"
          >
            View Full Candidate Pool
          </button>
        </div>

        {/* Column C: Selection Overview Donut (Span 3) */}
        <div className="lg:col-span-3 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-6">Selection Overview</h3>
            <div className="flex flex-col items-center justify-center py-4">
              {/* Custom SVG Donut Chart Matching the original mockup exactly */}
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="var(--color-app-surface, rgba(120,120,120,0.1))" strokeWidth="8" />
                  
                  {/* Segment: Submitted (9 / 18 -> 50%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="119.3" />
                  
                  {/* Segment: In Progress (6 / 18 -> 33%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="198.1" />

                  {/* Segment: Shortlisted (2 / 18 -> 11%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="224.3" />

                  {/* Segment: Rejected (1 / 18 -> 5.5%) */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="237.5" />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-display font-extrabold text-app-text">{selectedCount}</span>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Selected</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="w-full grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-app-muted truncate">Submitted</span>
                  <span className="font-bold text-app-text ml-auto">9</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-app-muted truncate">In Progress</span>
                  <span className="font-bold text-app-text ml-auto">6</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-app-muted truncate">Shortlisted</span>
                  <span className="font-bold text-app-text ml-auto">2</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-app-muted truncate">Rejected</span>
                  <span className="font-bold text-app-text ml-auto">1</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('selections')}
            className="w-full text-center py-3 bg-brand-blue/5 hover:bg-brand-blue/10 text-xs font-bold text-brand-blue rounded-2xl mt-4 transition-all"
          >
            View My Selections →
          </button>
        </div>

      </div>

      {/* 5. Bottom Rows: Recent Activity, Recent Submissions & Need More Candidates Side Promo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Row A: Recent Activity (Span 4) */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-6">Recent Activity</h3>
            <div className="relative border-l border-app-border pl-6 ml-3 space-y-6">
              {activities.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-blue ring-4 ring-app-bg group-hover:scale-125 transition-transform" />
                  <div>
                    <span className="text-[10px] font-mono text-app-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.time}
                    </span>
                    <h4 className="font-bold text-sm text-app-text mt-1">{act.title}</h4>
                    <p className="text-xs text-app-muted mt-0.5 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => onNavigate('submissions')}
            className="w-full text-center py-3 border border-app-border hover:bg-app-surface text-xs font-bold text-app-text rounded-2xl mt-6 transition-all"
          >
            View All Activity
          </button>
        </div>

        {/* Row B: Recent Submissions (Span 5) */}
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-bold text-lg text-app-text">Recent Submissions</h3>
            <button onClick={() => onNavigate('submissions')} className="text-xs font-semibold text-brand-blue hover:underline">
              View All Submissions
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                  <th className="py-3 px-2">Candidate</th>
                  <th className="py-3 px-2">Job</th>
                  <th className="py-3 px-2 hidden sm:table-cell">Selected On</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border/40 text-sm">
                {submissionsSample.map((sub, sIdx) => (
                  <tr key={sIdx} className="hover:bg-app-surface/30 transition-colors">
                    <td className="py-3 px-2 font-bold text-app-text">{sub.name}</td>
                    <td className="py-3 px-2 text-xs text-app-muted">{sub.job}</td>
                    <td className="py-3 px-2 text-xs text-app-muted hidden sm:table-cell">{sub.date}</td>
                    <td className="py-3 px-2 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${sub.color}`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row C: BDM Callout Promo Card (Span 3) */}
        <div className="lg:col-span-3 p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 border border-brand-violet/20 card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-brand-violet/10">
              <Sparkles className="w-6 h-6 text-brand-violet" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-app-text">Need more candidates?</h4>
              <p className="text-xs text-app-muted mt-2 leading-relaxed">
                Request an additional candidate pool from your Business Development Manager (BDM) to fulfill your criteria.
              </p>
            </div>
          </div>
          <button 
            onClick={onRequestMore}
            className="w-full mt-6 py-3.5 bg-brand-violet text-white text-xs font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-violet/20 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Request Now
          </button>
        </div>

      </div>

      <BdmProfilePopup 
        bdmNameOrId={selectedBdmName} 
        onClose={() => setSelectedBdmName(null)} 
      />

    </div>
  );
}