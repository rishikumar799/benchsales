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
  Play,
  Bot,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function StudentDashboard() {
  const stats = [
    { label: 'Apps Sent Today', value: '12', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', trend: '+20%' },
    { label: 'Total Applications', value: '154', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Interviews Scheduled', value: '4', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: '+2' },
    { label: 'Offers Received', value: '1', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'New' },
  ];

  const recentApps = [
    { company: 'Google', role: 'Frontend Engineer', status: 'Interview', date: '2h ago', logo: 'G', color: 'bg-red-500' },
    { company: 'Meta', role: 'Product Designer', status: 'Applied', date: '5h ago', logo: 'M', color: 'bg-blue-600' },
    { company: 'Stripe', role: 'Fullstack Developer', status: 'Applied', date: '1d ago', logo: 'S', color: 'bg-indigo-500' },
    { company: 'Vercel', role: 'Solutions Architect', status: 'Rejected', date: '2d ago', logo: 'V', color: 'bg-black' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Welcome back, <span className="text-gradient">Rishi</span></h1>
          <p className="text-app-muted text-lg">Your AI agent is currently active and sourcing roles for you.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 text-sm font-bold border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Agent Active
          </div>
          <button className="px-6 py-3 premium-gradient text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
            <Play className="w-4 h-4 fill-white" /> Start New Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[32px] glass border-app-border card-shadow relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors" />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <div className="text-4xl font-display font-bold mb-1 tracking-tight">{stat.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-app-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-display font-bold">Recent Applications</h2>
            <button className="text-sm font-bold text-brand-blue hover:text-brand-violet transition-colors flex items-center gap-1 group">
              View All <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentApps.map((app, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-5 rounded-3xl glass border-app-border flex items-center justify-between group hover:bg-app-surface/50 transition-all card-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${app.color} flex items-center justify-center text-2xl font-display font-bold text-white shadow-lg shadow-black/10`}>
                    {app.logo}
                  </div>
                  <div>
                    <div className="font-bold text-app-text text-lg">{app.company}</div>
                    <div className="text-sm text-app-muted font-medium">{app.role}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className={`text-xs font-bold uppercase tracking-[0.2em] mb-1.5 ${
                      app.status === 'Interview' ? 'text-violet-500' : 
                      app.status === 'Rejected' ? 'text-red-500' : 'text-blue-500'
                    }`}>
                      {app.status}
                    </div>
                    <div className="text-xs text-app-muted font-bold">{app.date}</div>
                  </div>
                  <button className="p-3 rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Resume Strength */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-[40px] glass border-app-border card-shadow"
          >
            <h3 className="text-xl font-display font-bold mb-6">Resume Strength</h3>
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-app-border" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="440" strokeDashoffset="88" className="text-brand-blue" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-display font-bold">82%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-app-muted">Excellent</span>
              </div>
            </div>
            <button className="w-full py-4 premium-gradient text-white font-bold rounded-2xl text-sm shadow-lg shadow-brand-blue/20 hover:scale-[1.02] transition-all">
              Optimize with AI
            </button>
          </motion.div>

          {/* AI Insights */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="p-8 rounded-[40px] bg-brand-violet/5 border border-brand-violet/20 relative overflow-hidden group"
          >
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-violet/10 rounded-full blur-3xl group-hover:bg-brand-violet/20 transition-colors" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-violet" />
              </div>
              <h3 className="text-lg font-display font-bold">AI Insights</h3>
            </div>
            <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">
              "Your resume tailoring score for <span className="text-brand-violet font-bold">Frontend Engineer</span> roles has increased by 12% this week. We recommend adding 'Next.js' to your skills."
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-violet cursor-pointer hover:underline">
              View detailed report <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <h3 className="text-lg font-display font-bold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Update Master Resume', icon: FileText },
                { label: 'Configure AI Agent', icon: Zap },
                { label: 'View Public Profile', icon: ExternalLink },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-app-surface transition-all text-sm font-bold text-app-muted hover:text-app-text border border-transparent hover:border-app-border">
                  <div className="w-10 h-10 rounded-xl bg-app-surface border border-app-border flex items-center justify-center shadow-sm">
                    <action.icon className="w-5 h-5" />
                  </div>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
