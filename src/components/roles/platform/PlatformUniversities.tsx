import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Building2, 
  Target, 
  Award,
  BookOpen,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const dataSeries = [
  { month: 'Dec', colleges: 410, students: 38000, rate: 68 },
  { month: 'Jan', colleges: 425, students: 40100, rate: 70 },
  { month: 'Feb', colleges: 440, students: 41500, rate: 71 },
  { month: 'Mar', colleges: 455, students: 43200, rate: 71.8 },
  { month: 'Apr', colleges: 470, students: 44500, rate: 72.1 },
  { month: 'May', colleges: 482, students: 45300, rate: 72.4 },
];

const streamData = [
  { name: 'Engineering & CS', value: 55, color: '#3b82f6' },
  { name: 'Management / MBA', value: 20, color: '#8b5cf6' },
  { name: 'Commerce / B.Com', value: 10, color: '#10b981' },
  { name: 'Arts & Design', value: 10, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#9ca3af' },
];

export default function PlatformUniversities() {
  return (
    <div id="platform-universities-view" className="space-y-6">
      {/* Ecosystem Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-blue">Ecosystem Isolation - Tier 2</span>
        <h2 className="text-3xl font-display font-bold mt-1">University & College Placements Ecosystem</h2>
        <p className="text-app-muted text-sm mt-1">Institutional academic structures. Multi-college datasets restricted from commercial outreach.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Universities', value: '482', change: '+13.4%', color: 'text-blue-500' },
          { label: 'Total Students', value: '45,300', change: '+15.7%', color: 'text-violet-500' },
          { label: 'Placement Officers', value: '1,248', change: '+13.2%', color: 'text-emerald-500' },
          { label: 'Placements Secured', value: '8,240', change: '+18.1%', color: 'text-amber-500' },
          { label: 'Placement Rate (%)', value: '72.4%', change: '+4.8%', color: 'text-pink-500' },
        ].map((st, idx) => (
          <div key={idx} className="p-5 rounded-[28px] glass border-app-border card-shadow">
            <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted block">{st.label}</span>
            <div className={`text-2xl font-display font-bold mt-1.5 ${st.color}`}>{st.value}</div>
            <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">▲ {st.change}</span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">University Growth (YoY)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="colleges" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted">Student Accounts Connected</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted font-mono text-pink-500">Placement Success Rate %</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataSeries} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" fontSize={10} stroke="#9ca3af" />
                <YAxis fontSize={10} stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Streams & Top Performers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placements by Stream */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-brand-blue" /> Placement Streams
          </h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={streamData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {streamData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 text-xs">
              {streamData.map((stream, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold text-app-text">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stream.color }} />
                    {stream.name}
                  </div>
                  <span className="text-app-muted font-bold">{stream.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Universities */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> Top Performing Institutions
          </h3>
          <div className="space-y-2">
            {[
              { name: 'ABC University College', placements: '820 placements', rank: '#1 Tech placements' },
              { name: 'XYZ Institute of Tech', placements: '645 placements', rank: '#2 High package average' },
              { name: 'Global Education University', placements: '512 placements', rank: '#3 Commerce & Management' },
              { name: 'Future University Group', placements: '498 placements', rank: '#4 Emerging streams tier' },
              { name: 'Bright Future Academy', placements: '389 placements', rank: '#5 Regional placements leader' },
            ].map((univ, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-app-surface/50 border border-app-border text-xs flex justify-between items-center">
                <div>
                  <div className="font-bold text-app-text">{univ.name}</div>
                  <div className="text-[10px] text-app-muted/80">{univ.rank}</div>
                </div>
                <span className="text-emerald-500 font-bold whitespace-nowrap text-[11px]">{univ.placements}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Engagement */}
        <div className="p-6 rounded-[32px] glass border-app-border card-shadow space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-app-muted flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-violet-500" /> Student Activation Logs
          </h3>
          <div className="space-y-3 text-xs">
            {[
              { metric: 'Active Resumes Built', total: '28,450 accounts', percent: 85, metricType: 'Resume files download/print ready' },
              { metric: 'Placement Profile Completion', total: '75.6% completeness', percent: 76, metricType: 'L1 to L8 grade fields configured' },
              { metric: 'Placement Applications Routed', total: '42,188 secure dispatches', percent: 90, metricType: 'Instant agency proxy dispatch' },
            ].map((eng, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-app-surface border border-app-border space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-app-text">{eng.metric}</span>
                  <span className="font-mono text-brand-blue font-bold">{eng.total.split(' ')[0]}</span>
                </div>
                <div className="text-[10px] text-app-muted leading-tight">{eng.metricType}</div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="h-full bg-emerald-500" style={{ width: `${eng.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
