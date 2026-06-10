import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, TrendingUp, Users, Package, Award, ArrowUpRight, Zap } from 'lucide-react';

export default function AnalyticsTab() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const keyMetrics = [
    { label: 'Active Opportunities', value: '24', change: '+3 this month' },
    { label: 'Eligible Students', value: '482', change: '86% verified' },
    { label: 'Applications Received', value: '1,248', change: 'Avg 4 per student' },
    { label: 'Students Placed', value: '186', change: '78% placement rate' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex justify-between items-center bg-transparent border-none">
        <div>
          <h2 className="text-3xl font-display font-bold text-app-text">Analytics</h2>
          <p className="text-app-muted">Insights and analytics for placement activities.</p>
        </div>
        <div className="text-xs font-bold bg-app-surface border border-app-border px-3.5 py-2 rounded-xl text-app-text">
          Jan 2026 - May 2026
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((met, i) => (
          <div key={i} className="p-5 rounded-2xl bg-app-surface/60 border border-app-border space-y-1">
            <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{met.label}</span>
            <div className="text-3xl font-display font-bold text-app-text-active">{met.value}</div>
            <p className="text-xs text-brand-blue font-semibold">{met.change}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Applications by Department (Donut Representation) */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-base text-app-text mb-4">Applications by Department</h4>
            <div className="flex justify-center items-center py-4 relative">
              {/* Circular Ring */}
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="60" stroke="#3b82f6" strokeWidth="16" fill="transparent" strokeDasharray="377" strokeDashoffset="120" className="opacity-90 hover:opacity-100 transition-all pointer-events-auto cursor-pointer" />
                <circle cx="80" cy="80" r="60" stroke="#8b5cf6" strokeWidth="16" fill="transparent" strokeDasharray="377" strokeDashoffset="240" className="opacity-90 hover:opacity-100 transition-all pointer-events-auto cursor-pointer" />
                <circle cx="80" cy="80" r="60" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray="377" strokeDashoffset="310" className="opacity-90 hover:opacity-100 transition-all pointer-events-auto cursor-pointer" />
                <circle cx="80" cy="80" r="60" stroke="#f59e0b" strokeWidth="16" fill="transparent" strokeDasharray="377" strokeDashoffset="350" className="opacity-90 hover:opacity-100 transition-all pointer-events-auto cursor-pointer" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-display font-black text-app-text">1,248</span>
                <span className="text-[9px] font-bold text-app-muted uppercase">Total Apps</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs font-semibold">
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> CSE</span>
              <span>520 (41%)</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" /> ECE</span>
              <span>300 (24%)</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> IT</span>
              <span>210 (17%)</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> MBA</span>
              <span>110 (9%)</span>
            </div>
          </div>
        </div>

        {/* Placement Rate by Department (Bar Chart Representing Mockup) */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-base text-app-text mb-6">Placement Rate by Department</h4>
            <div className="h-44 flex items-end justify-between px-3.5 mt-2">
              {[
                { dept: 'CSE', pct: '82%', h: '82%' },
                { dept: 'ECE', pct: '75%', h: '75%' },
                { dept: 'IT', pct: '72%', h: '72%' },
                { dept: 'ME', pct: '68%', h: '68%' },
                { dept: 'MBA', pct: '65%', h: '65%' },
              ].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 w-10">
                  <span className="text-[10px] font-black text-brand-blue">{val.pct}</span>
                  <div className="w-full bg-app-surface border border-app-border rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: '110px' }}>
                    <div className="bg-brand-blue rounded-t-md transition-all duration-500 ease-out" style={{ height: val.h }} />
                  </div>
                  <span className="text-[10px] font-bold text-app-muted">{val.dept}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-app-border/40 text-[10px] text-center text-app-muted font-bold uppercase tracking-wider">
            Placement Rate Out of Hired Targets
          </div>
        </div>

        {/* Package Distribution (Pie / Distribution Segment Details) */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-base text-app-text mb-4">Package Distribution (LPA)</h4>
            
            <div className="flex justify-center items-center py-4 relative">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="50" stroke="#ec4899" strokeWidth="16" fill="transparent" strokeDasharray="314" strokeDashoffset="80" className="opacity-90 cursor-pointer" />
                <circle cx="80" cy="80" r="50" stroke="#3b82f6" strokeWidth="16" fill="transparent" strokeDasharray="314" strokeDashoffset="180" className="opacity-90 cursor-pointer" />
                <circle cx="80" cy="80" r="50" stroke="#10b981" strokeWidth="16" fill="transparent" strokeDasharray="314" strokeDashoffset="260" className="opacity-90 cursor-pointer" />
                <circle cx="80" cy="80" r="50" stroke="#f59e0b" strokeWidth="16" fill="transparent" strokeDasharray="314" strokeDashoffset="300" className="opacity-90 cursor-pointer" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-display font-black text-app-text">Avg</span>
                <span className="text-xs font-black text-brand-blue">6.8 LPA</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 text-[11px] font-bold">
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" /> &gt; 10 LPA</span>
              <span>18%</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" /> 6 - 10 LPA</span>
              <span>32%</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1 border-b border-app-border/35">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" /> 4 - 6 LPA</span>
              <span>28%</span>
            </div>
            <div className="flex justify-between items-center text-app-text py-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" /> &lt; 4 LPA</span>
              <span>15%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom splitting: Company Participation and Monthly Placements Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Company Participation Progress Rows */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow">
          <h4 className="font-display font-bold text-base text-app-text mb-5">Company Participation Ranking</h4>
          
          <div className="space-y-4">
            {[
              { company: 'TCS', hires: 42, color: 'bg-[#3b82f6]', percent: '100%' },
              { company: 'Infosys', hires: 34, color: 'bg-[#8b5cf6]', percent: '80.9%' },
              { company: 'Wipro', hires: 28, color: 'bg-[#10b981]', percent: '66.7%' },
              { company: 'Accenture', hires: 18, color: 'bg-[#ec4899]', percent: '42.8%' },
              { company: 'Capgemini', hires: 15, color: 'bg-[#f59e0b]', percent: '35.7%' },
            ].map((comp, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-app-text">
                  <span>{comp.company}</span>
                  <span className="text-app-muted">{comp.hires} Confirmed Hires</span>
                </div>
                <div className="w-full h-2.5 bg-app-surface border border-app-border rounded-full overflow-hidden">
                  <div className={`h-full ${comp.color} rounded-full`} style={{ width: comp.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Placement Trend SVG line graph */}
        <div className="p-6 rounded-[28px] glass border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h4 className="font-display font-bold text-base text-app-text mb-5 font-display">Monthly Placement Trend (2026)</h4>
            <div className="relative h-44 w-full">
              {/* Dynamic Path SVG inside */}
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 130">
                {/* Horizontal reference grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="currentColor" className="text-app-border/30" strokeDasharray="3" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="currentColor" className="text-app-border/30" strokeDasharray="3" />
                <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" className="text-app-border/30" strokeDasharray="3" />

                {/* Trend line cubic spline */}
                <path 
                  d="M 10 110 C 100 110, 150 70, 200 40 C 250 10, 320 20, 390 10" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />

                {/* Shading area below path */}
                <path 
                  d="M 10 110 C 100 110, 150 70, 200 40 C 250 10, 320 20, 390 10 L 390 120 L 10 120 Z" 
                  fill="url(#trendGrad)"
                  opacity="0.12"
                />

                {/* Circles for key points */}
                <circle cx="10" cy="110" r="4.5" fill="#3b82f6" />
                <circle cx="100" cy="100" r="4.5" fill="#3b82f6" />
                <circle cx="200" cy="40" r="4.5" fill="#3b82f6" />
                <circle cx="300" cy="24" r="4.5" fill="#3b82f6" />
                <circle cx="390" cy="10" r="4.5" fill="#3b82f6" />

                {/* Custom Gradient definitions */}
                <defs>
                  <linearGradient id="trendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Label axis */}
            <div className="flex justify-between text-[10px] font-black tracking-widest text-app-muted uppercase px-1 pt-2">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>

          <div className="pt-4 border-t border-app-border/40 text-xs font-bold text-center text-app-muted flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span>Consistently positive growth in student placements rate month-on-month</span>
          </div>
        </div>

      </div>
    </div>
  );
}
