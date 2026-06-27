import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  CheckSquare, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import BdmProfilePopup from '../components/BdmProfilePopup';
import { recruiterStorage } from '../utils/recruiterStorage';

interface DashboardTabProps {
  onNavigate: (tab: string) => void;
  onRequestMore?: () => void;
  onPreviewCandidate: (candidateId: string) => void;
  onSelectCandidate: (candidateId: string) => void;
  selectedCount: number;
}

export default function DashboardTab({ 
  onNavigate, 
  onPreviewCandidate, 
  onSelectCandidate,
  selectedCount 
}: DashboardTabProps) {
  
  const [selectedBdmName, setSelectedBdmName] = useState<string | null>(null);
  const [stats, setStats] = useState(recruiterStorage.getDashboardStats());
  const [submissions, setSubmissions] = useState(recruiterStorage.getSubmissions());
  const [selections, setSelections] = useState(recruiterStorage.getSelections());

  // Reload stats whenever component mounts or updates
  useEffect(() => {
    const loadData = () => {
      setStats(recruiterStorage.getDashboardStats());
      setSubmissions(recruiterStorage.getSubmissions());
      setSelections(recruiterStorage.getSelections());
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, [selectedCount]);

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

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header with Recruiter Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Dashboard</h1>
          <p className="text-app-muted mt-1">Welcome back, Rohit! Here's your recruitment overview.</p>
        </div>
      </div>

      {/* 2. Top Grid: Hero Interactive Banner + Selection Overview Donut (Top-Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Hero Interactive Banner (Span 8) */}
        <div className="lg:col-span-8 p-6 md:p-8 rounded-[32px] premium-gradient text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Marketplace Engine Active
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mt-3 mb-2">Recruitment Workspace Active</h2>
            <p className="text-white/80 text-sm leading-relaxed max-w-xl">
              Browse open requirements, select the best candidates from your pool, allocate to your accessible jobs and submit profiles seamlessly.
            </p>
          </div>
          <div className="relative z-10 mt-6 flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('jobs')} 
              className="px-6 py-3.5 bg-white text-brand-blue font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl"
            >
              Browse Jobs <ArrowRight className="w-4 h-4 text-brand-blue" />
            </button>
            <button 
              onClick={() => onNavigate('candidates')} 
              className="px-6 py-3.5 bg-brand-violet text-white font-bold rounded-2xl flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all text-sm shadow-xl border border-brand-violet/20"
            >
              View Candidates Pool
            </button>
          </div>
          {/* Subtle background glow */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-violet/20 blur-3xl rounded-full" />
        </div>

        {/* Selection Overview Donut (Span 4) - Moved to top-right area of the dashboard as a primary summary card */}
        <div className="lg:col-span-4 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-app-text mb-2">Selection Overview</h3>
            <p className="text-xs text-app-muted mb-4">Real-time breakdown of queued selections</p>
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="rgba(120, 120, 120, 0.1)" strokeWidth="8" />
                  
                  {/* Segment: Submitted */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3b82f6" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="119.3" />
                  
                  {/* Segment: In Progress */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="198.1" />

                  {/* Segment: Shortlisted */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="224.3" />

                  {/* Segment: Rejected */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="8" strokeDasharray="238.7" strokeDashoffset="237.5" />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-display font-extrabold text-app-text">{stats.selections}</span>
                  <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">Queue Size</span>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Submitted</span>
                  <span className="font-bold text-app-text ml-auto">{submissions.filter(s => s.status === 'Submitted').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">In Review</span>
                  <span className="font-bold text-app-text ml-auto">{submissions.filter(s => s.status === 'In Review').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Shortlisted</span>
                  <span className="font-bold text-app-text ml-auto">{submissions.filter(s => s.status === 'Shortlisted').length}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                  <span className="text-app-muted text-[11px] truncate">Rejected</span>
                  <span className="font-bold text-app-text ml-auto">{submissions.filter(s => s.status === 'Rejected').length}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('selections')}
            className="w-full text-center py-2.5 bg-brand-blue/5 hover:bg-brand-blue/10 text-xs font-bold text-brand-blue rounded-xl mt-3 transition-all border border-brand-blue/10"
          >
            Open Selections Queue →
          </button>
        </div>

      </div>

      {/* 3. Updated Main Metrics Grid (6 columns to represent the 6 key statistics exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { icon: Briefcase, label: 'Open Jobs', count: stats.openJobs.toString(), desc: 'Accessible immediately', color: 'text-blue-500', target: 'jobs' },
          { icon: Briefcase, label: 'Assigned Jobs', count: stats.assignedJobs.toString(), desc: 'Requires access code', color: 'text-amber-500', target: 'jobs' },
          { icon: Users, label: 'Available Candidates', count: stats.availableCandidates.toString(), desc: 'Live candidate pool', color: 'text-indigo-500', target: 'candidates' },
          { icon: FileText, label: 'Submitted Candidates', count: stats.submittedCandidates.toString(), desc: 'Profiles with BDM', color: 'text-emerald-500', target: 'submissions' },
          { icon: CheckSquare, label: 'Selections', count: stats.selections.toString(), desc: 'Awaiting submission', color: 'text-pink-500', target: 'selections' },
          { icon: Percent, label: 'Success Rate', count: stats.successRate, desc: 'Interview selection', color: 'text-violet-500', target: 'submissions' }
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(item.target)}
            className="p-5 rounded-2xl glass border border-app-border text-left hover:border-brand-blue/30 hover:scale-[1.01] transition-all group relative card-shadow cursor-pointer flex flex-col justify-between"
          >
            <div className="flex justify-between items-start w-full">
              <div className={`p-2 bg-app-surface border border-app-border rounded-lg group-hover:bg-brand-blue/5 transition-all ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-app-muted group-hover:text-brand-blue transition-all" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-app-muted block">{item.label}</span>
              <div className="text-2xl font-display font-extrabold text-app-text mt-1">{item.count}</div>
              <p className="text-[9px] font-semibold text-app-muted/80 mt-1 leading-snug">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Middle Rows: Open Requirements (4 cols) & My Candidate Pool (8 cols) */}
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
            Explore all open roles
          </button>
        </div>

        {/* Column B: My Candidate Pool (Span 8) */}
        <div className="lg:col-span-8 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">My Candidate Pool (30)</h3>
              <button onClick={() => onNavigate('candidates')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All Pool Candidates
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onClick={() => onNavigate('candidates')} 
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

      </div>

      {/* 5. Bottom Rows: Recent Activity, Recent Submissions & Available Candidate Pool Promo Card */}
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
        <div className="lg:col-span-5 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-lg text-app-text">Recent Submissions</h3>
              <button onClick={() => onNavigate('submissions')} className="text-xs font-semibold text-brand-blue hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-app-border text-xs font-extrabold text-app-muted uppercase tracking-wider">
                    <th className="py-3 px-2">Candidate</th>
                    <th className="py-3 px-2">Job</th>
                    <th className="py-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-app-border/40 text-sm">
                  {submissions.slice(0, 4).map((sub, sIdx) => {
                    let color = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                    if (sub.status === 'Shortlisted') color = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                    if (sub.status === 'In Review') color = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                    if (sub.status === 'Rejected') color = 'bg-red-500/10 text-red-500 border-red-500/20';

                    return (
                      <tr key={sIdx} className="hover:bg-app-surface/30 transition-colors">
                        <td className="py-3 px-2 font-bold text-app-text">{sub.candidateName}</td>
                        <td className="py-3 px-2 text-xs text-app-muted truncate max-w-[120px]">{sub.jobTitle}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${color}`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('submissions')}
            className="w-full text-center py-2.5 bg-app-surface hover:bg-app-bg text-xs font-bold text-app-text rounded-xl mt-4 transition-all border border-app-border"
          >
            Track All Submissions
          </button>
        </div>

        {/* Row C: Available Candidate Pool Card (Span 3) - Replaced the Request More card */}
        <div className="lg:col-span-3 p-6 rounded-[32px] bg-gradient-to-br from-brand-violet/10 to-brand-blue/10 border border-brand-violet/20 card-shadow flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md shadow-brand-violet/10">
              <Users className="w-6 h-6 text-brand-violet" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-app-text">Available Candidate Pool</h4>
              <p className="text-[11px] text-app-muted mt-1 leading-relaxed">
                Review available talent pools assigned to your accessible workspace and pipeline them for jobs.
              </p>
            </div>
            
            {/* Pool Statistics */}
            <div className="pt-4 border-t border-brand-violet/20 space-y-2 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Total Available Candidates</span>
                <span className="text-app-text">{stats.availableCandidates}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Assigned Candidates</span>
                <span className="text-app-text">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Selected Candidates</span>
                <span className="text-brand-blue font-extrabold">{stats.selections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-app-muted text-[11px]">• Submitted Candidates</span>
                <span className="text-emerald-500 font-extrabold">{stats.submittedCandidates}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate('candidates')}
            className="w-full mt-6 py-3.5 bg-brand-violet text-white text-xs font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-violet/20 flex items-center justify-center gap-1.5"
          >
            View Candidate Pool
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
