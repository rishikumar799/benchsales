import { motion } from 'motion/react';
import { ShieldCheck, Users, Globe, Settings, Activity, ArrowUpRight, Database, CheckCircle2, XCircle, Phone, BarChart3, Zap, X } from 'lucide-react';

export default function AdminDashboard() {
  const systemStats = [
    { label: 'Total Revenue', value: '$12,450', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Users', value: '1,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'System Load', value: '14%', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Security Alerts', value: '0', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const pendingApprovals = [
    { name: 'John Doe', role: 'student', phone: '+1 234 567 890', email: 'john@example.com', avatar: 'JD' },
    { name: 'Jane Smith', role: 'agent', phone: '+1 987 654 321', email: 'jane@example.com', avatar: 'JS' },
    { name: 'Mike Ross', role: 'manager', phone: '+1 555 012 345', email: 'mike@law.com', avatar: 'MR' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Super Admin Panel</h1>
          <p className="text-app-muted text-lg">Global platform control and <span className="text-emerald-500 font-bold">real-time</span> system monitoring.</p>
        </motion.div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-3 glass border-app-border text-app-text text-sm font-bold rounded-2xl hover:bg-app-surface transition-all flex items-center gap-2">
            <Activity className="w-4 h-4" /> System Logs
          </button>
          <button className="px-6 py-3 premium-gradient text-white text-sm font-bold rounded-2xl shadow-xl shadow-brand-blue/20 flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95">
            <Settings className="w-4 h-4" /> Global Config
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="p-8 rounded-[32px] glass border-app-border card-shadow relative overflow-hidden group"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors" />
            <div className={`w-14 h-14 rounded-2xl ${stat.bg || 'bg-app-surface'} flex items-center justify-center mb-6 shadow-inner`}>
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
            <h2 className="text-2xl font-display font-bold">Access Requests</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase tracking-widest">3 Pending</span>
            </div>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((request, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="p-6 rounded-[32px] glass border-app-border flex items-center justify-between group hover:bg-app-surface/50 transition-all card-shadow"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center text-white font-display font-bold shadow-lg">
                    {request.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-app-text text-lg">{request.name}</div>
                    <div className="text-xs font-bold text-app-muted uppercase tracking-widest">{request.role} • {request.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                  </button>
                  <button className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.05] transition-all active:scale-95">
                    Approve
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
            <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-2">
              <Settings className="w-6 h-6 text-brand-violet" />
              Global Config
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Manager Secret Code', value: 'BENCH_ADMIN_2024', type: 'password' },
                { label: 'Auto-Approval', value: 'Disabled', type: 'toggle' },
                { label: 'Maintenance Mode', value: 'Off', type: 'toggle' },
              ].map((config, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-app-surface border border-app-border/50">
                  <div>
                    <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest mb-1">{config.label}</div>
                    <div className="text-sm font-bold">{config.value}</div>
                  </div>
                  <button className="text-brand-blue font-bold text-xs hover:underline">Edit</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 premium-gradient text-white font-bold rounded-2xl text-sm shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-all">
              Save All Changes
            </button>
          </div>

          <div className="p-8 rounded-[40px] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-lg font-display font-bold">System Health</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-app-muted font-medium">Database</span>
                <span className="text-emerald-500 font-bold">Optimal</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-app-muted font-medium">AI Engine</span>
                <span className="text-emerald-500 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-app-muted font-medium">API Gateway</span>
                <span className="text-emerald-500 font-bold">99.9% Up</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
