import { motion } from 'motion/react';
import { Users, Zap, BarChart3, Clock, ArrowUpRight, Search, Filter, Briefcase, MoreVertical, Trophy, ArrowRight } from 'lucide-react';

export default function AgentDashboard() {
  const stats = [
    { label: 'Active Students', value: '24', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Apps Sent Today', value: '142', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Interviews Won', value: '18', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Success Rate', value: '94%', icon: BarChart3, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  const myStudents = [
    { name: 'Rishi Kumar', role: 'student', apps: 45, interviews: 3, status: 'Active', avatar: 'RK' },
    { name: 'Sarah Chen', role: 'student', apps: 32, interviews: 1, status: 'Active', avatar: 'SC' },
    { name: 'Alex Rivera', role: 'student', apps: 12, interviews: 0, status: 'Onboarding', avatar: 'AR' },
    { name: 'Emma Wilson', role: 'student', apps: 89, interviews: 5, status: 'Active', avatar: 'EW' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Agent Dashboard</h1>
          <p className="text-app-muted text-lg">Managing <span className="text-brand-blue font-bold">24 candidates</span> across 12 industries.</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-blue/10 text-brand-blue text-sm font-bold border border-brand-blue/20 shadow-sm shadow-brand-blue/5">
            <Zap className="w-4 h-4" /> 142 Apps Sent Today
          </div>
          <button className="px-6 py-3 premium-gradient text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
            <Users className="w-4 h-4" /> Add New Candidate
          </button>
        </div>
      </div>

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
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 shadow-inner`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div className="text-4xl font-display font-bold mb-1 tracking-tight">{stat.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-app-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-display font-bold">Active Candidates</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input 
                  type="text" 
                  placeholder="Search students..." 
                  className="bg-app-surface border border-app-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-blue w-48 transition-all"
                />
              </div>
              <button className="p-2 rounded-xl glass border-app-border text-app-muted hover:text-app-text transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myStudents.map((student, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-[32px] glass border-app-border card-shadow group transition-all hover:bg-app-surface/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white font-display font-bold shadow-lg">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-app-text">{student.name}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-app-muted">{student.status}</div>
                    </div>
                  </div>
                  <button className="p-2 rounded-xl hover:bg-app-bg text-app-muted hover:text-app-text transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-app-bg/50 p-3 rounded-2xl border border-app-border/50">
                    <div className="text-xs font-bold text-app-muted uppercase tracking-widest mb-1">Apps</div>
                    <div className="text-xl font-display font-bold">{student.apps}</div>
                  </div>
                  <div className="bg-app-bg/50 p-3 rounded-2xl border border-app-border/50">
                    <div className="text-xs font-bold text-app-muted uppercase tracking-widest mb-1">Interviews</div>
                    <div className="text-xl font-display font-bold text-brand-violet">{student.interviews}</div>
                  </div>
                </div>

                <button className="w-full py-3 rounded-xl border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center justify-center gap-2 group-hover:premium-gradient group-hover:text-white group-hover:border-transparent">
                  Manage Candidate <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <h3 className="text-xl font-display font-bold mb-6">Performance Overview</h3>
            <div className="space-y-6">
              {[
                { label: 'Response Rate', value: 78, color: 'bg-blue-500' },
                { label: 'Interview Conversion', value: 42, color: 'bg-violet-500' },
                { label: 'Profile Completion', value: 95, color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-app-muted">{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2.5 bg-app-bg rounded-full overflow-hidden border border-app-border/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={`h-full ${item.color} rounded-full`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-[40px] premium-gradient text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors" />
            <h3 className="text-xl font-display font-bold mb-4">Agent Pro Tip</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
              "Candidates with <span className="text-white font-bold">video introductions</span> are 3x more likely to get interview calls. Encourage your students to record one today!"
            </p>
            <button className="w-full py-4 bg-white text-brand-blue font-bold rounded-2xl text-sm shadow-xl shadow-black/10 hover:scale-[1.02] transition-all active:scale-95">
              Send Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
