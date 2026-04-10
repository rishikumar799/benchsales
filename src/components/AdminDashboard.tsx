import { motion } from 'motion/react';
import { ShieldCheck, Users, Globe, Settings, Activity, ArrowUpRight, Database } from 'lucide-react';

export default function AdminDashboard() {
  const systemStats = [
    { label: 'Total Users', value: '2,842', icon: Users, color: 'text-blue-500' },
    { label: 'System Health', value: '99.9%', icon: Activity, color: 'text-emerald-500' },
    { label: 'API Requests', value: '1.2M', icon: Globe, color: 'text-violet-500' },
    { label: 'Storage Used', value: '42GB', icon: Database, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">System Administration</h1>
          <p className="text-gray-400">Global configuration and platform monitoring.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 glass text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors">
            View Logs
          </button>
          <button className="px-6 py-2.5 blue-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/20">
            System Update
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, i) => (
          <div key={i} className="p-8 rounded-[32px] glass border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-4xl font-display font-bold mb-1">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Configuration */}
        <div className="p-8 rounded-[32px] glass border-white/5">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-blue" />
            Global Configuration
          </h2>
          <div className="space-y-6">
            {[
              { label: 'Auto-Apply Threshold', value: '15 apps/day', type: 'range' },
              { label: 'AI Model Version', value: 'Gemini 1.5 Pro', type: 'select' },
              { label: 'n8n Webhook URL', value: 'https://n8n.internal/webhook/job-agent', type: 'input' },
              { label: 'Maintenance Mode', value: 'Disabled', type: 'toggle' },
            ].map((config, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                <div className="text-sm font-bold text-gray-300">{config.label}</div>
                <div className="text-sm font-mono text-brand-blue">{config.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Access */}
        <div className="p-8 rounded-[32px] glass border-white/5">
          <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Security & Access
          </h2>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="font-bold text-emerald-400 mb-2">Firewall Active</div>
              <p className="text-xs text-gray-400 leading-relaxed">
                All incoming requests are being filtered through the global security whitelist. No anomalies detected in the last 24 hours.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-2xl glass hover:bg-white/5 text-left">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">IP Whitelist</div>
                <div className="text-sm font-bold">124 Addresses</div>
              </button>
              <button className="p-4 rounded-2xl glass hover:bg-white/5 text-left">
                <div className="text-xs font-bold text-gray-500 uppercase mb-1">API Keys</div>
                <div className="text-sm font-bold">12 Active</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
