import React, { useState } from 'react';
import { motion } from 'motion/react';
import { usePlatformAdmin } from '../../../context/PlatformAdminContext';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Trash2, 
  Mail, 
  Building2,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  lastLogin: string;
  status: 'Active' | 'Suspended';
}

interface PlatformUsersProps {
  usersList: PlatformUser[];
  onToggleStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser?: (newUser: Omit<PlatformUser, 'id' | 'lastLogin'>) => void;
}

export default function PlatformUsers({ 
  usersList: propsUsersList, 
  onToggleStatus: propsOnToggleStatus, 
  onDeleteUser: propsOnDeleteUser,
  onAddUser: propsOnAddUser 
}: PlatformUsersProps) {
  const { users, toggleUserStatus, deleteUser, addUser } = usePlatformAdmin();
  const usersList = users && users.length > 0 ? users : propsUsersList;
  const onToggleStatus = toggleUserStatus || propsOnToggleStatus;
  const onDeleteUser = deleteUser || propsOnDeleteUser;
  const onAddUser = addUser || propsOnAddUser;
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [orgFilter, setOrgFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // New User Form Modal Trigger State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Company Admin');
  const [newOrg, setNewOrg] = useState('TechCorp Solutions');

  // Extracted unique roles & orgs for filters
  const roles = ['All', ...Array.from(new Set(usersList.map(u => u.role)))];
  const organizations = ['All', ...Array.from(new Set(usersList.map(u => u.organization)))];

  const filteredUsers = usersList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesOrg = orgFilter === 'All' || user.organization === orgFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesOrg && matchesStatus;
  });

  const totalUsers = usersList.length;
  const activeCount = usersList.filter(u => u.status === 'Active').length;
  const suspendedCount = usersList.filter(u => u.status === 'Suspended').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    onAddUser?.({
      name: newName,
      email: newEmail,
      role: newRole,
      organization: newOrg,
      status: 'Active'
    });
    setNewName('');
    setNewEmail('');
    setIsAddOpen(false);
  };

  return (
    <div id="platform-users-view" className="space-y-6">
      {/* Users Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users Registered', value: totalUsers, change: '+12.4% MoM', color: 'text-violet-500 bg-violet-500/10' },
          { label: 'Active Sessions Today', value: activeCount, change: '+9.6% Increase', color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Suspended Accounts', value: suspendedCount, change: '-4.2% Reduced', color: 'text-rose-500 bg-rose-500/10' },
          { label: 'New Signups (30d)', value: '3,860', change: '+24.1% Spike', color: 'text-blue-500 bg-blue-500/10' }
        ].map((st, idx) => (
          <div key={idx} className="p-6 rounded-[32px] glass border-app-border card-shadow">
            <span className="text-xs font-bold uppercase tracking-widest text-app-muted">{st.label}</span>
            <div className={`text-3xl font-display font-semibold mt-1 ${st.color.split(' ')[0]}`}>{st.value}</div>
            <div className="text-[10px] text-app-muted font-bold mt-1">{st.change}</div>
          </div>
        ))}
      </div>

      {/* Main Board Container */}
      <div className="p-6 sm:p-8 rounded-[32px] glass border-app-border card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-display font-bold">Manage Platform Users</h3>
            <p className="text-app-muted text-xs mt-1">Audit permissions, suspend/reactivate global credentials, and regulate administrative accounts.</p>
          </div>
          {onAddUser && (
            <button 
              onClick={() => setIsAddOpen(true)}
              className="px-5 py-3 bg-brand-blue text-white font-bold text-xs rounded-xl flex items-center gap-2 w-max cursor-pointer hover:bg-brand-blue/90"
            >
              <Plus className="w-4 h-4" /> Provision Platform Account
            </button>
          )}
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
            <input 
              type="text" 
              placeholder="Search user profiles by name, email, or company..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs text-app-text focus:outline-none focus:ring-1 focus:ring-brand-blue"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Roles</option>
              {roles.filter(r => r !== 'All').map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
            <select 
              value={orgFilter} 
              onChange={(e) => setOrgFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Tenants</option>
              {organizations.filter(o => o !== 'All').map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-app-surface border border-app-border text-xs font-semibold text-app-text focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table List */}
        <div className="overflow-x-auto rounded-2xl border border-app-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-app-surface border-b border-app-border text-[10px] font-bold uppercase tracking-wider text-app-muted">
                <th className="py-4 px-6">User Account</th>
                <th className="py-4 px-4">Role Designation</th>
                <th className="py-4 px-4">Organization</th>
                <th className="py-4 px-4">Last Activity</th>
                <th className="py-4 px-4">Security Status</th>
                <th className="py-4 px-6 text-center">Security Core Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-app-border/40 text-xs text-app-text">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const initial = user.name.charAt(0);
                  const colors = ['bg-violet-500/10 text-violet-500 border-violet-500/20', 'bg-blue-500/10 text-blue-500 border-blue-500/20', 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', 'bg-purple-500/10 text-purple-500 border-purple-500/20'];
                  const colorClass = colors[user.name.charCodeAt(0) % colors.length];

                  return (
                    <tr key={user.id} className="hover:bg-app-surface/20 transition-all">
                      <td className="py-4 px-6 font-semibold">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full ${colorClass} border flex items-center justify-center font-bold text-xs`}>
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-app-text text-sm">{user.name}</div>
                            <div className="text-xs text-app-muted flex items-center gap-1.5 mt-0.5">
                              <Mail className="w-3 h-3" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-app-text">
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-violet-500/10 text-violet-500 uppercase tracking-wide">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-app-muted flex items-center gap-1.5 mt-4">
                        <Building2 className="w-3.5 h-3.5" /> {user.organization}
                      </td>
                      <td className="py-4 px-4 text-app-muted font-medium">{user.lastLogin}</td>
                      <td className="py-4 px-4 font-semibold">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onToggleStatus(user.id)}
                            className={`px-3 py-1.5 border border-app-border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-app-surface/60 transition-all ${
                              user.status === 'Active' ? 'text-amber-500' : 'text-emerald-500'
                            }`}
                          >
                            {user.status === 'Active' ? (
                              <>
                                <Lock className="w-3.5 h-3.5" /> Suspend
                              </>
                            ) : (
                              <>
                                <Unlock className="w-3.5 h-3.5" /> Activate
                              </>
                            )}
                          </button>
                          <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="p-1.5 border border-rose-500/20 text-rose-500 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-app-muted">
                    No matching user accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Provisioning Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-[32px] bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 text-white text-xs font-semibold">
            <h3 className="text-xl font-display font-bold pb-2 border-b border-slate-800">Add Platform User Account</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Priyakant Sharma"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400">Role</label>
                  <select 
                    value={newRole} 
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
                  >
                    <option>Company Admin</option>
                    <option>Placement Officer</option>
                    <option>Marketplace Manager</option>
                    <option>Internal Recruiter</option>
                    <option>Platform Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Tenant Org</label>
                  <select 
                    value={newOrg} 
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl"
                  >
                    <option>TechCorp Solutions</option>
                    <option>ABC University</option>
                    <option>Global Recruiters</option>
                    <option>InnovateX</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-brand-blue rounded-xl text-white font-bold"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
