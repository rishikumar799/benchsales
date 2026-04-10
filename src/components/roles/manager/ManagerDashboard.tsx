import { motion } from 'motion/react';
import { Users, Zap, ShieldCheck, Phone, CheckCircle2, ArrowRight, Filter, Search, MoreVertical } from 'lucide-react';

export default function ManagerDashboard() {
  const stats = [
    { label: 'Pending Students', value: '12', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: '+4' },
    { label: 'Follow-ups Today', value: '8', icon: Phone, color: 'text-violet-500', bg: 'bg-violet-500/10', trend: 'High' },
    { label: 'Total Approved', value: '154', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: '+12%' },
    { label: 'Active Agents', value: '6', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', trend: 'Stable' },
  ];

  const followUpQueue = [
    { name: 'Rishi Kumar', type: 'Student', reason: 'New Signup', time: '10m ago', priority: 'High' },
    { name: 'Sarah Chen', type: 'Agent', reason: 'Verification', time: '45m ago', priority: 'Medium' },
    { name: 'Alex Rivera', type: 'Student', reason: 'Incomplete Profile', time: '2h ago', priority: 'Low' },
  ];

  const agentPerformance = [
    { name: 'Agent Smith', students: 12, success: 92, avatar: 'AS' },
    { name: 'Agent Johnson', students: 8, success: 85, avatar: 'AJ' },
    { name: 'Agent Brown', students: 15, success: 88, avatar: 'AB' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Manager Dashboard</h1>
          <p className="text-app-muted text-lg">Overseeing <span className="text-brand-violet font-bold">6 agents</span> and <span className="text-brand-blue font-bold">12 pending</span> approvals.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 glass border-app-border text-app-text text-sm font-bold rounded-2xl hover:bg-app-surface transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Views
          </button>
          <button className="px-6 py-3 premium-gradient text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
            <Phone className="w-4 h-4" /> Start Follow-up Queue
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
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-violet/5 rounded-full blur-2xl group-hover:bg-brand-violet/10 transition-colors" />
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center shadow-inner`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <span className="text-[10px] font-bold text-app-muted bg-app-surface px-2 py-1 rounded-lg border border-app-border">{stat.trend}</span>
            </div>
            <div className="text-4xl font-display font-bold mb-1 tracking-tight">{stat.value}</div>
            <div className="text-sm font-bold uppercase tracking-widest text-app-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-display font-bold">Follow-up Queue</h2>
            <button className="text-sm font-bold text-brand-blue hover:text-brand-violet transition-colors">View History</button>
          </div>

          <div className="space-y-4">
            {followUpQueue.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-5 rounded-3xl glass border-app-border flex items-center justify-between group hover:bg-app-surface/50 transition-all card-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg ${
                    item.priority === 'High' ? 'bg-red-500' : item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-app-text">{item.name}</div>
                    <div className="text-xs font-bold text-app-muted uppercase tracking-widest">{item.type} • {item.reason}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-bold text-app-muted mb-1">{item.time}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${
                      item.priority === 'High' ? 'text-red-500' : item.priority === 'Medium' ? 'text-yellow-500' : 'text-blue-500'
                    }`}>
                      {item.priority} Priority
                    </div>
                  </div>
                  <button className="px-5 py-2 rounded-xl bg-app-surface border border-app-border text-xs font-bold hover:bg-app-bg transition-all">
                    Call Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <h3 className="text-xl font-display font-bold mb-6">Agent Performance</h3>
            <div className="space-y-6">
              {agentPerformance.map((agent, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white text-xs font-bold">
                      {agent.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{agent.name}</div>
                      <div className="text-[10px] text-app-muted font-bold uppercase tracking-widest">{agent.students} Students</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-emerald-500">{agent.success}%</div>
                    <div className="text-[10px] text-app-muted font-bold uppercase tracking-widest">Success</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl border border-app-border text-app-muted text-sm font-bold hover:bg-app-surface transition-all">
              View Detailed Analytics
            </button>
          </div>

          <div className="p-8 rounded-[40px] bg-brand-blue/5 border border-brand-blue/20 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-blue/10 rounded-full blur-3xl group-hover:bg-brand-blue/20 transition-colors" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-brand-blue" />
              </div>
              <h3 className="text-lg font-display font-bold">Manager Tip</h3>
            </div>
            <p className="text-app-muted text-sm leading-relaxed mb-6 font-medium">
              "Approving students within <span className="text-brand-blue font-bold">2 hours</span> of signup increases their engagement rate by 45%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
