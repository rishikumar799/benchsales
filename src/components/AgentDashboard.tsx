import { motion } from 'motion/react';
import { Users, Zap, BarChart3, Clock, ArrowUpRight, Search, Filter } from 'lucide-react';

export default function AgentDashboard() {
  const stats = [
    { label: 'Active Students', value: '42', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Apps Sent (24h)', value: '482', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Success Rate', value: '8.4%', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Avg. Response', value: '1.2d', icon: Clock, color: 'text-violet-500', bg: 'bg-violet-500/10' },
  ];

  const students = [
    { name: 'Rishi Kumar', email: 'rishi@example.com', apps: 154, status: 'Active', lastActive: '2m ago' },
    { name: 'Sarah Chen', email: 'sarah@example.com', apps: 89, status: 'Active', lastActive: '15m ago' },
    { name: 'Alex Rivera', email: 'alex@example.com', apps: 210, status: 'Paused', lastActive: '1d ago' },
    { name: 'Emma Wilson', email: 'emma@example.com', apps: 45, status: 'Active', lastActive: '1h ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Agent Overview</h1>
          <p className="text-gray-400">Managing 42 active job search agents.</p>
        </div>
        <button className="px-6 py-2.5 blue-gradient text-white text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/20">
          Generate Weekly Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl glass border-white/5">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-display font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[32px] glass border-white/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold">Student Management</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search students..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-blue"
              />
            </div>
            <button className="p-2 glass rounded-xl text-gray-400 hover:text-white"><Filter className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-white/5">
                <th className="pb-4 px-4">Student</th>
                <th className="pb-4 px-4">Total Apps</th>
                <th className="pb-4 px-4">Status</th>
                <th className="pb-4 px-4">Last Active</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student, i) => (
                <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full blue-gradient flex items-center justify-center font-bold text-white">
                        {student.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono text-sm">{student.apps}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-400">{student.lastActive}</td>
                  <td className="py-4 px-4 text-right">
                    <button className="text-brand-blue font-bold text-sm hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
