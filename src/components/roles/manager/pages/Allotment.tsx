import { motion } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ManagerAllotment() {
  const unassignedStudents = [
    { name: 'David Park', target: 'Data Science', registered: '1h ago', status: 'High Intent' },
    { name: 'Lisa Ray', target: 'Product', registered: '3h ago', status: 'Standard' },
    { name: 'James Clear', target: 'Sales', registered: '6h ago', status: 'Premium' },
  ];

  const agentWorkload = [
    { name: 'Agent Smith', active: 12, capacity: 20, rating: 4.8 },
    { name: 'Agent Johnson', active: 18, capacity: 20, rating: 4.5 },
    { name: 'Agent Brown', active: 5, capacity: 15, rating: 4.9 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Student Allotment</h1>
          <p className="text-app-muted">Assign newly registered students to appropriate agents.</p>
        </div>
        <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
          <Zap className="w-4 h-4 fill-white" /> Smart Auto-Allot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Unassigned Students */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-blue" />
              Unassigned Students
            </h2>
            <span className="text-xs font-bold text-app-muted">{unassignedStudents.length} Students</span>
          </div>
          
          <div className="space-y-4">
            {unassignedStudents.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-[28px] glass border-app-border flex items-center justify-between group hover:border-brand-blue/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center font-bold">
                    {s.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest">{s.target} • {s.registered}</div>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-white transition-all">
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Agent Workload */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-violet" />
              Agent Workload
            </h2>
            <button className="text-xs font-bold text-brand-violet">Refresh Stats</button>
          </div>

          <div className="space-y-4">
            {agentWorkload.map((a, i) => (
              <div key={i} className="p-6 rounded-[32px] glass border-app-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-violet/10 flex items-center justify-center font-bold text-brand-violet">
                      {a.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{a.name}</div>
                      <div className="text-xs font-bold text-emerald-500">Rating: {a.rating} ★</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-app-muted uppercase tracking-widest mb-1">Capacity</div>
                    <div className="text-sm font-bold">{a.active}/{a.capacity} Students</div>
                  </div>
                </div>
                <div className="h-2 bg-app-bg rounded-full overflow-hidden border border-app-border/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (a.active/a.capacity) > 0.8 ? 'bg-red-500' : 'bg-brand-blue'
                    }`}
                    style={{ width: `${(a.active/a.capacity) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
