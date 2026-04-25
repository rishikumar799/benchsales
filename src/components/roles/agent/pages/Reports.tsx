import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Download, 
  Calendar,
  Filter,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function AgentReports() {
  const chartData = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 24 },
    { label: 'Sun', value: 12 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Performance Reports</h1>
          <p className="text-app-muted">Detailed analytics of your candidate management and conversion rates.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glass border border-app-border text-sm font-bold hover:bg-app-surface transition-all">
            <Calendar className="w-4 h-4" /> Last 30 Days
          </button>
          <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <Download className="w-4 h-4" /> Download All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Apps sent', value: '3,452', trend: '+15%', up: true, icon: Zap, color: 'text-brand-blue' },
          { label: 'Interview Invites', value: '248', trend: '+22%', up: true, icon: Users, color: 'text-violet-500' },
          { label: 'Placements Made', value: '12', trend: '-2%', up: false, icon: BarChart3, color: 'text-emerald-500' },
          { label: 'Avg Time to Hire', value: '18d', trend: '+4d', up: false, icon: Calendar, color: 'text-orange-500' }
        ].map((s, i) => (
          <div key={i} className="p-8 rounded-[32px] glass border-app-border card-shadow">
            <div className={`w-12 h-12 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center mb-6`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div className="text-3xl font-display font-bold mb-2">{s.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest">{s.label}</span>
              <span className={`text-xs font-bold flex items-center gap-1 ${s.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {s.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 rounded-[40px] glass border-app-border card-shadow">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-display font-bold">Application Volume</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs font-bold text-brand-blue bg-brand-blue/10 rounded-lg">Last Week</button>
              <button className="px-3 py-1 text-xs font-bold text-app-muted hover:bg-app-surface rounded-lg">Last Month</button>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-4 px-4">
            {chartData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${d.value * 2}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="w-full max-w-[40px] premium-gradient rounded-t-xl relative group-hover:opacity-80 transition-opacity"
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-app-surface border border-app-border px-2 py-1 rounded-md text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
                    {d.value} Apps
                  </div>
                </motion.div>
                <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-[40px] glass border-app-border card-shadow space-y-8">
          <h3 className="text-xl font-display font-bold">Candidate Distribution</h3>
          <div className="relative h-48 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-[12px] border-brand-blue border-r-brand-violet border-b-emerald-500/20 transform rotate-45" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold">Industry</span>
              <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest text-center mt-2">Split across 12 sectors</span>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Technology', val: '45%', color: 'bg-brand-blue' },
              { label: 'Finance', val: '25%', color: 'bg-brand-violet' },
              { label: 'Healthcare', val: '20%', color: 'bg-emerald-500' },
              { label: 'Other', val: '10%', color: 'bg-app-muted' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                  <span className="text-sm font-medium text-app-muted">{stat.label}</span>
                </div>
                <span className="text-sm font-bold">{stat.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
