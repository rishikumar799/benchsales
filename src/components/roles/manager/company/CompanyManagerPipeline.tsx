import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Layers, 
  MapPin, 
  ChevronRight, 
  Briefcase,
  PieChart,
  Target,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend 
} from 'recharts';

interface CandidateType {
  id: string;
  name: string;
  role: string;
  status: 'Applied' | 'Under Review' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected';
  dept: string;
}

export default function CompanyManagerPipeline() {
  
  // Real stats of stages matching the requested workflow
  const stages = [
    { label: 'Jobs', value: 18, pct: '100%', color: 'from-blue-600 to-blue-500', displayMetric: 'Openings' },
    { label: 'Recruiters Assigned', value: 4, pct: '100%', color: 'from-amber-500 to-amber-400', displayMetric: 'Recruiters' },
    { label: 'Submissions Received', value: 842, pct: '100%', color: 'from-teal-500 to-teal-400', displayMetric: 'Submissions' },
    { label: 'Interviews Created', value: 94, pct: '11.1%', color: 'from-indigo-600 to-indigo-500', displayMetric: 'Interviews' },
    { label: 'Selected / Hired', value: 28, pct: '3.3%', color: 'from-emerald-600 to-emerald-500', displayMetric: 'Hires' },
  ];

  // Pipeline by Department dataset matching total submissions 842
  const deptData = [
    { name: 'Engineering', value: 522, percent: '62%', color: '#3b82f6' },
    { name: 'Product', value: 126, percent: '15%', color: '#10b981' },
    { name: 'Data Science', value: 84, percent: '10%', color: '#8b5cf6' },
    { name: 'Design', value: 59, percent: '7%', color: '#ec4899' },
    { name: 'Others', value: 51, percent: '6%', color: '#6b7280' },
  ];

  // Traditional Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-app-bg border border-app-border p-3.5 rounded-2xl font-bold text-xs shadow-xl">
          <p className="text-app-text">{payload[0].name}</p>
          <p className="text-brand-blue mt-1 font-extrabold">{payload[0].value} Submissions ({payload[0].payload.percent})</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in text-app-text">
       
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-app-text tracking-tight">Hiring Pipeline</h1>
          <p className="text-app-muted text-sm font-medium mt-1">Track the hiring funnel distribution and recruiter submission throughput across all active divisions.</p>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((st, sIdx) => {
          const stageConfigs = [
            {
              icon: Briefcase,
              accentColor: 'text-blue-500',
              accentBg: 'bg-blue-500/10 border-blue-500/20',
              glow: 'bg-blue-500/5',
              hoverBorder: 'hover:border-blue-500/30'
            },
            {
              icon: Layers,
              accentColor: 'text-amber-500',
              accentBg: 'bg-amber-500/10 border-amber-500/20',
              glow: 'bg-amber-500/5',
              hoverBorder: 'hover:border-amber-500/30'
            },
            {
              icon: GitPullRequest,
              accentColor: 'text-teal-500',
              accentBg: 'bg-teal-500/10 border-teal-500/20',
              glow: 'bg-teal-500/5',
              hoverBorder: 'hover:border-teal-500/30'
            },
            {
              icon: Target,
              accentColor: 'text-indigo-500',
              accentBg: 'bg-indigo-500/10 border-indigo-500/20',
              glow: 'bg-indigo-500/5',
              hoverBorder: 'hover:border-indigo-500/30'
            },
            {
              icon: Award,
              accentColor: 'text-emerald-500',
              accentBg: 'bg-emerald-500/10 border-emerald-500/20',
              glow: 'bg-emerald-500/5',
              hoverBorder: 'hover:border-emerald-500/30'
            }
          ];

          const config = stageConfigs[sIdx] || stageConfigs[0];
          const isConversion = st.label === 'Selected / Hired' || st.label === 'Interviews Created';
          
          let cardHeader = st.label.toUpperCase();
          let cardSubHeader = "";
          if (st.label === 'Recruiters Assigned') {
            cardHeader = "RECRUITERS";
            cardSubHeader = "ASSIGNED";
          } else if (st.label === 'Submissions Received') {
            cardHeader = "SUBMISSIONS";
            cardSubHeader = "RECEIVED";
          } else if (st.label === 'Interviews Created') {
            cardHeader = "INTERVIEWS CREATED";
          } else if (st.label === 'Selected / Hired') {
            cardHeader = "SELECTED / HIRED";
          } else if (st.label === 'Jobs') {
            cardHeader = "JOBS";
          }

          return (
            <div 
              key={sIdx} 
              className={`relative overflow-hidden p-5 rounded-[24px] bg-gradient-to-b from-app-surface/90 to-app-surface/40 border border-app-border/80 ${config.hoverBorder} text-center flex flex-col justify-between items-center min-h-[155px] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_12px_24px_-10px_rgba(59,130,246,0.15)] group`}
            >
              {/* Decorative radial background glow */}
              <div className={`absolute -right-6 -top-6 w-16 h-16 rounded-full ${config.glow} blur-xl group-hover:scale-150 transition-all duration-500`} />
              
              {/* Card Header Label */}
              <div className="flex flex-col items-center gap-0.5 w-full z-10">
                <span className="text-[10px] font-black tracking-wider text-app-muted uppercase leading-none">{cardHeader}</span>
                {cardSubHeader && (
                  <span className="text-[9px] font-extrabold tracking-widest text-app-muted/80 uppercase mt-0.5 leading-none">{cardSubHeader}</span>
                )}
              </div>

              {/* Central Value */}
              <div className="my-3 flex items-baseline justify-center gap-1.5 z-10">
                <span className="text-3xl font-display font-black text-app-text tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {st.value.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-app-muted lowercase">
                  {st.displayMetric}
                </span>
              </div>

              {/* Premium Footer Accent */}
              <div className="w-full pt-2 border-t border-app-border/30 z-10">
                <span className="text-[10px] font-black tracking-wide text-brand-blue uppercase">
                  {isConversion ? `Conversion: ${st.pct}` : 'Stage Capacity'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Pipeline Funnel */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-black text-lg text-app-text tracking-tight mb-6">Pipeline Funnel</h3>
          <div className="space-y-4">
            {stages.map((st, i) => {
              // Calculate width based on proportion
              const maxWidths = [100, 90, 80, 60, 40];
              const widthPct = `${maxWidths[i]}%`;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-28 text-xs font-bold text-app-muted">{st.label}</div>
                  <div className="flex-1">
                    <div 
                      className={`h-9 rounded-xl bg-gradient-to-r ${st.color} flex items-center justify-between px-4 text-white text-xs font-bold transition-all hover:brightness-105 duration-300`}
                      style={{ width: widthPct }}
                    >
                      <span>{st.value.toLocaleString()} {st.displayMetric}</span>
                      <span>{st.pct}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-app-surface/40 border border-app-border text-xs text-app-muted font-medium leading-relaxed">
            💡 <strong className="text-app-text">Throughput Indicator:</strong> The progression from Submissions to Selected/Hired shows a steady 3.3% conversion yield, in line with company SLA targets for ecosystem sourcing.
          </div>
        </div>

        {/* Right Donuts Chart: Department Share */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-lg text-app-text tracking-tight mb-4">Pipeline by Department</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
              
              {/* Graphic donut */}
              <div className="w-52 h-52 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={deptData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deptData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </RePieChart>
                </ResponsiveContainer>
                {/* Center text metrics */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="text-2xl font-display font-black text-app-text leading-none">842</div>
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider mt-1">Submissions</div>
                </div>
              </div>

              {/* Legend checklist */}
              <div className="space-y-3 flex-1 w-full sm:w-auto">
                {deptData.map((d, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-app-muted">{d.name}</span>
                    </div>
                    <div className="text-app-text font-black">{d.percent} <span className="font-bold text-[10px] text-app-muted">({d.value})</span></div>
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
