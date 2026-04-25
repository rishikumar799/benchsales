import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  ChevronRight,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';

export default function MyStudents() {
  const students = [
    { name: 'Rishi Kumar', email: 'rishi@example.com', target: 'Frontend', apps: 45, interviews: 3, status: 'Active' },
    { name: 'Sarah Chen', email: 'sarah@example.com', target: 'Backend', apps: 32, interviews: 1, status: 'Active' },
    { name: 'Alex Rivera', email: 'alex@example.com', target: 'UI/UX', apps: 12, interviews: 0, status: 'Onboarding' },
    { name: 'Emma Wilson', email: 'emma@example.com', target: 'Fullstack', apps: 89, interviews: 5, status: 'Active' },
    { name: 'David Park', email: 'david@example.com', target: 'Data Science', apps: 5, interviews: 0, status: 'Inactive' },
    { name: 'Lisa Ray', email: 'lisa@example.com', target: 'Product', apps: 28, interviews: 2, status: 'Active' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">My Students</h1>
          <p className="text-app-muted">Monitor and manage all students assigned to you.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-app-surface border border-app-border rounded-2xl text-sm font-bold hover:border-brand-blue transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Stats Mini Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Today', value: '18', color: 'text-emerald-500' },
          { label: 'Pending Review', value: '5', color: 'text-yellow-500' },
          { label: 'Avg Apps/Student', value: '34', color: 'text-brand-blue' }
        ].map((s, i) => (
          <div key={i} className="p-6 rounded-[32px] glass border-app-border flex items-center justify-between">
            <span className="text-sm font-bold text-app-muted uppercase tracking-widest">{s.label}</span>
            <span className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-[32px] glass border-app-border">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input type="text" placeholder="Search by name, email or target..." className="w-full bg-app-bg/50 border border-app-border rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-blue transition-all" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] border-b border-app-border">
                <th className="pb-4 px-4 font-bold">Student</th>
                <th className="pb-4 px-4 font-bold">Target Industry</th>
                <th className="pb-4 px-4 font-bold text-center">Applications</th>
                <th className="pb-4 px-4 font-bold text-center">Interviews</th>
                <th className="pb-4 px-4 font-bold">Status</th>
                <th className="pb-4 px-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/30">
              {students.map((student, i) => (
                <tr key={i} className="group hover:bg-app-surface/50 transition-all">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white text-xs font-bold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-app-text">{student.name}</div>
                        <div className="text-[10px] font-bold text-app-muted">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-lg bg-app-surface border border-app-border text-xs font-bold text-app-muted">{student.target}</span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-sm">{student.apps}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm font-bold text-brand-violet">{student.interviews}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                      student.status === 'Onboarding' ? 'bg-blue-500/10 text-blue-500' : 'bg-app-muted/10 text-app-muted'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        student.status === 'Active' ? 'bg-emerald-500' : 
                        student.status === 'Onboarding' ? 'bg-blue-500' : 'bg-app-muted'
                      }`} />
                      {student.status}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-app-surface border border-app-border text-app-muted hover:text-brand-blue transition-all">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-app-surface border border-app-border text-app-muted hover:text-brand-blue transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
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
