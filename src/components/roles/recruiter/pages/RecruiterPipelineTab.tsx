import { useState } from 'react';
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Briefcase,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ThumbsUp,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

interface RecruiterPipelineTabProps {
  onNavigate: (tab: string) => void;
  candidates: Array<{
    id: string;
    name: string;
    role: string;
    status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
    appliedDate: string;
  }>;
  onUpdateStatus: (id: string, status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected') => void;
  onSelectCandidate: (id: string) => void;
}

export default function RecruiterPipelineTab({
  onNavigate,
  candidates,
  onUpdateStatus,
  onSelectCandidate
}: RecruiterPipelineTabProps) {
  const [selectedJob, setSelectedJob] = useState('All');

  const stages: Array<{
    id: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected';
    label: string;
    totalCount: number;
    extraLabel: string;
    color: string;
    barColor: string;
  }> = [
    { id: 'Applied', label: 'Applied', totalCount: 336, extraLabel: '321 more', color: 'text-brand-blue', barColor: 'bg-brand-blue' },
    { id: 'Under Review', label: 'Under Review', totalCount: 128, extraLabel: '125 more', color: 'text-violet-500', barColor: 'bg-violet-500' },
    { id: 'Shortlisted', label: 'Shortlisted', totalCount: 96, extraLabel: '93 more', color: 'text-pink-500', barColor: 'bg-pink-500' },
    { id: 'Interview', label: 'Interview', totalCount: 32, extraLabel: '29 more', color: 'text-amber-500', barColor: 'bg-amber-500' },
    { id: 'Selected', label: 'Selected', totalCount: 18, extraLabel: '15 more', color: 'text-emerald-500', barColor: 'bg-emerald-500' }
  ];

  const getStageCandidates = (status: string) => {
    return candidates.filter(c => {
      const matchesStatus = c.status === status;
      const matchesJob = selectedJob === 'All' || c.role === selectedJob;
      return matchesStatus && matchesJob;
    });
  };

  const uniqueRoles = Array.from(new Set(candidates.map(c => c.role)));

  // Define transition sequences
  const moveCard = (id: string, currentStatus: string, dir: 'left' | 'right') => {
    const sequence: Array<'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected'> = [
      'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'
    ];
    const currentIdx = sequence.indexOf(currentStatus as any);
    if (currentIdx === -1) return;

    if (dir === 'left' && currentIdx > 0) {
      onUpdateStatus(id, sequence[currentIdx - 1]);
    } else if (dir === 'right' && currentIdx < sequence.length - 1) {
      onUpdateStatus(id, sequence[currentIdx + 1]);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-left">
      
      {/* Header & Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Pipeline</h1>
          <p className="text-app-muted text-sm mt-1">Visualize your hiring pipeline and candidate progress.</p>
        </div>
        
        {/* Dropdown Job selector */}
        <div className="relative">
          <select 
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-app-surface border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
          >
            <option value="All">All Jobs</option>
            {uniqueRoles.map((role, rIdx) => (
              <option key={rIdx} value={role}>{role}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageList = getStageCandidates(stage.id);
          return (
            <div key={stage.id} className="min-w-[220px] flex flex-col gap-4">
              {/* Header column */}
              <div className="flex items-center justify-between border-b border-app-border pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black uppercase tracking-wider text-app-text`}>{stage.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.barColor} text-white`}>
                    {stageList.length}
                  </span>
                </div>
              </div>

              {/* Candidates Cards in this column */}
              <div className="flex-1 space-y-3 pb-8 min-h-[300px]">
                {stageList.map((cand) => (
                  <div 
                    key={cand.id}
                    className="p-4 rounded-2xl bg-app-surface border border-app-border card-shadow flex flex-col justify-between gap-3 hover:border-brand-blue/40 hover:scale-[1.01] transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 
                          className="font-extrabold text-xs text-app-text hover:text-brand-blue transition-colors cursor-pointer"
                          onClick={() => {
                            onSelectCandidate(cand.id);
                            onNavigate('candidates');
                          }}
                        >
                          {cand.name}
                        </h4>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => moveCard(cand.id, stage.id, 'left')}
                            className="p-1 hover:bg-app-bg text-app-muted hover:text-app-text rounded cursor-pointer"
                            title="Move Back"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => moveCard(cand.id, stage.id, 'right')}
                            className="p-1 hover:bg-app-bg text-app-muted hover:text-brand-blue rounded cursor-pointer"
                            title="Move Forward"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-app-muted font-bold truncate mt-1">{cand.role}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 border-t border-app-border/40 text-[9px] text-app-muted font-bold">
                      <span>{cand.appliedDate}</span>
                      <button 
                        onClick={() => {
                          onSelectCandidate(cand.id);
                          onNavigate('candidates');
                        }}
                        className="text-brand-blue hover:underline cursor-pointer"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))}

                {/* More candidates indicator matching image */}
                {stageList.length > 0 && (
                  <button 
                    onClick={() => {
                      onNavigate('applications');
                    }}
                    className="w-full text-center py-2.5 bg-app-surface/40 hover:bg-app-surface border border-dashed border-app-border text-[11px] font-bold text-app-muted hover:text-brand-blue hover:border-brand-blue/30 rounded-xl transition-all cursor-pointer"
                  >
                    + {stage.extraLabel}
                  </button>
                )}

                {stageList.length === 0 && (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-app-border text-[11px] font-bold text-app-muted">
                    No active cards
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Summary Footer Card */}
      <div className="p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-6">
        <h3 className="text-sm font-display font-black text-app-text uppercase tracking-wide">Pipeline Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Candidates', value: '598', change: '12% from last week', isPositive: true },
            { label: 'Conversion Rate', value: '10.8%', change: '2.4% from last week', isPositive: true },
            { label: 'Average Time to Hire', value: '23 Days', change: '4 days faster', isPositive: true },
            { label: 'Offers Extended', value: '18', change: '3 from last week', isPositive: true }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{item.label}</span>
              <div className="text-2xl font-display font-black text-app-text">{item.value}</div>
              <div className={`text-[10px] font-bold ${item.isPositive ? 'text-emerald-500' : 'text-rose-500'} flex items-center gap-1`}>
                <TrendingUp className="w-3.5 h-3.5" /> {item.change}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
