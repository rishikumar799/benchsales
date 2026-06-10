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
  
  // Real stats of stages matching the screenshot exactly
  const stages = [
    { label: 'Applied', value: 1246, pct: '100%', color: 'from-blue-600 to-blue-500' },
    { label: 'Under Review', value: 382, pct: '30.6%', color: 'from-amber-500 to-amber-400' },
    { label: 'Shortlisted', value: 188, pct: '15.0%', color: 'from-teal-500 to-teal-400' },
    { label: 'Interview', value: 94, pct: '7.5%', color: 'from-indigo-600 to-indigo-500' },
    { label: 'Selected', value: 28, pct: '2.2%', color: 'from-emerald-600 to-emerald-500' },
  ];

  // Pipeline by Department dataset from the screenshot
  const deptData = [
    { name: 'Engineering', value: 773, percent: '62%', color: '#3b82f6' },
    { name: 'Product', value: 187, percent: '15%', color: '#10b981' },
    { name: 'Data Science', value: 125, percent: '10%', color: '#8b5cf6' },
    { name: 'Design', value: 87, percent: '7%', color: '#ec4899' },
    { name: 'Others', value: 74, percent: '6%', color: '#6b7280' },
  ];

  // Traditional Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-app-bg border border-app-border p-3.5 rounded-2xl font-bold text-xs shadow-xl">
          <p className="text-app-text">{payload[0].name}</p>
          <p className="text-brand-blue mt-1 font-extrabold">{payload[0].value} Candidates ({payload[0].payload.percent})</p>
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
          <p className="text-app-muted text-sm font-medium mt-1">Track the hiring funnel distribution and throughput across all divisions.</p>
        </div>
      </div>

      {/* Stage Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stages.map((st, sIdx) => (
          <div key={sIdx} className="p-4 rounded-2xl bg-app-surface/50 border border-app-border text-center">
            <span className="text-[10px] font-extrabold text-app-muted uppercase tracking-widest">{st.label}</span>
            <div className="text-2xl font-display font-black text-app-text mt-1.5">{st.value.toLocaleString()}</div>
            <div className="text-[10px] text-brand-blue font-bold mt-1">Yield: {st.pct}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Analytics Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Pipeline Funnel */}
        <div className="lg:col-span-6 p-6 rounded-[32px] glass border border-app-border card-shadow">
          <h3 className="font-display font-black text-lg text-app-text tracking-tight mb-6">Pipeline Funnel</h3>
          <div className="space-y-4">
            {stages.map((st, i) => {
              // Calculate width based on proportion
              const maxWidths = [100, 80, 64, 48, 32];
              const widthPct = `${maxWidths[i]}%`;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-28 text-xs font-bold text-app-muted">{st.label}</div>
                  <div className="flex-1">
                    <div 
                      className={`h-9 rounded-xl bg-gradient-to-r ${st.color} flex items-center justify-between px-4 text-white text-xs font-bold transition-all hover:brightness-105 duration-300`}
                      style={{ width: widthPct }}
                    >
                      <span>{st.value.toLocaleString()}</span>
                      <span>{st.pct}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-app-surface/40 border border-app-border text-xs text-app-muted font-medium leading-relaxed">
            💡 <strong className="text-app-text">Throughput Indicator:</strong> The progression from Applied to Selected shows a steady 2.2% conversion yield, in line with company SLA targets for Engineering and Data hires.
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
                  <div className="text-2xl font-display font-black text-app-text leading-none">1,246</div>
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-wider mt-1">Total Pool</div>
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
