import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  MoreVertical, 
  ExternalLink,
  ChevronDown,
  Building2,
  Calendar,
  Zap
} from 'lucide-react';

export default function StudentApplications() {
  const applications = [
    { company: 'Google', role: 'Frontend Engineer', status: 'Interview', date: 'Apr 24, 2024', location: 'Mountain View, CA', salary: '$180k - $220k', type: 'Full-time' },
    { company: 'Meta', role: 'Product Designer', status: 'Applied', date: 'Apr 23, 2024', location: 'Menlo Park, CA', salary: '$160k - $210k', type: 'Remote' },
    { company: 'Stripe', role: 'Fullstack Developer', status: 'Applied', date: 'Apr 22, 2024', location: 'San Francisco, CA', salary: '$170k - $195k', type: 'Hybrid' },
    { company: 'Vercel', role: 'Solutions Architect', status: 'Rejected', date: 'Apr 20, 2024', location: 'Remote', salary: '$150k - $185k', type: 'Remote' },
    { company: 'Amazon', role: 'SDE II', status: 'Assessment', date: 'Apr 18, 2024', location: 'Seattle, WA', salary: '$165k - $205k', type: 'Full-time' },
    { company: 'Netflix', role: 'Senior UI Engineer', status: 'Applied', date: 'Apr 15, 2024', location: 'Los Gatos, CA', salary: '$250k - $300k', type: 'Remote' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">My Applications</h1>
          <p className="text-app-muted">Track and manage all your active job applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-app-surface border border-app-border rounded-2xl text-sm font-bold hover:border-brand-blue transition-all flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-blue" />
            Optimize with AI
          </button>
          <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20">
            Export List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 rounded-[32px] glass border-app-border flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
          <input 
            type="text" 
            placeholder="Search by company or role..."
            className="w-full bg-app-bg/50 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-blue transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
            <Filter className="w-4 h-4" />
            Status
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
            Job Type
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 rounded-[32px] glass border-app-border hover:border-brand-blue/30 transition-all group card-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-app-surface border border-app-border flex items-center justify-center text-2xl font-bold group-hover:border-brand-blue transition-all">
                  {app.company.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold group-hover:text-brand-blue transition-colors">{app.role}</h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-app-muted text-sm font-medium">
                      <Building2 className="w-4 h-4" />
                      {app.company}
                    </div>
                    <div className="flex items-center gap-1.5 text-app-muted text-sm font-medium">
                      <Briefcase className="w-4 h-4" />
                      {app.type}
                    </div>
                    <div className="text-brand-blue text-sm font-bold">{app.salary}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 justify-between lg:justify-end">
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${
                      app.status === 'Interview' ? 'text-violet-500' : 
                      app.status === 'Rejected' ? 'text-red-500' : 'text-emerald-500'
                    }`}>
                      {app.status}
                    </div>
                    <div className="flex items-center gap-1.5 text-app-muted text-xs font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {app.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-5 py-2.5 bg-app-surface border border-app-border rounded-xl text-xs font-bold hover:bg-app-bg transition-all flex items-center gap-2">
                    View Specs <ExternalLink className="w-3 h-3" />
                  </button>
                  <button className="p-2.5 rounded-xl hover:bg-app-surface text-app-muted hover:text-app-text transition-all">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
