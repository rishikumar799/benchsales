import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  UserPlus, 
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function UserManagement() {
  const users = [
    { name: 'Rishi Kumar', email: 'rishi@example.com', role: 'Student', status: 'Active', joined: 'Apr 24, 2024' },
    { name: 'Sarah Chen', email: 'sarah@example.com', role: 'Agent', status: 'Active', joined: 'Apr 20, 2024' },
    { name: 'Mike Ross', email: 'mike@law.com', role: 'Manager', status: 'Active', joined: 'Apr 15, 2024' },
    { name: 'Emma Wilson', email: 'emma@example.com', role: 'Student', status: 'Suspended', joined: 'Mar 12, 2024' },
    { name: 'David Park', email: 'david@example.com', role: 'Agent', status: 'Active', joined: 'Feb 28, 2024' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-2">User Management</h1>
          <p className="text-app-muted">Manage all platform users, roles, and access levels.</p>
        </div>
        <button className="px-6 py-3 premium-gradient text-white rounded-2xl text-sm font-bold shadow-lg shadow-brand-blue/20 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add New User
        </button>
      </div>

      <div className="p-8 rounded-[40px] glass border-app-border card-shadow">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input type="text" placeholder="Search by name, email or role..." className="w-full bg-app-bg/50 border border-app-border rounded-xl py-3 pl-11 pr-4 text-sm focus:border-brand-blue outline-none transition-all" />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
              <Filter className="w-4 h-4" /> Role
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-app-border text-sm font-semibold hover:bg-app-surface transition-all">
              <Shield className="w-4 h-4" /> Status
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-app-muted uppercase tracking-[0.2em] border-b border-app-border">
                <th className="pb-4 px-4 text-left">User</th>
                <th className="pb-4 px-4 text-left">Role</th>
                <th className="pb-4 px-4 text-left">Joined Date</th>
                <th className="pb-4 px-4 text-left">Status</th>
                <th className="pb-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/30">
              {users.map((user, i) => (
                <tr key={i} className="group hover:bg-app-surface/50 transition-all">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{user.name}</div>
                        <div className="text-[10px] font-bold text-app-muted">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      user.role === 'Manager' ? 'bg-violet-500/10 text-violet-500' : 
                      user.role === 'Agent' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-sm font-medium text-app-muted">{user.joined}</td>
                  <td className="py-5 px-4">
                    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {user.status}
                    </div>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-app-surface border border-app-border text-app-muted hover:text-brand-blue transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-app-surface border border-app-border text-app-muted hover:text-red-500 transition-all">
                        <Trash2 className="w-4 h-4" />
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
