import { motion } from 'motion/react';
import { 
  Zap, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  FileText, 
  MoreVertical,
  ExternalLink,
  Play
} from 'lucide-react';

export default function StudentDashboard() {
  const stats = [
    { label: 'Apps Sent Today', value: '12', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Total Applications', value: '154', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Interviews Scheduled', value: '4', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Offers Received', value: '1', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const recentApps = [
    { company: 'Google', role: 'Frontend Engineer', status: 'Interview', date: '2h ago', logo: 'G' },
    { company: 'Meta', role: 'Product Designer', status: 'Applied', date: '5h ago', logo: 'M' },
    { company: 'Stripe', role: 'Fullstack Developer', status: 'Applied', date: '1d ago', logo: 'S' },
    { company: 'Vercel', role: 'Solutions Architect', status: 'Rejected', date: '2d ago', logo: 'V' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Good morning, Rishi!</h1>
          <p className="text-gray-400">Your AI agent is currently active and sourcing roles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Agent Active
          </div>
          <button className="px-6 py-2.5 blue-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <Play className="w-4 h-4 fill-white" /> Start Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="p-6 rounded-3xl glass border-white/5"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Applications</h2>
            <button className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentApps.map((app, i) => (
              <div key={i} className="p-4 rounded-2xl glass border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl blue-gradient flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {app.logo}
                  </div>
                  <div>
                    <div className="font-bold text-white">{app.company}</div>
                    <div className="text-sm text-gray-400">{app.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                      app.status === 'Interview' ? 'text-violet-400' : 
                      app.status === 'Rejected' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      {app.status}
                    </div>
                    <div className="text-xs text-gray-500">{app.date}</div>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* AI Insights */}
          <div className="p-8 rounded-[32px] blue-gradient text-white relative overflow-hidden">
            <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10" />
            <h3 className="text-xl font-bold mb-4">AI Insights</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Your resume tailoring score for "Frontend" roles has increased by 12% this week.
            </p>
            <button className="w-full py-3 bg-white text-brand-blue font-bold rounded-xl text-sm hover:bg-white/90 transition-colors">
              Optimize Resume
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-8 rounded-[32px] glass border-white/5">
            <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                Update Master Resume
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                Configure AI Agent
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-300">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <ExternalLink className="w-4 h-4" />
                </div>
                View Public Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
