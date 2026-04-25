import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  UserCheck, 
  MoreVertical,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function ManagerApprovals() {
  const pendingItems = [
    { name: 'Rishi Kumar', type: 'Student', role: 'Candidate', applyDate: '2h ago', risk: 'Low', documents: 'Verified' },
    { name: 'Sarah Chen', type: 'Agent', role: 'Premium Agent', applyDate: '5h ago', risk: 'Medium', documents: 'Pending' },
    { name: 'Alex Rivera', type: 'Student', role: 'Candidate', applyDate: '1d ago', risk: 'Low', documents: 'Verified' },
    { name: 'Emma Wilson', type: 'Student', role: 'Candidate', applyDate: '2d ago', risk: 'High', documents: 'Incomplete' },
    { name: 'Future Tech Inc', type: 'Partner', role: 'Enterprise', applyDate: '3d ago', risk: 'Low', documents: 'Verified' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">Pending Approvals</h1>
          <p className="text-app-muted">Review and verify new student and agent registrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 rounded-2xl bg-yellow-500/10 text-yellow-600 text-sm font-bold border border-yellow-500/20">
            {pendingItems.length} Pending Review
          </div>
          <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Batch Approve
          </button>
        </div>
      </div>

      <div className="p-6 rounded-[32px] glass border-app-border">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input type="text" placeholder="Search by name or type..." className="w-full bg-app-bg/50 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-blue transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
            <Filter className="w-4 h-4" /> Type
          </button>
        </div>

        <div className="space-y-4">
          {pendingItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-[28px] glass border-app-border hover:border-brand-blue/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center text-xl font-bold">
                  {item.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                      item.type === 'Student' ? 'bg-blue-500/10 text-blue-500' : 
                      item.type === 'Agent' ? 'bg-violet-500/10 text-violet-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-app-muted font-bold underline cursor-pointer hover:text-brand-blue">View Documents ({item.documents})</span>
                    <span className="text-[10px] font-bold text-app-muted uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.applyDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 md:justify-end">
                <div className="text-right mr-4 hidden lg:block">
                  <div className="text-[10px] font-bold text-app-muted uppercase tracking-widest mb-1">Risk Score</div>
                  <div className={`text-xs font-bold ${
                    item.risk === 'Low' ? 'text-emerald-500' : 
                    item.risk === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                  }`}>{item.risk} Risk</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-app-surface border border-app-border text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
