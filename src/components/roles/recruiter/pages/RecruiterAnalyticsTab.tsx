import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie
} from 'recharts';
import { 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  ChevronDown, 
  Users, 
  Briefcase, 
  FileText, 
  CheckSquare
} from 'lucide-react';

export default function RecruiterAnalyticsTab() {
  const [dateRange, setDateRange] = useState('01 May 2024 - 31 May 2024');

  // Interactive sample data for Recharts
  const lineData = [
    { name: '1 May', applications: 154 },
    { name: '8 May', applications: 242 },
    { name: '15 May', applications: 350 },
    { name: '22 May', applications: 486 },
    { name: '31 May', applications: 842 }
  ];

  const barData = [
    { name: 'Jan', days: 40 },
    { name: 'Feb', days: 28 },
    { name: 'Mar', days: 26 },
    { name: 'Apr', days: 25 },
    { name: 'May', days: 24 }
  ];

  const pieData = [
    { name: 'Engineering', value: 620, color: '#3b82f6' },
    { name: 'Infrastructure', value: 180, color: '#a855f7' },
    { name: 'Product', value: 120, color: '#10b981' },
    { name: 'Data', value: 80, color: '#f59e0b' }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  const funnelStages = [
    { label: 'Applied', count: 842, pct: '100%', bg: 'bg-brand-blue/15 border-brand-blue/30 text-brand-blue' },
    { label: 'Under Review', count: 324, pct: '38%', bg: 'bg-violet-500/15 border-violet-500/30 text-violet-500' },
    { label: 'Shortlisted', count: 96, pct: '11%', bg: 'bg-pink-500/15 border-pink-500/30 text-pink-500' },
    { label: 'Interview', count: 32, pct: '4%', bg: 'bg-amber-500/15 border-amber-500/30 text-amber-500' },
    { label: 'Selected', count: 18, pct: '2%', bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' }
  ];

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-app-surface border border-app-border rounded-xl text-left font-sans text-xs font-bold shadow-xl">
          <p className="text-app-muted mb-1">{label}</p>
          <p className="text-brand-blue">{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in text-left">
      
      {/* Header and date selection row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-app-text">Analytics</h1>
          <p className="text-app-muted text-sm mt-1">Track and analyze your recruitment performance seamlessly.</p>
        </div>

        {/* Date dropdown */}
        <div className="relative">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none pl-10 pr-10 py-2.5 bg-app-surface border border-app-border text-xs font-bold text-app-text rounded-xl focus:outline-none focus:border-brand-blue cursor-pointer"
          >
            <option>01 May 2024 - 31 May 2024</option>
            <option>01 Apr 2024 - 30 Apr 2024</option>
            <option>Last 90 Days</option>
          </select>
          <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-app-muted pointer-events-none" />
        </div>
      </div>

      {/* Analytics KPI metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: Briefcase, label: 'Active Jobs', value: '18', change: '+3 from last month' },
          { icon: FileText, label: 'Applications', value: '842', change: '+16% from last month' },
          { icon: Users, label: 'Total Candidates', value: '324', change: '+15% from last month' },
          { icon: CheckSquare, label: 'Open Positions', value: '46', change: '+5 from last month' }
        ].map((item, idx) => (
          <div key={idx} className="p-5 md:p-6 rounded-[28px] bg-app-surface border border-app-border card-shadow flex items-start justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-wider">{item.label}</span>
              <div className="text-2xl md:text-3xl font-display font-black text-app-text">{item.value}</div>
              <div className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {item.change}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-brand-blue/10 text-brand-blue">
              <item.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Block A */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Applications Over Time Line Chart (Span 7) */}
        <div className="lg:col-span-7 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-app-text mb-4">Applications Over Time</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 5, strokeWidth: 2, fill: '#3b82f6' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Applications by Department Donut Chart (Span 5) */}
        <div className="lg:col-span-5 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-app-text mb-4">Applications by Department</h3>
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-64">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Embedded Center Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-display font-black text-app-text">842</span>
                  <span className="text-[9px] font-bold text-app-muted uppercase">Applications</span>
                </div>
              </div>

              {/* Legends list */}
              <div className="space-y-2 text-[10px] font-bold w-full sm:w-auto">
                {pieData.map((dept, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                    <span className="text-app-muted truncate max-w-[100px]">{dept.name}</span>
                    <span className="text-app-text ml-auto">
                      {Math.round((dept.value / 1000) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Charts Block B */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Hiring Funnel Stage Stack (Span 6) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow space-y-5">
          <h3 className="font-display font-black text-sm uppercase tracking-wide text-app-text">Hiring Funnel</h3>
          <div className="space-y-3.5">
            {funnelStages.map((stage, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-app-text">
                  <span>{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span>{stage.count} Users</span>
                    <span className="text-brand-blue">({stage.pct})</span>
                  </div>
                </div>
                <div className={`p-4 border rounded-2xl ${stage.bg} flex justify-between items-center transition-all hover:scale-[1.005]`}>
                  <span className="text-xs font-extrabold uppercase tracking-wide">{stage.label}</span>
                  <span className="text-xs font-black">{stage.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time to Hire Bar Chart (Span 6) */}
        <div className="lg:col-span-6 p-6 md:p-8 rounded-[32px] bg-app-surface border border-app-border card-shadow flex flex-col justify-between">
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-wide text-app-text mb-4">Time to Hire Trend (Days)</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.1)" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="days" fill="#6366f1" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === barData.length - 1 ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="pt-2 text-center text-xs font-bold text-app-muted border-t border-app-border/40 mt-3">
            Average time to close role decreased by <span className="text-emerald-500">16 Days</span> since January.
          </div>
        </div>

      </div>

    </div>
  );
}
